# pyn-common-ui

Shared Vue 3 component library for pyn's web clients (the pyn web UI and the
hosted-service pages), developed and documented in Storybook.
Published as `@avalon-initiative/pyn-common-ui`.

The library holds presentation only: no network calls and no pyn API logic.
Components take data in through props and report intent through events.

## Install

The release workflow currently publishes to GitHub Packages, which requires an
auth token with `read:packages` even for public packages. Map the scope in your
`.npmrc`:

```ini
@avalon-initiative:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm install @avalon-initiative/pyn-common-ui
```

Locally, `NODE_AUTH_TOKEN` is a personal access token with `read:packages`
(`export NODE_AUTH_TOKEN=$(gh auth token)` works once `gh auth refresh -s read:packages`
has been run). In GitHub Actions, give the job `permissions: packages: read`, set
`registry-url: https://npm.pkg.github.com` and `scope: '@avalon-initiative'` on
`actions/setup-node`, and pass `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` to the
install step.

`vue` (^3.5) is a peer dependency.

## Use

Import the stylesheets once at your app's entry point, then import components:

```ts
import '@avalon-initiative/pyn-common-ui/tokens.css' // design tokens (CSS custom properties)
import '@avalon-initiative/pyn-common-ui/global.css' // base page styles
import '@avalon-initiative/pyn-common-ui/style.css' // component styles

import { PynButton } from '@avalon-initiative/pyn-common-ui'
```

Colors, spacing and radii come from the `--pyn-*` tokens in `tokens.css`
(dark by default, light by OS preference or `data-theme`); components never
hardcode a color.

Theme handling is exported for the app to wire to its own control:
`themeChoices`, `loadTheme()`, `saveTheme(choice)` and `applyTheme(choice)`
(`system` removes the `data-theme` pin so the OS preference decides). Pure
helpers are exported too: `formatDate`, `formatDateTime`, `formatAgo`, `formatWait`,
`formatLease`, `lockState` and `EXPIRING_SOON_MS`.

## Develop

```bash
make install         # npm ci
make storybook       # Storybook on http://localhost:6006
make watch           # rebuild dist/ on change, for a linked app
make check           # lint, format check, type-check, component tests, build, smoke test
make build-storybook # static Storybook build
make help            # everything else
```

Conventions:

- `src/components/` holds only `.vue` files; `src/styles/` holds only
  `.module.scss` (CSS Modules, one per component, bound with `:class`), the
  plain `tokens.css` and `global.css`, and `_mixins.scss` (library-internal,
  pulled in with `@use 'mixins' as m;` and never shipped on its own); `src/stories/` holds `.stories.ts` and the shared `*-data.ts` fixtures they use;
  `src/types/` holds `*.types.ts`; `src/state/` holds extracted script logic
  that is not markup; `src/utils/` holds pure helpers.
- Components are named `Pyn<Name>`.
- No `<style>` blocks in `.vue` files (lint enforces it) and `<script setup>`
  stays glue-only.
- Icons are hand-drawn 24x24 stroke paths using `currentColor`; there is no
  icon-library dependency.
- Responsive behavior lives in each component's own stylesheet. Never fork a
  component into a mobile variant. Three layout pitfalls to check for on any
  row or column layout: a wrapping flex row whose text column is `flex: 1`
  (zero basis) never wraps its siblings and instead shrinks the text to an
  ellipsis, so give it a minimum basis (`flex: 1 1 8rem`); a column layout with
  `align-items: flex-start` sizes each child to its longest unbreakable word,
  so use `stretch`; and message bodies need `overflow-wrap: anywhere`
  (`break-word` does not reduce min-content width).
- Every component has a story and a render test in `tests/ui-components.test.ts`.

### Working on the library from an app (dev link)

For day-to-day work, link the checkout into the app instead of releasing:

```bash
# in pyn-common-ui
make watch                                  # builds dist/, then rebuilds on every change
npm link                                    # once

# in the app (pyn-web)
npm link @avalon-initiative/pyn-common-ui
```

The app's Vite config needs `resolve: { dedupe: ['vue'] }` so the linked copy
and the app share one `vue`. Run `npm install` in the app (or
`npm unlink @avalon-initiative/pyn-common-ui && npm install`) to go back to
the published version; never commit a linked dependency. Component work that
needs no app belongs in Storybook (`make storybook`).

### Trying a packed build in an app

```bash
make pack                                   # produces avalon-initiative-pyn-common-ui-<version>.tgz
cd ../your-app && npm install ../pyn-common-ui/avalon-initiative-pyn-common-ui-<version>.tgz
```

Restore the app's dependency to the published version before merging.

## Release

Versions are semver. `main` is protected, so a release is a pull request
followed by a tag on the merged commit. From an up-to-date `main`:

```bash
make release VER=0.1.5 TITLE="Optional title"   # checks, release-v0.1.5 branch, version bump, pull request
# review and squash-merge the pull request, then:
git switch main && git pull
make release-publish                            # tags the merged commit and pushes only the tag
```

`make release` runs the pre-release checks first (`make release-skip-tests`
skips them) and changes nothing if they fail or if `main` is dirty or behind
`origin/main`. It prompts for a missing `VER` or `TITLE`, bumps `package.json`
and the lockfile on a `release-v<VER>` branch, commits
`[noissue] - Release v<VER>[-title-slug]`, and, after a confirmation, pushes the
branch and opens the pull request. `make release-publish` requires `main` to sit
on that squash-merged commit, then creates the annotated tag
`v<VER>[-title-slug]` on it and pushes the tag (`YES=1` skips the questions).
The title slug is only part of the tag name: the published npm version is always
the `X.Y.Z` in `package.json`, published to the `latest` dist-tag.

Pushing the tag starts the
release workflow: it verifies the tag matches `package.json`, requires the
tagged commit to be on `main`, reruns the checks, publishes the package, and
creates a GitHub Release with the packed tarball. The registry and scope are
set in the `env` block at the top of `.github/workflows/release.yml`.
Published versions are immutable; ship a fix as a new version.

## Components

The library holds the whole presentation layer of the pyn web UI: `PynButton`, the primitives (`PynIcon`, `PynLockIcon`, `PynModeChip`, `PynLockBadge`, `PynMenu`, `PynCloneMenu` (a Clone button for the repository header opening a panel with read-only `httpsUrl` and `command` fields, an `sshUrl` row only when given, and a Copy button each that emits `copy` with `'https'`, `'command'` or `'ssh'`; `label` defaults to Clone; Escape or an outside click closes it), `PynSearch`, `PynBreadcrumb`, `PynBreadcrumbs`, `PynPageNotFound`, `PynRepoNotFound`, `PynAccountNotice`, `PynUpdateNotice`, `PynResendForm`, `PynDrawer`, `PynEmptyState` (its `commands` prop lists commands one per line), `PynSecurityNotice`, `PynMultiSelect`), the shell and headers (`PynShell` (its `bare` prop is deprecated and ignored; its `breadcrumbs` prop shows the path above the content; its content sits in a centered `PynPage` and `wide` lifts the width limit), `PynPage` (centered container, max width `--pyn-page-max` 1280px, gutters 16px and 24px from 1012px; `wide` drops the max width for the code view and policy editor), `PynPageColumns` (main column plus a `side` slot of `--pyn-side-width` 296px that stacks under the main column below 1012px; `sticky` defaults on, `sideLabel` names the side landmark), `PynTopBar` (see the global top bar below), `PynSideNav`, `PynRepoShell` (its `hidePath` prop drops the owner and name path and its heading, for pages that show breadcrumbs), `PynRepoSettings`, `PynOrgHeader`, `PynUserHeader`, `PynBranchBar`, `PynBranchPicker` (fixed `--pyn-branch-picker-width` trigger, default 14rem, the name truncates; the menu floats), `PynBranchCompare`), and the files and content views (`PynTree`, `PynFileList`, `PynFileBar`, `PynFileView`, `PynCodeView`, `PynMarkdown`, `PynReadme`, `PynHistory`, `PynActivity`, `PynLockedFiles`, `PynRepoLanding`, `PynRepoDetails`, `PynCheckoutCard`) with the markdown, code and line-range helpers, and the repository management views (`PynRepoForm` and `PynOrgForm` (`cancelHref` or `cancelLabel` adds a Cancel action and the `cancel` event; `nameCanonical` shows a "Will be created as" preview), `PynRepoList` (with `PynOrgList`, `PynMyLocks` and `PynOrgInvitations`, its `empty` prop sets the empty text, `empty=""` or the `empty` slot replaces it), `PynRepoDelete`, `PynMembers`, `PynAddPerson`, `PynRoles`, `PynInvites`, `PynAudit`, `PynLocks`, `PynMyLocks`), and the organization and team views (`PynOrgList`, `PynOrgMembers`, `PynOrgDelete`, `PynOrgRepoPolicy`, `PynTeamList`, `PynTeamForm`, `PynTeamDetail`, `PynTeamDelete`, `PynTeamGrant`), and the view layout pieces (`PynViewHeader`, `PynViewAction`, `PynViewSummary`, `PynViewError` and `PynViewNotice` (`dismissible` adds a close button and fades them after `autoDismissMs`, default 10000, 0 disables; hover and focus pause the timer; `persistent` keeps them until closed; `dismiss` event), `PynDismissButton`, `PynViewStack`, `PynViewGroup`), and the account views (`PynSignIn` (`rememberOption` and `staySignedInOption` add the "Remember me" and "Stay signed in" checkboxes, bound with `v-model:remember` and `v-model:stay-signed-in` and sent in the `signIn` payload; `nameCanonical` previews the registered name; its error fades after `errorAutoDismissMs`, `errorPersistent` keeps it, `dismissError` event), `PynSetup`, `PynVerifyEmail`, `PynAccountSettings`, `PynUsernameChange` (emits `nameInput`; `nameCanonical` shows a "Will be renamed to" preview), `PynKeys`, `PynTokens`, `PynWebhooks`, `PynWebhookDetail`, `PynWebhookForm` (both take `eventTypeOptions`, `eventTypesLoading` and `eventTypesError` to choose event types from a multi-select, and fall back to a textarea without options), `PynWebhookDeliveries`, `PynSecretReveal`, `PynIdentities`, `PynAccounts` (accounts marked `pending_verification` get a resend-confirmation button, the `resendConfirmation` event and a `resendingUser` marker), `PynServerInvitations`, `PynAddAccount`, `PynEmailStatus`, `PynEventTypesField`), the administrator access session views (`PynAccessSessionBanner`, `PynAccessSessionHistory`, `PynAccessSessionStartForm`, `PynAccessSessionList`), and the people directory (`PynPeopleList`, `PynPeopleSearch`). Markdown and code rendering use `marked`, `dompurify` and `highlight.js`, installed with the package.

### Global top bar and dashboard

`PynTopBar` is the one global layer, on every page including repository pages: a skip link (to `#pyn-main`, the id `PynShell` gives its `<main>`; `mainId` changes both), the brand, an owner switcher (`owners`, `currentOwner`, ending in "Create an organization"), a search or jump box (`PynGlobalSearch`: `/` focuses it outside inputs, `input` is emitted as typed, `search` on Enter; with the old `repos` prop Enter on a matching repository emits `open` instead), a Create menu, a locks pill (`locksHeld`, `locksExpiring`; hidden at zero, `99+` past 99, the full count in visually hidden text), a notifications bell (`notifications`; the count hides at zero, the bell stays) and the account menu (profile, settings, administration with `admin`, `extraAccount`, theme, sign out). Destinations default to `/`, `/<user>`, `/_/settings`, `/_/admin`, `/_/people`, `/_/orgs`, `/_/explore`, `/_/locks`, `/_/invitations`, `/_/new` and `/_/new-org`, and `hrefs` overrides any of them. Explore, People and Organizations (`hrefs.people`, `hrefs.orgs`) show in the account menu and in the narrow main menu; "Keyboard shortcuts" ends the account menu and the narrow main menu and emits `shortcuts`; `extraLinks` (`{ id, label, href }[]`) adds more links to the narrow main menu; an `extraAccount` or `extraLinks` entry whose `href` equals a named destination is shown once. Signed out (`signedOut`): brand, search (`showSearch` false removes it), an Explore link (`hrefs.explore`, default `/_/explore`, also in the narrow main menu; the signed-in bar shows it too), theme and sign in. At 40rem and below a main-menu button opens the global links as a list, and the search becomes an icon button that expands the field. Menus (`PynMenu`) follow the menu button pattern: Enter, Space or ArrowDown opens, arrows, Home and End move, Escape closes and returns focus. Breaking changes from the old bar: the Create menu, account menu and search are laid out differently, the account menu gains "Your profile", signed-out pages now show search, and `PynShell`'s `bare` prop does nothing, since the side navigation renders only when the `side` slot is given.

The dashboard is `PynDashboard` (slots `header`, `main`, `side`; the side column stacks below on narrow screens) holding `PynDashboardCard` (`heading`, `seeAllHref`, `loading`, `error`, `retryable`; slots `default` and `actions`), the ready-made `PynDashboardRepositories` and `PynDashboardOrganizations` cards, `PynAttention` (locks held, invitations with an Accept link, notices) and `PynRecentItems` (kept in this browser) for the cards that take them, and `PynDashboardFirstRun` for an account with nothing yet.

One tab bar and one settings layout: `PynTabs` (items `{ label, href, count?, countLabel?, current? }`; the count badge has visually hidden text, the current tab gets `aria-current="page"`, and `max` moves the tabs beyond that many into a More menu that keeps the current tab shown) is used by `PynRepoShell`, `PynOrgHeader` and `PynUserHeader`; `PynSettingsLayout` (`sections` of `{ id, label, href, group? }` with group headings, `current`, `label`, `title`, `variant="admin"` for the banded header, an `actions` slot, and a top selector on narrow screens) is used by `PynRepoSettings`, `PynAccountSettings`, `PynAdminLayout` (title "Server administration" by default) and the new `PynOrgSettingsLayout`. `PynRepoShell` takes `lockedCount` and `lockHolders` for a lock strip linking to the Locks tab (which gets `lockedCount` as its badge unless its tab has a `count`) and `maxTabs`; `PynRepoLanding` takes `branches` and `branchesHref` for the `PynRepoBranches` rail panel; `PynOrgHeader` takes `displayName`, `description`, `avatarUrl`, `url`, `maxTabs` and an `actions` slot; `PynSignIn` and `PynAccountNotice` take `noEmailNote` (the default text shows when `emailVerification` is `false`). Removed: the internal `PynAccountSettings.module.scss` and the `.nav`, `.tab` classes of the org, user and repository shell headers (replaced by `PynTabs`); no exported component was renamed or removed.

### Loading, policy, branches and sign-in prompt

`PynLoading` (`label` default "Loading", `variant` `inline`, `block` or `compact`) is a polite `role="status"` with a visually hidden label, skeleton lines for `block`, and no motion under `prefers-reduced-motion`. `PynPolicyView` is the read-only path policy: `mode` (the default mode), `rules` (`{ pattern, mode, comment? }[]`), `file` (default `.pyn/pyn.toml`), `path` with `matched` (a zero-based rule index or a rule's pattern) to highlight the rule and say "Matches rule N", `editHref` (the edit link shows only when given), `loading`, `error`, `headingLevel`; with no rules it reads "No rules: every path is <mode>". `PynBranchList` takes `branches` (`{ name, isDefault?, ahead?, behind?, updatedAt?, href?, compareHref? }[]`), `defaultBranch`, `loading`, `error` and `now`, and shows the default marker as text, "N ahead, M behind" when given, the updated time and a compare link; an empty list uses `PynEmptyState`. `PynSignInPrompt` (`message`, `signInHref`, `registerHref?`, `headingLevel`; event `signIn(MouseEvent)`) is a non-modal region for signed-out visitors. Small screens (40rem and below): buttons, inputs, tabs, settings links, tree links and compare links are at least 44px tall; tables in `PynOrgPendingInvitations`, `PynPolicyPreview` and `PynUsageBreakdown` scroll in their own box; the repository rail sits below the content with a top rule; long names in the owner switcher, branch picker and side navigation truncate and carry a `title`.

### Command palette and shortcuts

`PynCommandPalette` is a GitHub-style command palette: a modal dialog (`aria-modal`, focus trapped on the search field, focus returned on close, page scroll locked with `lockBodyScroll`, the same approach as `PynDrawer`) with a labelled combobox and a listbox using `aria-activedescendant`. Props: `open`, `items` (`{ id, label, group, href?, hint?, keywords? }`), `label` (the dialog name), `loading`, `placeholder`, `emptyLabel`, `unfiltered`, `initialText` (the field's text each time the palette opens; a non-empty one also emits `input`, so an app that loads items itself can search for it). Events: `close`, `select` (the item; the app decides whether to close) and `input` (the typed text, so an app can load more items). Arrow keys move (wrapping), Home and End jump, Enter chooses, Escape closes; an item with an `href` renders as a real anchor, so Enter and click navigate. Typing filters locally with `filterCommands(items, text)` (label outranks keywords; prefix, word start, substring, then subsequence; ties keep the input order). A live region announces the result count.

`PynShortcutsHelp` (`open`, `groups` of `{ title, shortcuts: { keys: string[], label }[] }`, `label`; event `close`) lists shortcuts with `kbd` elements. `createShortcutMatcher(bindings, { timeoutMs })` matches `{ id, keys }` bindings such as `['g', 'h']`, `['/']` or `['?']` from keydown events: `handle(event)` returns the matched id or null, and it ignores typing in inputs, textareas, selects and contenteditable and any event with Ctrl, Meta or Alt held.

## License

Apache-2.0. See `LICENSE`.

## Support the project

<a href="https://www.buymeacoffee.com/lunarvagabond" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me a Coffee" style="height: 60px !important;width: 217px !important;" ></a>
