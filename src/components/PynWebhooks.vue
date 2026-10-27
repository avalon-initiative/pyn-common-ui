<script setup lang="ts">
import styles from '../styles/PynWebhooks.module.scss'
import { formatDateTime } from '../utils/datetime'
import { eventTypesLabel } from '../state/webhook.state'
import type { WebhookSubscription } from '../types/webhook.types'

defineProps<{
  webhooks: WebhookSubscription[]
  selectedId?: string
  loading?: boolean
  error?: string
}>()
const emit = defineEmits<{ select: [string]; create: [] }>()
</script>

<template>
  <section :class="styles.page" :aria-busy="loading ? 'true' : undefined">
    <div :class="styles.head">
      <h2 :class="styles.heading">Webhooks</h2>
      <button type="button" :class="styles.primary" @click="emit('create')">Create webhook</button>
    </div>

    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <p v-if="loading && !webhooks.length" :class="styles.empty" role="status">Loading webhooks…</p>

    <div v-if="webhooks.length" :class="styles.scroll">
      <table :class="styles.table">
        <caption :class="styles.caption">
          Webhook subscriptions
        </caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">URL</th>
            <th scope="col">Enabled</th>
            <th scope="col">Events</th>
            <th scope="col">Secrets</th>
            <th scope="col">Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="w in webhooks"
            :key="w.id"
            :class="styles.row"
            :data-selected="w.id === selectedId ? 'true' : undefined"
            :aria-current="w.id === selectedId ? 'true' : undefined"
            @click="emit('select', w.id)"
          >
            <th scope="row" :class="styles.name">
              <button type="button" :class="styles.link" @click.stop="emit('select', w.id)">
                {{ w.name }}
              </button>
            </th>
            <td :class="styles.url">{{ w.url }}</td>
            <td>
              <span :class="styles.state" :data-enabled="w.enabled">{{
                w.enabled ? 'Enabled' : 'Disabled'
              }}</span>
            </td>
            <td>{{ eventTypesLabel(w.event_types) }}</td>
            <td>{{ w.secrets.length }}</td>
            <td>{{ formatDateTime(w.updated_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else-if="!loading && !error" :class="styles.empty">No webhooks yet.</p>
  </section>
</template>
