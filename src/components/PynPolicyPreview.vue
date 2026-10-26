<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynPolicyPreview.module.scss'
import PynModeChip from './PynModeChip.vue'
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
          <table :class="styles.table" aria-label="Paths that change mode">
            <thead>
              <tr>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Path</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rows" :key="r.path">
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
