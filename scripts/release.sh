#!/usr/bin/env bash
# Release flow for a protected main: `start` opens a version-bump pull request,
# `publish` tags the merged commit. Env: VER, TITLE, SKIP_CHECKS=1, YES=1.
# Usage: scripts/release.sh start|publish
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

die() { echo "release: $*" >&2; exit 1; }

confirm() {
  [[ "${YES:-}" == "1" ]] && return 0
  [[ -t 0 ]] || die "no terminal to confirm on; re-run with YES=1"
  local answer
  read -r -p "$1 [y/N] " answer
  [[ "${answer}" =~ ^[yY]([eE][sS])?$ ]]
}

pkg_version() { node -p 'require("./package.json").version'; }

require_clean_main() {
  [[ "$(git rev-parse --abbrev-ref HEAD)" == "main" ]] || die "not on main"
  [[ -z "$(git status --porcelain)" ]] || die "working tree is not clean"
  git fetch -q origin main --tags || die "git fetch origin failed"
  [[ "$(git rev-parse HEAD)" == "$(git rev-parse origin/main)" ]] \
    || die "main is not up to date with origin/main (pull or push first)"
}

# Any tag for the same X.Y.Z counts: a title suffix must not republish a version.
tag_exists() {
  [[ -n "$(git tag --list "$1" "$1-*")" ]] && return 0
  [[ -n "$(git ls-remote --tags origin "refs/tags/$1" "refs/tags/$1-*")" ]]
}

start() {
  require_clean_main
  command -v gh >/dev/null && gh auth status >/dev/null 2>&1 || die "gh is missing or not authenticated"

  if [[ "${SKIP_CHECKS:-}" == "1" ]]; then
    echo "release: skipping pre-release checks (SKIP_CHECKS=1)"
  else
    echo "release: running pre-release checks (scripts/release-checks.sh)"
    bash scripts/release-checks.sh || die "pre-release checks failed; nothing was changed"
  fi

  local current ver title slug tag branch
  current="$(pkg_version)"
  ver="${VER:-}"
  if [[ -z "${ver}" ]]; then
    [[ -t 0 ]] || die "VER is required when not on a terminal (make release VER=x.y.z TITLE=... YES=1)"
    read -r -p "Release version (current: ${current}): " ver
  fi
  [[ "${ver}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "invalid VER '${ver}' (expected X.Y.Z)"
  [[ "${ver}" != "${current}" && "$(printf '%s\n%s\n' "${current}" "${ver}" | sort -V | tail -n 1)" == "${ver}" ]] \
    || die "VER ${ver} must be greater than the current version ${current}"

  if [[ -z "${TITLE+x}" ]]; then
    [[ -t 0 ]] || die "TITLE is required when not on a terminal (use TITLE= for none)"
    read -r -p "Release title (optional): " title
  else
    title="${TITLE}"
  fi
  slug="$(printf '%s' "${title}" | sed -E 's/[[:space:]]+/-/g; s/[^A-Za-z0-9._-]//g; s/^-+//; s/-+$//')"
  tag="v${ver}${slug:+-${slug}}"
  branch="release-v${ver}"

  tag_exists "v${ver}" && die "a tag for version ${ver} already exists"
  git rev-parse -q --verify "refs/heads/${branch}" >/dev/null && die "branch ${branch} already exists locally"
  [[ -z "$(git ls-remote --heads origin "${branch}")" ]] || die "branch ${branch} already exists on origin"

  trap 'echo "release: failed; to clean up: git switch main && git branch -D ${branch}" >&2' ERR
  git switch -q -c "${branch}"
  npm version --no-git-tag-version "${ver}" >/dev/null
  git add -- package.json package-lock.json
  local subject="[noissue] - Release ${tag}"
  git commit -q -m "${subject}"
  trap - ERR

  echo "release: tag ${tag}, version ${ver}, branch ${branch}"
  git show --stat --format= HEAD
  if confirm "Push the branch and open the pull request?"; then
    git push -u origin "${branch}"
    gh pr create --base main --head "${branch}" --title "${subject}" \
      --body "Release ${tag}. The tag is created on the merged commit after merge with \`make release-publish\`."
  else
    echo "release: later, run:"
    echo "  git push -u origin ${branch}"
    echo "  gh pr create --base main --head ${branch} --title \"${subject}\""
  fi
}

publish() {
  require_clean_main
  local subject tag ver
  subject="$(git log -1 --format=%s)"
  [[ "${subject}" =~ ^\[noissue\]\ -\ Release\ (v([0-9]+\.[0-9]+\.[0-9]+)(-[A-Za-z0-9._-]+)?)\ \(#[0-9]+\)$ ]] \
    || die "HEAD is not a merged release commit: '${subject}'"
  tag="${BASH_REMATCH[1]}"
  ver="${BASH_REMATCH[2]}"
  [[ "$(pkg_version)" == "${ver}" ]] || die "package.json is $(pkg_version) at HEAD, expected ${ver}"
  tag_exists "v${ver}" && die "a tag for version ${ver} already exists"

  confirm "Create tag ${tag} on $(git rev-parse --short HEAD) and push it? This starts the release pipeline." \
    || die "aborted"
  git tag -a "${tag}" -m "${tag}"
  git push origin "refs/tags/${tag}"
  echo "release: pushed ${tag}"
}

case "${1:-}" in
  start) start ;;
  publish) publish ;;
  *) die "usage: release.sh start|publish" ;;
esac
