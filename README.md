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
import '@avalon-initiative/pyn-common-ui/tokens.css'   // design tokens (CSS custom properties)
import '@avalon-initiative/pyn-common-ui/global.css'   // base page styles
import '@avalon-initiative/pyn-common-ui/style.css'    // component styles

import { PynButton } from '@avalon-initiative/pyn-common-ui'
```

Colors, spacing and radii come from the `--pyn-*` tokens in `tokens.css`
(dark by default, light by OS preference or `data-theme`); components never
hardcode a color.

Theme handling is exported for the app to wire to its own control:
`themeChoices`, `loadTheme()`, `saveTheme(choice)` and `applyTheme(choice)`
(`system` removes the `data-theme` pin so the OS preference decides). Pure
helpers are exported too: `formatDate`, `formatDateTime`, `formatWait`,
`formatLease`, `lockState` and `EXPIRING_SOON_MS`.

## Develop

```bash
make install         # npm ci
make storybook       # Storybook on http://localhost:6006
make watch           # rebuild dist/ on change, for a linked app
make check           # lint, type-check, component tests, build, smoke test
make build-storybook # static Storybook build
make help            # everything else
```

Conventions:

- `src/components/` holds only `.vue` files; `src/styles/` holds only
  `.module.scss` (CSS Modules, one per component, bound with `:class`), the
  plain `tokens.css` and `global.css`, and `_mixins.scss` (library-internal,
  pulled in with `@use 'mixins' as m;` and never shipped on its own); `src/stories/` holds `.stories.ts`;
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

Versions are semver. From an up-to-date `main`:

```bash
make release VER=0.1.0 TITLE="Optional title"
git push origin main --tags
```

`make release` runs the pre-release checks first and changes nothing if they
fail, then bumps `package.json` and the lockfile, commits, and creates the
annotated tag `v<VER>` (or `v<VER>-<title-slug>`). Pushing the tag starts the
release workflow: it verifies the tag matches `package.json`, requires the
tagged commit to be on `main`, reruns the checks, publishes the package, and
creates a GitHub Release with the packed tarball. The registry and scope are
set in the `env` block at the top of `.github/workflows/release.yml`.
Published versions are immutable; ship a fix as a new version.

## Components

`PynButton` is the seed component; the rest arrive from the pyn web UI.

## License

Apache-2.0. See `LICENSE`.
