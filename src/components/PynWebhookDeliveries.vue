<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
import styles from '../styles/PynWebhookDeliveries.module.scss'
import { formatDateTime } from '../utils/datetime'
import {
  DELIVERY_STATUSES,
  ERROR_PREVIEW_LENGTH,
  errorPreview,
  finishedAt,
} from '../state/webhook.state'
import type { WebhookDelivery } from '../types/webhook.types'

defineProps<{
  deliveries: WebhookDelivery[]
  /** Active status filter, empty for all. */
  status?: string
  hasMore?: boolean
  loading?: boolean
  error?: string
  canRedeliver?: boolean
  redeliveringId?: string
}>()
const emit = defineEmits<{ filter: [string]; 'load-more': []; redeliver: [string] }>()

const idPrefix = useId()
const confirming = ref<string>()
const cancelButton = ref<HTMLButtonElement>()
const triggers = new Map<string, HTMLButtonElement>()

function setTrigger(id: string, el: unknown) {
  if (el) triggers.set(id, el as HTMLButtonElement)
  else triggers.delete(id)
}

async function ask(id: string) {
  confirming.value = id
  await nextTick()
  cancelButton.value?.focus()
}

async function close() {
  const id = confirming.value
  confirming.value = undefined
  await nextTick()
  if (id) triggers.get(id)?.focus()
}

async function confirm() {
  const id = confirming.value
  if (!id) return
  emit('redeliver', id)
  await close()
}

function onFilter(e: Event) {
  emit('filter', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <section :class="styles.page" :aria-busy="loading ? 'true' : undefined">
    <div :class="styles.filters">
      <label :for="`${idPrefix}-status`" :class="styles.label">Status</label>
      <select
        :id="`${idPrefix}-status`"
        :class="styles.input"
        :value="status ?? ''"
        @change="onFilter"
      >
        <option value="">All</option>
        <option v-for="s in DELIVERY_STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <p v-if="loading && !deliveries.length" :class="styles.empty" role="status">
      Loading deliveries…
    </p>

    <div
      v-if="confirming"
      :class="styles.confirm"
      role="alertdialog"
      :aria-labelledby="`${idPrefix}-title`"
      :aria-describedby="`${idPrefix}-desc`"
      @keydown.esc.stop="close"
    >
      <strong :id="`${idPrefix}-title`">Redeliver this event?</strong>
      <p :id="`${idPrefix}-desc`" :class="styles.meta">
        The event is sent to the endpoint again, even if an earlier attempt succeeded.
      </p>
      <div :class="styles.actions">
        <button type="button" :class="styles.primary" @click="confirm">Redeliver</button>
        <button ref="cancelButton" type="button" :class="styles.button" @click="close">
          Cancel
        </button>
      </div>
    </div>

    <div v-if="deliveries.length" :class="styles.scroll">
      <table :class="styles.table">
        <caption :class="styles.caption">
          Webhook deliveries
        </caption>
        <thead>
          <tr>
            <th scope="col">Status</th>
            <th scope="col">Attempts</th>
            <th scope="col">Next attempt</th>
            <th scope="col">Last code</th>
            <th scope="col">Last error</th>
            <th scope="col">Created</th>
            <th scope="col">Finished</th>
            <th v-if="canRedeliver" scope="col"><span :class="styles.caption">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in deliveries" :key="d.id" :data-status="d.status">
            <td>
              <span :class="styles.status" :data-status="d.status">{{ d.status }}</span>
            </td>
            <td>{{ d.attempts }}</td>
            <td>{{ d.status === 'pending' ? formatDateTime(d.next_attempt_at) : '' }}</td>
            <td>{{ d.last_status_code ?? '' }}</td>
            <td :class="styles.errorCell">
              <template v-if="d.last_error">
                <details
                  v-if="d.last_error.length > ERROR_PREVIEW_LENGTH || d.last_error.includes('\n')"
                >
                  <summary :title="d.last_error">{{ errorPreview(d.last_error) }}</summary>
                  <pre :class="styles.full">{{ d.last_error }}</pre>
                </details>
                <span v-else :title="d.last_error">{{ d.last_error }}</span>
              </template>
            </td>
            <td>{{ formatDateTime(d.created_at) }}</td>
            <td>
              <template v-if="finishedAt(d)"
                >{{ finishedAt(d)!.label }} {{ formatDateTime(finishedAt(d)!.at) }}</template
              >
            </td>
            <td v-if="canRedeliver">
              <button
                :ref="(el) => setTrigger(d.id, el)"
                type="button"
                :class="styles.button"
                :disabled="!!redeliveringId"
                :aria-label="`Redeliver event ${d.event_id}`"
                @click="ask(d.id)"
              >
                {{ redeliveringId === d.id ? 'Redelivering…' : 'Redeliver' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="!loading" :class="styles.empty">No matching deliveries.</p>

    <button
      v-if="hasMore"
      type="button"
      :class="styles.button"
      :disabled="loading"
      @click="emit('load-more')"
    >
      Load more
    </button>
  </section>
</template>
