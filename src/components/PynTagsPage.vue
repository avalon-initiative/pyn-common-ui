<script setup lang="ts">
import { computed, ref } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynFilterList from './PynFilterList.vue'
import PynIcon from './PynIcon.vue'
import PynTagDialog from './PynTagDialog.vue'
import styles from '../styles/PynTagsPage.module.scss'
import { filterTags, shortCommit } from '../state/tags.state'
import { copyText } from '../utils/copy'
import { formatAgo } from '../utils/ago'
import { formatDateTime } from '../utils/datetime'
import type { BranchOption } from '../types/branch.types'
import type { NewTag, TagItem } from '../types/tag.types'

const props = withDefaults(
  defineProps<{
    tags: TagItem[]
    /** Targets offered by the New tag dialog. */
    branches?: BranchOption[]
    /** Shows the New tag button. */
    canCreate?: boolean
    /** Shows a delete button on each row. */
    canDelete?: boolean
    title?: string
    pageSize?: number
    loading?: boolean
    error?: string
    /** Disables the open dialog's buttons while its request runs. */
    busy?: boolean
    /** Error of the open dialog's request. */
    dialogError?: string
    now?: Date
  }>(),
  { branches: () => [], title: 'Tags', pageSize: 30 },
)
const emit = defineEmits<{
  create: [payload: NewTag]
  delete: [name: string]
  copy: [commit: string]
}>()
const query = defineModel<string>('query', { default: '' })
const page = defineModel<number>('page', { default: 1 })
/** Open state of the New tag dialog; the app clears it once the tag exists. */
const creating = defineModel<boolean>('creating', { default: false })
/** Name of the tag whose delete confirmation is open; the app clears it once deleted. */
const deleting = defineModel<string>('deleting', { default: '' })

const shown = computed(() => filterTags(props.tags, query.value))
const rows = computed(() =>
  shown.value.slice((page.value - 1) * props.pageSize, page.value * props.pageSize),
)
const copied = ref('')
const ago = (iso: string) => formatAgo(iso, props.now ?? new Date())

async function copy(commit: string) {
  if (await copyText(commit)) {
    copied.value = commit
    emit('copy', commit)
  }
}

function search(q: string) {
  query.value = q
  page.value = 1
}
</script>

<template>
  <div :class="styles.page">
    <h2 :class="styles.title">{{ title }}</h2>
    <PynFilterList
      :query="query"
      noun="tag"
      search-label="Search tags"
      placeholder="Find a tag…"
      label="Tags"
      :count="shown.length"
      :page="page"
      :page-size="pageSize"
      :loading="loading"
      :error="error"
      empty-title="No tags yet"
      :empty-description="
        canCreate
          ? 'A tag names a commit, such as a release. Create one with New tag.'
          : 'A tag names a commit, such as a release.'
      "
      @update:query="search"
      @update:page="page = $event"
    >
      <template v-if="canCreate" #actions>
        <button type="button" :class="styles.create" data-new-tag @click="creating = true">
          New tag
        </button>
      </template>
      <template #lead><PynIcon name="tag" /></template>
      <li v-for="t in rows" :key="t.name" :class="styles.row" data-tag>
        <div :class="styles.main">
          <a v-if="t.href" :href="t.href" :class="styles.name">{{ t.name }}</a>
          <span v-else :class="styles.name">{{ t.name }}</span>
          <p v-if="t.message" :class="styles.message" data-message>{{ t.message }}</p>
          <p :class="styles.meta">
            <span :class="styles.item" :title="formatDateTime(t.createdAt)">
              <PynIcon name="calendar" />{{ ago(t.createdAt) }}
            </span>
            <span :class="styles.item">
              <PynIcon name="commit" />
              <a
                v-if="t.commitHref"
                :href="t.commitHref"
                :class="styles.commit"
                :title="t.commit"
                >{{ shortCommit(t.commit) }}</a
              >
              <code v-else :class="styles.commit" :title="t.commit">{{
                shortCommit(t.commit)
              }}</code>
              <button
                type="button"
                :class="styles.icon"
                :aria-label="`Copy commit id of ${t.name}`"
                :title="copied === t.commit ? 'Copied' : 'Copy commit id'"
                @click="copy(t.commit)"
              >
                <PynIcon :name="copied === t.commit ? 'check' : 'copy'" />
              </button>
            </span>
            <span :class="styles.item" data-created-by>
              <PynAvatar
                :username="t.createdBy"
                :name="t.creator?.name"
                :src="t.creator?.avatarUrl"
                size="sm"
              />{{ t.createdBy }}
            </span>
          </p>
        </div>
        <button
          v-if="canDelete"
          type="button"
          :class="[styles.icon, styles.delete]"
          :aria-label="`Delete tag ${t.name}`"
          title="Delete tag"
          @click="deleting = t.name"
        >
          <PynIcon name="trash" />
        </button>
      </li>
    </PynFilterList>
    <PynTagDialog
      v-if="canCreate"
      :open="creating"
      mode="create"
      :branches="branches"
      :tags="tags"
      :busy="busy"
      :error="dialogError"
      @close="creating = false"
      @create="emit('create', $event)"
    />
    <PynTagDialog
      v-if="canDelete"
      :open="!!deleting"
      mode="delete"
      :branches="branches"
      :name="deleting"
      :busy="busy"
      :error="dialogError"
      @close="deleting = ''"
      @delete="emit('delete', $event)"
    />
  </div>
</template>
