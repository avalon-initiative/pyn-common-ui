<script setup lang="ts">
import { computed } from 'vue'
import PynActivity from './PynActivity.vue'
import PynBranchBar from './PynBranchBar.vue'
import PynBreadcrumb from './PynBreadcrumb.vue'
import PynCloneMenu from './PynCloneMenu.vue'
import PynRepoBranches from './PynRepoBranches.vue'
import PynPageColumns from './PynPageColumns.vue'
import PynLockedFiles from './PynLockedFiles.vue'
import PynQuickSetup from './PynQuickSetup.vue'
import PynReadme from './PynReadme.vue'
import PynRepoAbout from './PynRepoAbout.vue'
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
  /** Branches for the toolbar picker, with ahead and behind against the default branch. */
  branches?: BranchSummary[]
  /** Branches for the side rail; defaults to `branches`, of which the rail shows the first 5. */
  railBranches?: BranchSummary[]
  /** Where the rail's Branches panel links to; with `branches` it shows the panel. */
  branchesHref?: string
  /** Toolbar count for the Branches link; defaults to the length of `branches`. */
  branchCount?: number
  branchesLoading?: boolean
  branchesError?: string
  /** The clone command shown in the Clone menu and the empty-repository setup box. */
  cloneCommand?: string
  /** HTTPS clone address; with it the toolbar shows the Clone menu. */
  httpsUrl?: string
  sshUrl?: string
  /** About block data; the block renders nothing without any of it. */
  about?: { description?: string | null; website?: string | null; topics?: string[] }
}>()

const emit = defineEmits<{ select: [name: string] }>()

const crumbs = computed(() => breadcrumbs(props.repo, props.path, props.branch))
const toolbarBranches = computed(() =>
  props.branches?.length || props.branchesLoading || props.branchesError
    ? (props.branches ?? [])
    : undefined,
)
const sideBranches = computed(() => props.railBranches ?? props.branches)
const emptyRepo = computed(
  () => !props.missing && !props.path && !!props.listing && props.listing.entries.length === 0,
)
</script>

<template>
  <PynPageColumns side-label="Repository summary">
    <div :class="styles.main">
      <PynBranchBar
        v-if="summary"
        :branch="branch ?? summary.default_branch"
        :branches="toolbarBranches"
        :branches-loading="branchesLoading"
        :branches-error="branchesError"
        :branches-href="branchesHref"
        :branch-count="branchCount ?? branches?.length"
        :now="now"
        @select="emit('select', $event)"
      >
        <PynBreadcrumb v-if="path" :crumbs="crumbs" />
        <template v-if="httpsUrl" #actions>
          <PynCloneMenu
            :https-url="httpsUrl"
            :ssh-url="sshUrl"
            :command="cloneCommand ?? `pyn clone ${repo.owner}/${repo.name}`"
          />
        </template>
      </PynBranchBar>
      <div v-if="missing" :class="styles.missing" role="alert">
        <p>
          There is no folder <code>/{{ path }}</code> in this repository.
        </p>
        <a :href="treePath(repo, '', branch)">Back to the top</a>
      </div>
      <PynQuickSetup v-else-if="emptyRepo" :name="repo.name" :command="cloneCommand" />
      <PynTree
        v-else-if="listing"
        :entries="listing.entries"
        :owner="repo.owner"
        :name="repo.name"
        :me="me"
        :now="now"
        :branch="branch"
        :path="path"
      />
      <PynReadme
        v-if="readme && !missing"
        :readme="readme"
        :owner="repo.owner"
        :name="repo.name"
        :branch="branch"
      />
    </div>
    <template v-if="summary" #side>
      <PynRepoAbout
        :description="about?.description"
        :website="about?.website"
        :topics="about?.topics"
      />
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
        v-if="sideBranches?.length || branchesHref"
        :branches="sideBranches"
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
