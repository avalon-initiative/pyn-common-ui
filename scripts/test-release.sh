#!/usr/bin/env bash
# Exercises scripts/release.sh against a throwaway repo, a bare origin and a stub gh. No network.
set -uo pipefail

src="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "${tmp}"' EXIT
fail=0

ok() { echo "ok   $1"; }
bad() { echo "FAIL $1"; fail=1; }
expect() { [[ "$2" == "$3" ]] && ok "$1" || bad "$1 (got '$2', want '$3')"; }

mkdir "${tmp}/bin"
cat > "${tmp}/bin/gh" <<STUB
#!/usr/bin/env bash
echo "\$*" >> "${tmp}/gh.log"
[[ "\${1:-}" == "pr" ]] && echo "https://example.invalid/pull/7"
exit 0
STUB
chmod +x "${tmp}/bin/gh"
export PATH="${tmp}/bin:${PATH}"
export GIT_CONFIG_GLOBAL=/dev/null GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t

git init -q --bare "${tmp}/origin.git"
git init -q -b main "${tmp}/w"
cd "${tmp}/w"
mkdir scripts
cp "${src}/scripts/release.sh" scripts/
printf '#!/usr/bin/env bash\nexit "${CHECKS_EXIT:-0}"\n' > scripts/release-checks.sh
printf '{"name":"x","version":"0.1.2","lockfileVersion":3,"requires":true,"packages":{"":{"name":"x","version":"0.1.2"}}}\n' > package-lock.json
printf '{"name":"x","version":"0.1.2"}\n' > package.json
git add . && git commit -q -m init
git remote add origin "${tmp}/origin.git"
git push -q -u origin main

rel() { bash scripts/release.sh "$@" </dev/null >"${tmp}/out" 2>&1; local rc=$?; [[ -n "${SHOW:-}" ]] && cat "${tmp}/out"; return $rc; }
refs() { git -C "${tmp}/origin.git" for-each-ref --format='%(refname)' | tr '\n' ' '; }

echo dirty > junk; rel start; expect "dirty tree refused" "$?" 1; rm junk
VER=0.1.2 TITLE= rel start; expect "same version refused" "$?" 1
VER=0.1.1 TITLE= rel start; expect "lower version refused" "$?" 1
VER=0.1 TITLE= rel start; expect "bad version refused" "$?" 1
VER=0.1.3 rel start; expect "no terminal, no TITLE refused" "$?" 1
CHECKS_EXIT=1 VER=0.1.3 TITLE= YES=1 rel start; expect "failing checks abort" "$?" 1
expect "failing checks change nothing" "$(git branch --list 'release-*')" ""
git tag v0.1.3-old; VER=0.1.3 TITLE=x rel start; expect "existing tag refused" "$?" 1; git tag -d v0.1.3-old >/dev/null
git commit -q --allow-empty -m ahead; VER=0.1.3 TITLE= rel start; expect "ahead of origin refused" "$?" 1
git reset -q --hard origin/main

VER=0.1.3 TITLE="Policy editor: polish!" YES=1 rel start; expect "release succeeds" "$?" 0
expect "branch created" "$(git rev-parse --abbrev-ref HEAD)" release-v0.1.3
expect "subject" "$(git log -1 --format=%s)" "[noissue] - Release v0.1.3-Policy-editor-polish"
expect "files changed" "$(git show --name-only --format= HEAD | tr '\n' ' ')" "package-lock.json package.json "
expect "package.json bumped" "$(node -p 'require("./package.json").version')" 0.1.3
expect "lockfile bumped" "$(node -p 'require("./package-lock.json").version')" 0.1.3
expect "no tag yet" "$(git tag | tr '\n' ' ')" ""
expect "only branch pushed" "$(refs)" "refs/heads/main refs/heads/release-v0.1.3 "
grep -q '^pr create .*--head release-v0.1.3' "${tmp}/gh.log" && ok "gh pr create called" || bad "gh pr create called"

git switch -q main
VER=0.1.3 TITLE= rel start; expect "existing branch refused" "$?" 1
rel publish; expect "publish on non-release commit refused" "$?" 1

# Simulate the squash merge on origin, then pull.
git merge -q --squash release-v0.1.3 && git commit -q -m "[noissue] - Release v0.1.3-Policy-editor-polish (#7)"
git push -q origin main
echo x > junk; rel publish; expect "publish dirty refused" "$?" 1; rm junk
YES=1 rel publish; expect "publish succeeds" "$?" 0
expect "annotated tag" "$(git cat-file -t v0.1.3-Policy-editor-polish)" tag
expect "only tag pushed" "$(refs)" "refs/heads/main refs/heads/release-v0.1.3 refs/tags/v0.1.3-Policy-editor-polish "
YES=1 rel publish; expect "publish twice refused" "$?" 1

git commit -q --allow-empty -m "[noissue] - Release v0.1.4 (#8)"; git push -q origin main
YES=1 rel publish; expect "version mismatch refused" "$?" 1

bash "${src}/scripts/verify-release-version.sh" v0.1.2-x >/dev/null 2>&1
cd "${src}"
v="$(node -p 'require("./package.json").version')"
bash scripts/verify-release-version.sh "v${v}-some-title" >/dev/null && ok "verify accepts title suffix" || bad "verify accepts title suffix"
bash scripts/verify-release-version.sh "v${v}x" >/dev/null 2>&1 && bad "verify rejects junk suffix" || ok "verify rejects junk suffix"

exit "${fail}"
