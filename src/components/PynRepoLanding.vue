<script setup lang="ts">
import { computed } from 'vue'
import PynActivity from './PynActivity.vue'
import PynBranchBar from './PynBranchBar.vue'
import PynBreadcrumb from './PynBreadcrumb.vue'
import PynCheckoutCard from './PynCheckoutCard.vue'
import PynRepoBranches from './PynRepoBranches.vue'
import PynPageColumns from './PynPageColumns.vue'
import PynLockedFiles from './PynLockedFiles.vue'
import PynReadme from './PynReadme.vue'
import PynRepoDetails from './PynRepoDetails.vue'
import PynTree from './PynTree.vue'
import styles from '../styles/PynRepoLanding.module.scss'
import { breadcrumbs, treePath } from '../state/tree.state'
import type { BranchSummary } from '../types/branch.types'
import type { ReadmeDoc } from '../types/blob.types'
import type { RepoInfo } from '../types/repo.types'
import type { RepoSummary, TreeListing } from '../types/tree.types'

const props = defineProps<{
  repo: RepoInfo
  path: string
  listing?: TreeListing | null
  summary?: RepoSummary | null
  /** The folder does not exist (`path_not_found`). */
  missing?: boolean
  /** The folder's README, when it has one. */
  readme?: ReadmeDoc | null
  me?: string
  now?: Date
  /** Branch the links keep; omitted is the default branch. */
  branch?: string
  /** Recent branches for the rail, with ahead and behind against the default branch. */
  branches?: BranchSummary[]
  /** Where the rail's Branches panel links to; with `branches` it shows the panel. */
  branchesHref?: string
}>()

const crumbs = computed(() => breadcrumbs(props.repo, props.path, props.branch))
</script>

<template>
  <PynPageColumns side-label="Repository summary">
    <div :class="styles.main">
      <PynBranchBar
        v-if="summary"
        :branch="summary.default_branch"
        :files="summary.files"
        :updated-at="summary.updated_at"
        :now="now"
      />
      <PynBreadcrumb :crumbs="crumbs" />
      <div v-if="missing" :class="styles.missing" role="alert">
        <p>
          There is no folder <code>/{{ path }}</code> in this repository.
        </p>
        <a :href="treePath(repo, '', branch)">Back to the top</a>
      </div>
      <PynTree
        v-else-if="listing"
        :entries="listing.entries"
        :owner="repo.owner"
        :name="repo.name"
        :me="me"
        :now="now"
        :branch="branch"
      />
      <PynReadme
        v-if="readme && !missing"
        :readme="readme"
        :owner="repo.owner"
        :name="repo.name"
        :branch="branch"
      />
      <PynCheckoutCard />
    </div>
    <template v-if="summary" #side>
      <PynRepoDetails
        :owner="repo.owner"
        :visibility="repo.visibility"
        :lease-hours="repo.lease_hours"
        :created-at="repo.created_at"
        :updated-at="summary.updated_at"
        :files="summary.files"
        :exclusive-files="summary.exclusive_files"
        :shared-files="summary.shared_files"
        :now="now"
      />
      <PynRepoBranches
        v-if="branches?.length || branchesHref"
        :branches="branches"
        :default-branch="summary.default_branch"
        :href="branchesHref"
        :now="now"
      />
      <PynLockedFiles
        :locks="summary.locks"
        :owner="repo.owner"
        :name="repo.name"
        :me="me"
        :now="now"
      />
      <PynActivity :entries="summary.activity" :now="now" />
    </template>
  </PynPageColumns>
</template>
