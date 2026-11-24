<script setup lang="ts">
import { computed, ref } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynIcon from './PynIcon.vue'
import PynListSearch from './PynListSearch.vue'
import PynLoading from './PynLoading.vue'
import PynMenu from './PynMenu.vue'
import PynSettingsLayout from './PynSettingsLayout.vue'
import styles from '../styles/PynBranchesPage.module.scss'
import { availableViews, branchGroups } from '../state/branches-page.state'
import { copyText } from '../utils/copy'
import { formatAgo } from '../utils/ago'
import type { BranchListItem, BranchView } from '../types/branch.types'
import type { SettingsSection } from '../types/tabs.types'

const props = withDefaults(
  defineProps<{
    branches: BranchListItem[]
    defaultBranch?: string
    view?: BranchView
    /** Link of each view; a view without one links to `#`. */
    hrefs?: Partial<Record<BranchView, string>>
    /** Names for the Yours, Active and Stale views; a view shows only when its list is given. */
    yours?: string[]
    active?: string[]
    stale?: string[]
    canCreate?: boolean
    canDelete?: boolean
    loading?: boolean
    error?: string
    now?: Date
  }>(),
  { view: 'branches', canCreate: true },
)
const emit = defineEmits<{ newBranch: []; delete: [name: string]; copy: [name: string] }>()
const query = defineModel<string>('query', { default: '' })

const LABELS: Record<BranchView, [string, string]> = {
  branches: ['Branches', 'branch'],
  yours: ['Yours', 'user'],
  active: ['Active', 'history'],
  stale: ['Stale', 'history'],
  all: ['All', 'list'],
}
const filters = computed(() => ({ yours: props.yours, active: props.active, stale: props.stale }))
const sections = computed<SettingsSection[]>(() =>
  availableViews(filters.value).map((id) => ({
    id,
    label: LABELS[id][0],
    icon: LABELS[id][1],
    href: props.hrefs?.[id] ?? '#',
  })),
)
const groups = computed(() =>
  branchGroups(props.branches, props.view, query.value, filters.value, props.defaultBranch),
)
const searching = computed(() => query.value.trim() !== '')
const copied = ref('')

async function copy(name: string) {
  if (await copyText(name)) {
    copied.value = name
    emit('copy', name)
  }
}
const ago = (iso: string) => formatAgo(iso, props.now ?? new Date())
const menuItems = (b: BranchListItem) => [
  ...(b.compareHref ? [{ id: 'compare', label: 'Compare', href: b.compareHref }] : []),
  { id: 'copy', label: 'Copy name' },
]
</script>

<template>
  <PynSettingsLayout
    :sections="sections"
    :current="view"
    label="Branch views"
    title="Branches"
    :class="styles.page"
  >
    <template v-if="canCreate" #actions>
      <button type="button" :class="styles.create" @click="emit('newBranch')">New branch</button>
    </template>
    <PynListSearch v-model="query" label="Search branches" placeholder="Search branches…" />
    <PynLoading v-if="loading" label="Loading branches" variant="block" />
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <PynEmptyState
      v-else-if="!groups.length"
      :title="searching ? 'No matching branches' : 'No branches'"
      :description="
        searching ? 'No branch name contains the search text.' : 'Nothing to show in this view yet.'
      "
      :heading-level="3"
      compact
    />
    <section
      v-for="g in groups"
      v-else
      :key="g.id"
      :class="styles.group"
      :aria-labelledby="`branches-${g.id}`"
    >
      <h3 :id="`branches-${g.id}`" :class="styles.heading">{{ g.title }}</h3>
      <div :class="styles.box">
        <table :class="styles.table">
          <thead>
            <tr>
              <th scope="col">Branch</th>
              <th scope="col" :class="styles.updated">Updated</th>
              <th scope="col" :class="styles.num">Behind</th>
              <th scope="col" :class="styles.num">Ahead</th>
              <th scope="col" :class="styles.actions">
                <span :class="styles.hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in g.rows" :key="b.name" :data-default="b.isDefault || undefined">
              <td :class="styles.branch">
                <span :class="styles.chipRow">
                  <a v-if="b.href" :href="b.href" :class="styles.chip" :title="b.name">{{
                    b.name
                  }}</a>
                  <span v-else :class="styles.chip" :title="b.name">{{ b.name }}</span>
                  <button
                    type="button"
                    :class="styles.icon"
                    :aria-label="`Copy branch name ${b.name}`"
                    :title="copied === b.name ? 'Copied' : 'Copy branch name'"
                    @click="copy(b.name)"
                  >
                    <PynIcon :name="copied === b.name ? 'check' : 'copy'" />
                  </button>
                </span>
              </td>
              <td :class="styles.updated">
                <span v-if="b.updatedAt" :class="styles.who">
                  <PynAvatar
                    v-if="b.updatedBy"
                    :username="b.updatedBy.username"
                    :name="b.updatedBy.name"
                    :src="b.updatedBy.avatarUrl"
                    size="sm"
                  />{{ ago(b.updatedAt) }}
                </span>
                <span v-else :class="styles.none">-</span>
              </td>
              <template v-if="b.isDefault">
                <td colspan="2" :class="styles.num"><span :class="styles.badge">Default</span></td>
              </template>
              <template v-else>
                <td :class="styles.num" data-behind>{{ b.behind ?? '-' }}</td>
                <td :class="styles.num" data-ahead>{{ b.ahead ?? '-' }}</td>
              </template>
              <td :class="styles.actions">
                <span :class="styles.tools">
                  <button
                    v-if="canDelete && !b.isDefault"
                    type="button"
                    :class="styles.icon"
                    :aria-label="`Delete branch ${b.name}`"
                    title="Delete branch"
                    @click="emit('delete', b.name)"
                  >
                    <PynIcon name="trash" />
                  </button>
                  <PynMenu
                    :label="`More actions for ${b.name}`"
                    :items="menuItems(b)"
                    fixed
                    @select="(id) => id === 'copy' && copy(b.name)"
                    ><PynIcon name="more" /></PynMenu
                ></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </PynSettingsLayout>
</template>
