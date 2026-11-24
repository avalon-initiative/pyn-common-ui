<script setup lang="ts">
import { computed, ref } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
import PynListSearch from './PynListSearch.vue'
import PynLoading from './PynLoading.vue'
import PynLockIcon from './PynLockIcon.vue'
import PynModeChip from './PynModeChip.vue'
import PynPerson from './PynPerson.vue'
import PynSettingsLayout from './PynSettingsLayout.vue'
import styles from '../styles/PynLocksPage.module.scss'
import { filterLockRows, lockRowKey, lockRowState, lockViews } from '../state/locks-page.state'
import { formatAgo } from '../utils/ago'
import { formatDateTime } from '../utils/datetime'
import { formatLease } from '../utils/lease'
import type { LockListItem, LockView } from '../types/lock.types'
import type { SettingsSection } from '../types/tabs.types'

const props = withDefaults(
  defineProps<{
    locks: LockListItem[]
    /** The signed-in user: their locks read as "You" and the Mine view appears. */
    me?: string
    view?: LockView
    /** Link of each view; a view without one links to `#`. */
    hrefs?: Partial<Record<LockView, string>>
    /** Shows Force release on locks held by others. */
    canForce?: boolean
    /** Adds row checkboxes, a select-all header and Release selected / Release all for the viewer's own locks. */
    bulk?: boolean
    busy?: boolean
    loading?: boolean
    error?: string
    now?: Date
    title?: string
  }>(),
  { view: 'all', title: 'Locks' },
)
const emit = defineEmits<{
  release: [lock: LockListItem]
  releaseMany: [locks: LockListItem[]]
  forceRelease: [payload: { lock: LockListItem; reason: string }]
}>()
const query = defineModel<string>('query', { default: '' })

const LABELS: Record<LockView, [string, string]> = {
  all: ['All', 'list'],
  mine: ['Mine', 'user'],
  expiring: ['Expiring soon', 'history'],
  stale: ['Stale', 'alert'],
}
const at = computed(() => props.now ?? new Date())
const sections = computed<SettingsSection[]>(() =>
  lockViews(props.me).map((id) => ({
    id,
    label: LABELS[id][0],
    icon: LABELS[id][1],
    href: props.hrefs?.[id] ?? '#',
  })),
)
const rows = computed(() =>
  filterLockRows(props.locks, props.view, query.value, props.me, at.value),
)
const showRepo = computed(() => props.locks.some((l) => l.repo))
const columns = computed(() => 6 + (showRepo.value ? 1 : 0) + (props.bulk ? 1 : 0))
const searching = computed(() => query.value.trim() !== '')
const state = (l: LockListItem) => lockRowState(l, props.me, at.value)
const mine = (l: LockListItem) => l.owner === props.me
const STATE_LABELS = { mine: 'Yours', locked: 'Locked', expiring: 'Expiring', stale: 'Stale' }

const EMPTY: Record<LockView, [string, string]> = {
  all: ['No locks held', 'Locks appear here while someone has an exclusive file checked out.'],
  mine: ['You hold no locks', 'Check out an exclusive file to lock it.'],
  expiring: ['No locks about to expire', 'Locks with less than 30 minutes left show here.'],
  stale: ['No stale locks', 'Locks whose lease has run out show here.'],
}

const picked = ref<string[]>([])
const ownRows = computed(() => rows.value.filter(mine))
const chosen = computed(() => ownRows.value.filter((l) => picked.value.includes(lockRowKey(l))))
const allChosen = computed(
  () => !!ownRows.value.length && chosen.value.length === ownRows.value.length,
)

function toggle(l: LockListItem, on: boolean) {
  const key = lockRowKey(l)
  picked.value = on ? [...picked.value, key] : picked.value.filter((k) => k !== key)
}

function toggleAll(on: boolean) {
  picked.value = on ? ownRows.value.map(lockRowKey) : []
}

function releaseMany(locks: LockListItem[]) {
  emit('releaseMany', locks)
  picked.value = []
}

const forcing = ref('')
const reason = ref('')
function confirm(l: LockListItem) {
  emit('forceRelease', { lock: l, reason: reason.value.trim() })
  forcing.value = ''
  reason.value = ''
}
</script>

<template>
  <PynSettingsLayout
    :sections="sections"
    :current="view"
    label="Lock views"
    :title="title"
    :class="styles.page"
  >
    <PynListSearch v-model="query" label="Search locks" placeholder="Search locks…" />
    <PynLoading v-if="loading" label="Loading locks" variant="block" />
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <PynEmptyState
      v-else-if="!rows.length"
      :title="searching ? 'No matching locks' : EMPTY[view][0]"
      :description="searching ? 'No lock matches the search text.' : EMPTY[view][1]"
      icon="lock"
      :heading-level="3"
      compact
      :class="styles.empty"
    />
    <template v-else>
      <div
        v-if="bulk && ownRows.length"
        :class="styles.bulk"
        role="toolbar"
        aria-label="Bulk release"
      >
        <span :class="styles.count" aria-live="polite">{{ chosen.length }} selected</span>
        <button
          type="button"
          :class="styles.quiet"
          :disabled="busy || !chosen.length"
          @click="releaseMany(chosen)"
        >
          Release selected
        </button>
        <button type="button" :class="styles.danger" :disabled="busy" @click="releaseMany(ownRows)">
          Release all
        </button>
      </div>
      <div :class="styles.box">
        <table :class="styles.table">
          <thead>
            <tr>
              <th v-if="bulk" scope="col" :class="styles.selectCol">
                <input
                  type="checkbox"
                  :class="styles.check"
                  aria-label="Select all of your locks"
                  :checked="allChosen"
                  :indeterminate="!!chosen.length && !allChosen"
                  :disabled="!ownRows.length || busy"
                  @change="toggleAll(($event.target as HTMLInputElement).checked)"
                />
              </th>
              <th scope="col">Path</th>
              <th v-if="showRepo" scope="col" :class="styles.repoCol">Repository</th>
              <th scope="col" :class="styles.holder">Holder</th>
              <th scope="col" :class="styles.modeCol">Mode</th>
              <th scope="col" :class="styles.takenCol">Taken</th>
              <th scope="col">Expires</th>
              <th scope="col" :class="styles.actions">
                <span :class="styles.hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="l in rows" :key="lockRowKey(l)">
              <tr :class="styles.row" :data-state="state(l)">
                <td v-if="bulk" :class="styles.selectCol">
                  <input
                    v-if="mine(l)"
                    type="checkbox"
                    :class="styles.check"
                    :aria-label="`Select ${l.path}`"
                    :checked="picked.includes(lockRowKey(l))"
                    :disabled="busy"
                    @change="toggle(l, ($event.target as HTMLInputElement).checked)"
                  />
                </td>
                <td :class="styles.pathCell">
                  <span :class="styles.path"
                    ><PynLockIcon :class="styles.lockIcon" /><span
                      ><template v-for="(part, i) in l.path.split(/(?<=\/)/)" :key="i"
                        >{{ part }}<wbr /></template
                    ></span>
                  </span>
                  <span :class="styles.under"
                    ><template v-if="mine(l)">You</template
                    ><PynPerson v-else :name="l.owner" :identity="l.identity" :avatar="false"
                  /></span>
                  <span v-if="l.repo" :class="styles.underRepo"
                    ><a v-if="l.repoHref" :href="l.repoHref" :class="styles.repo">{{ l.repo }}</a
                    ><template v-else>{{ l.repo }}</template></span
                  >
                  <span v-if="l.error" :class="styles.failure" role="alert">{{ l.error }}</span>
                </td>
                <td v-if="showRepo" :class="styles.repoCol">
                  <a v-if="l.repoHref" :href="l.repoHref" :class="styles.repo">{{ l.repo }}</a>
                  <template v-else>{{ l.repo }}</template>
                </td>
                <td :class="styles.holder">
                  <template v-if="mine(l)">You</template>
                  <PynPerson v-else :name="l.owner" :identity="l.identity" />
                </td>
                <td :class="styles.modeCol"><PynModeChip :mode="l.mode ?? 'exclusive'" /></td>
                <td :class="styles.takenCol" :title="formatDateTime(l.acquired_at)">
                  {{ formatAgo(l.acquired_at, at) }}
                </td>
                <td :title="formatDateTime(l.expires_at)">
                  <span :class="[styles.state, styles[state(l)]]" data-lease
                    >{{ STATE_LABELS[state(l)] }}
                    <span :class="styles.lease">{{
                      state(l) === 'stale' ? 'expired' : formatLease(l.expires_at, at)
                    }}</span></span
                  >
                </td>
                <td :class="styles.actions">
                  <button
                    v-if="mine(l)"
                    type="button"
                    :class="styles.quiet"
                    :disabled="busy"
                    :aria-label="`Release ${l.path}`"
                    @click="emit('release', l)"
                  >
                    Release
                  </button>
                  <button
                    v-else-if="canForce && forcing !== lockRowKey(l)"
                    type="button"
                    :class="styles.danger"
                    :disabled="busy"
                    :aria-label="`Force release ${l.path}`"
                    @click="forcing = lockRowKey(l)"
                  >
                    Force release
                  </button>
                </td>
              </tr>
              <tr v-if="forcing === lockRowKey(l)" :class="styles.reasonRow">
                <td :colspan="columns">
                  <form :class="styles.reason" @submit.prevent="confirm(l)">
                    <input
                      v-model="reason"
                      :class="styles.input"
                      :aria-label="`Reason for releasing ${l.path}`"
                      placeholder="Reason"
                      required
                    />
                    <button type="submit" :class="styles.danger" :disabled="busy">
                      Force release
                    </button>
                    <button type="button" :class="styles.quiet" @click="forcing = ''">
                      Cancel
                    </button>
                  </form>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </PynSettingsLayout>
</template>
