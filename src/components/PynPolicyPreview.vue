<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import styles from '../styles/PynPolicyPreview.module.scss'
import PynModeChip from './PynModeChip.vue'
import { dirOf, folderOptions, inFolder } from '../state/policy.state'
import { formatDateTime } from '../utils/datetime'
import type { Mode } from '../types/lock.types'
import type { PolicyPreview } from '../types/policy.types'

const props = defineProps<{
  preview?: PolicyPreview | null
  loading?: boolean
  error?: string
  /** Disables confirm while the policy is being saved. */
  busy?: boolean
}>()
const emit = defineEmits<{ selectPath: [string]; confirm: []; back: []; retry: [] }>()

const rows = computed<{ path: string; from: Mode; to: Mode }[]>(() => [
  ...(props.preview?.to_exclusive ?? []).map((path) => ({
    path,
    from: 'shared' as const,
    to: 'exclusive' as const,
  })),
  ...(props.preview?.to_shared ?? []).map((path) => ({
    path,
    from: 'exclusive' as const,
    to: 'shared' as const,
  })),
])

/** Filter controls appear once the list is longer than this. */
const FILTER_FROM = 10
const direction = ref<'all' | Mode>('all')
const folder = ref('all')
const idPrefix = useId()
const folders = computed(() => folderOptions(rows.value.map((r) => r.path)))
const filtering = computed(() => rows.value.length > FILTER_FROM)
const shown = computed(() =>
  rows.value.filter(
    (r) =>
      (direction.value === 'all' || r.to === direction.value) &&
      (folder.value === 'all' || inFolder(r.path, folder.value)),
  ),
)
const groups = computed(() => {
  const by = new Map<string, typeof rows.value>()
  for (const r of shown.value) by.set(dirOf(r.path), [...(by.get(dirOf(r.path)) ?? []), r])
  return [...by].sort(([a], [b]) => a.localeCompare(b))
})
const locks = computed(() => props.preview?.released_locks ?? [])
const stranded = computed(() => props.preview?.stranded ?? [])
const empty = computed(() => !rows.value.length)
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
</script>

<template>
  <section :class="styles.preview" aria-label="Policy conversion preview">
    <h3 :class="styles.title">Review conversions</h3>
    <div aria-live="polite" :class="styles.body">
      <p v-if="loading" :class="styles.muted" role="status">Checking which paths change…</p>
      <div v-else-if="error" :class="styles.error" role="alert">
        <p :class="styles.text">{{ error }}</p>
        <button type="button" :class="styles.button" @click="emit('retry')">Try again</button>
      </div>
      <template v-else-if="preview">
        <p v-if="empty" :class="styles.muted">No paths change mode.</p>
        <template v-else>
          <p :class="styles.counts">
            <span :data-direction="'to_exclusive'"
              >{{ plural(preview.to_exclusive.length, 'path') }} become exclusive</span
            >
            <span :data-direction="'to_shared'"
              >{{ plural(preview.to_shared.length, 'path') }} become shared</span
            >
          </p>
          <div v-if="filtering" :class="styles.filters" data-section="filters">
            <label :for="`${idPrefix}-dir`"
              >Direction
              <select :id="`${idPrefix}-dir`" v-model="direction">
                <option value="all">All</option>
                <option value="exclusive">To exclusive</option>
                <option value="shared">To shared</option>
              </select>
            </label>
            <label :for="`${idPrefix}-folder`"
              >Folder
              <select :id="`${idPrefix}-folder`" v-model="folder">
                <option value="all">All</option>
                <option v-for="f in folders" :key="f" :value="f">{{ f }}</option>
              </select>
            </label>
            <span :class="styles.muted" role="status"
              >Showing {{ shown.length }} of {{ rows.length }}</span
            >
          </div>
          <table :class="styles.table">
            <caption :class="styles.caption">
              Paths that change mode
            </caption>
            <thead>
              <tr>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Path</th>
              </tr>
            </thead>
            <tbody v-for="[dir, group] in groups" :key="dir">
              <tr :class="styles.folder" data-group>
                <th scope="rowgroup" colspan="3">
                  {{ dir }} <span :class="styles.muted">{{ plural(group.length, 'path') }}</span>
                </th>
              </tr>
              <tr v-for="r in group" :key="r.path">
                <td><PynModeChip :mode="r.from" /></td>
                <td><PynModeChip :mode="r.to" /></td>
                <td>
                  <button type="button" :class="styles.path" @click="emit('selectPath', r.path)">
                    {{ r.path }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <div v-if="locks.length" :class="styles.group" data-section="locks">
          <h4 :class="styles.subtitle">{{ plural(locks.length, 'lock') }} would be released</h4>
          <ul :class="styles.list">
            <li v-for="l in locks" :key="l.path">
              <button type="button" :class="styles.path" @click="emit('selectPath', l.path)">
                {{ l.path }}
              </button>
              <span :class="styles.muted">held by {{ l.owner }}</span>
              <span :class="styles.muted">expires {{ formatDateTime(l.expires_at) }}</span>
            </li>
          </ul>
        </div>
        <div v-if="stranded.length" :class="styles.group" data-section="stranded">
          <h4 :class="styles.subtitle">
            {{ plural(stranded.length, 'branch version') }} would be stranded
          </h4>
          <ul :class="styles.list">
            <li v-for="s in stranded" :key="`${s.path}@${s.branch}`">
              <button type="button" :class="styles.path" @click="emit('selectPath', s.path)">
                {{ s.path }}
              </button>
              <span :class="styles.muted">on {{ s.branch }} by {{ s.branch_owner }}</span>
            </li>
          </ul>
        </div>
      </template>
    </div>
    <div :class="styles.actions">
      <button
        type="button"
        :class="styles.primary"
        :disabled="busy || loading || !!error || !preview"
        @click="emit('confirm')"
      >
        {{ busy ? 'Saving…' : 'Save policy' }}
      </button>
      <button type="button" :class="styles.button" :disabled="busy" @click="emit('back')">
        Back to editing
      </button>
    </div>
  </section>
</template>
