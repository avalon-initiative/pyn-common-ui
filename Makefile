SHELL := /bin/bash

.DEFAULT_GOAL := help

.PHONY: help install build typecheck lint format format-check test smoke storybook build-storybook check pack watch clean \
	release-checks release release-skip-tests release-publish

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  make %-18s %s\n", $$1, $$2}'

install: ## Install dependencies
	npm ci

build: ## Build the library (dist/: ES bundle, types, style.css, tokens.css, global.css)
	npm run build

format: ## Format with Prettier
	npm run format

format-check: ## Check formatting with Prettier
	npm run format:check

typecheck: ## Type-check sources, tests and config
	npm run typecheck

lint: ## Lint
	npm run lint

test: ## Component tests
	npm test

smoke: build ## Build, then import the built package and render a component
	node scripts/smoke-dist.mjs

storybook: ## Storybook dev server on :6006
	npm run storybook

build-storybook: ## Static Storybook build
	npm run build-storybook

check: lint format-check typecheck test smoke ## Everything a pull request must pass except the Storybook build

pack: build ## Produce the publishable tarball without publishing
	npm pack

watch: build ## Rebuild dist/ on change, for an app linked to this checkout
	npx vite build --watch

clean: ## Remove build output
	rm -rf dist storybook-static *.tgz

release-checks: ## Run the pre-release gate (lint, format check, type-check, tests, build, smoke, Storybook)
	bash scripts/release-checks.sh

.PHONY: release
## Run the pre-release checks, then open a pull request that bumps the version.
##
## Usage:
##   make release VER=0.1.5 TITLE="Some release title"
## - VER and TITLE prompt if missing (TITLE is optional). Tag: v<VER> or v<VER>-<title-slug>.
## - Runs scripts/release-checks.sh first (SKIP_CHECKS=1 skips); nothing changes if it fails.
## - Branches release-v<VER>, bumps package.json and package-lock.json, commits, and
##   (after confirming, or YES=1) pushes the branch and opens the pull request.
## - After the merge, 'make release-publish' tags the merged commit; the tag publishes.
release:
	@bash scripts/release.sh start

.PHONY: release-skip-tests
## Same as 'release', but skips the pre-release checks.
release-skip-tests: SKIP_CHECKS=1
release-skip-tests:
	@SKIP_CHECKS=1 bash scripts/release.sh start

.PHONY: release-publish
## Tag the merged release commit on main and push the tag, which starts the publish workflow.
release-publish:
	@bash scripts/release.sh publish
