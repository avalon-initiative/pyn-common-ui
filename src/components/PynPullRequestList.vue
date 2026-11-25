<script setup lang="ts">
import PynFilterList from './PynFilterList.vue'
import PynIcon from './PynIcon.vue'
import PynPerson from './PynPerson.vue'
import PynSubNav from './PynSubNav.vue'
import styles from '../styles/PynPullRequestList.module.scss'
import { PULL_STATE_LABEL, REVIEW_LABEL, isDraft, pullWhen } from '../state/pull-request.state'
import { formatAgo } from '../utils/ago'
import { pluralize } from '../utils/plural'
import type { FilterListControl } from '../types/filter-list.types'
import type { PullRequestSummary } from '../types/pull-request.types'
import type { NavGroup } from '../types/shell.types'

withDefaults(
  defineProps<{
    /** The rows of the current page. */
    pulls: PullRequestSummary[]
    /** Rows across every page for the shown status and search. */
    count: number
    counts: { open: number; closed: number }
    status?: 'open' | 'closed'
    controls?: FilterListControl[]
    page?: number
    pageSize?: number
    loading?: boolean
    error?: string
    /** Treat an empty list as the result of a search or filter. */
    filtered?: boolean
    now?: Date
    /** Left sub-nav groups; omitted shows the list alone. */
    navGroups?: NavGroup[]
    navCurrent?: string
    /** Link of the New pull request button; omitted hides it. */
    newHref?: string
  }>(),
  { status: 'open', navCurrent: '' },
)
const query = defineModel<string>('query', { default: '' })
const emit = defineEmits<{
  'update:status': [status: 'open' | 'closed']
  control: [id: string, value: string]
  'update:page': [page: number]
}>()

const ICON = { open: 'pull-request', merged: 'merge', closed: 'pull-closed' } as const
const comments = (n: number) => pluralize(n, 'comment')
const lockedText = (n: number) => `${pluralize(n, 'path')} locked`
</script>

<template>
  <div :class="[styles.page, navGroups && styles.withNav]">
    <PynSubNav
      v-if="navGroups"
      :groups="navGroups"
      :current="navCurrent"
      label="Pull request views"
    />
    <PynFilterList
      v-model:query="query"
      bar="inside"
      noun="pull request"
      search-label="Search pull requests"
      placeholder="is:open author:name"
      label="Pull requests"
      :count="count"
      :controls="controls"
      :page="page"
      :page-size="pageSize"
      :loading="loading"
      :error="error"
      :filtered="filtered"
      empty-title="No pull requests"
      empty-description="Pull requests you open or review show up here."
      @control="(id, v) => emit('control', id, v)"
      @update:page="emit('update:page', $event)"
    >
      <template #tabs>
        <div :class="styles.tabs" role="group" aria-label="Status">
          <button
            v-for="s in ['open', 'closed'] as const"
            :key="s"
            type="button"
            :class="styles.tab"
            :aria-pressed="status === s"
            :data-status-tab="s"
            @click="emit('update:status', s)"
          >
            <PynIcon :name="s === 'open' ? 'pull-request' : 'check'" />{{ PULL_STATE_LABEL[s] }}
            <span :class="styles.pill">{{ counts[s] }}</span>
          </button>
        </div>
      </template>
      <template v-if="newHref" #actions>
        <a :href="newHref" :class="styles.new">New pull request</a>
      </template>
      <li
        v-for="p in pulls"
        :key="p.number"
        :class="styles.row"
        :data-state="p.state"
        :data-draft="isDraft(p) || undefined"
        data-pull
      >
        <PynIcon
          :name="isDraft(p) ? 'pull-draft' : ICON[p.state]"
          :class="[styles.icon, styles[isDraft(p) ? 'draft' : p.state]]"
        />
        <div :class="styles.main">
          <a v-if="p.href" :href="p.href" :class="styles.title">{{ p.title }}</a>
          <span v-else :class="styles.title">{{ p.title }}</span>
          <span v-if="isDraft(p)" :class="styles.draftLabel" data-draft-label>Draft</span>
          <span v-if="p.locked" :class="styles.locked" data-locked>
            <PynIcon name="lock" />{{ lockedText(p.locked) }}
          </span>
          <p :class="styles.meta">
            #{{ p.number }} {{ pullWhen(p).verb }}
            {{ formatAgo(pullWhen(p).at, now ?? new Date()) }} by
            <PynPerson :name="p.author.user" :identity="p.author" :avatar="false" />
            · <code>{{ p.head }}</code> into <code>{{ p.base }}</code>
          </p>
        </div>
        <span
          v-if="REVIEW_LABEL[p.review]"
          :class="[styles.review, styles[p.review]]"
          data-review
          >{{ REVIEW_LABEL[p.review] }}</span
        >
        <span v-if="p.comments" :class="styles.comments" :title="comments(p.comments)">
          <PynIcon name="comment" />{{ p.comments }}
          <span :class="styles.hidden">{{ comments(p.comments) }}</span>
        </span>
      </li>
    </PynFilterList>
  </div>
</template>
