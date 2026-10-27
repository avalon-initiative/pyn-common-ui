<script setup lang="ts">
import { nextTick, ref, useId, watch } from 'vue'
import styles from '../styles/PynWebhookDetail.module.scss'
import { formatDateTime } from '../utils/datetime'
import {
  eventTypesLabel,
  eventTypesText,
  isRotating,
  parseEventTypes,
} from '../state/webhook.state'
import PynWebhookDeliveries from './PynWebhookDeliveries.vue'
import type {
  WebhookConfirm,
  WebhookDelivery,
  WebhookSubscription,
  WebhookUpdate,
} from '../types/webhook.types'

const props = defineProps<{
  webhook: WebhookSubscription
  /** Freshly created or rotated secret, shown once. */
  secret?: string
  busy?: boolean
  error?: string
  deliveries: WebhookDelivery[]
  deliveriesStatus?: string
  deliveriesHasMore?: boolean
  deliveriesLoading?: boolean
  deliveriesError?: string
  canRedeliver?: boolean
  redeliveringId?: string
}>()
const emit = defineEmits<{
  update: [WebhookUpdate]
  delete: [number]
  'rotate-secret': [number]
  'retire-secret': [number]
  dismiss: []
  filter: [string]
  'load-more': []
  redeliver: [string]
}>()

const idPrefix = useId()
const editing = ref(false)
const name = ref('')
const url = ref('')
const events = ref('')
const confirming = ref<WebhookConfirm>()
const copied = ref(false)
const cancelButton = ref<HTMLButtonElement>()
const editButton = ref<HTMLButtonElement>()
const nameInput = ref<HTMLInputElement>()
let opener: HTMLElement | null = null

watch(
  () => props.webhook.id,
  () => {
    editing.value = false
    confirming.value = undefined
  },
)

async function edit() {
  name.value = props.webhook.name
  url.value = props.webhook.url
  events.value = eventTypesText(props.webhook.event_types)
  editing.value = true
  await nextTick()
  nameInput.value?.focus()
}

async function stopEditing() {
  editing.value = false
  await nextTick()
  editButton.value?.focus()
}

async function save() {
  emit('update', {
    name: name.value.trim(),
    url: url.value.trim(),
    event_types: parseEventTypes(events.value),
  })
  await stopEditing()
}

async function ask(c: WebhookConfirm, e: Event) {
  opener = e.currentTarget as HTMLElement
  confirming.value = c
  await nextTick()
  cancelButton.value?.focus()
}

async function dismissConfirm() {
  confirming.value = undefined
  await nextTick()
  opener?.focus()
}

async function confirm() {
  const c = confirming.value
  if (!c) return
  if (c.kind === 'delete') emit('delete', props.webhook.id)
  else emit('retire-secret', c.secretId)
  confirming.value = undefined
}

async function copy() {
  if (!props.secret) return
  try {
    await navigator.clipboard.writeText(props.secret)
    copied.value = true
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div :class="styles.page">
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>

    <div v-if="secret" :class="styles.secret" role="status">
      <strong>Copy this signing secret now. It is shown once.</strong>
      <code :class="styles.code">{{ secret }}</code>
      <div :class="styles.actions">
        <button type="button" :class="styles.button" @click="copy">
          {{ copied ? 'Copied' : 'Copy' }}
        </button>
        <button type="button" :class="styles.button" @click="emit('dismiss')">Done</button>
      </div>
    </div>

    <div
      v-if="confirming"
      :class="styles.confirm"
      role="alertdialog"
      :aria-labelledby="`${idPrefix}-confirm`"
      @keydown.esc.stop="dismissConfirm"
    >
      <strong :id="`${idPrefix}-confirm`">{{
        confirming.kind === 'delete' ? 'Delete this webhook?' : 'Retire this secret?'
      }}</strong>
      <p :class="styles.meta">
        {{
          confirming.kind === 'delete'
            ? 'Deliveries stop and its history is removed.'
            : 'Payloads are no longer signed with it.'
        }}
      </p>
      <div :class="styles.actions">
        <button type="button" :class="styles.danger" :disabled="busy" @click="confirm">
          {{ confirming.kind === 'delete' ? 'Delete' : 'Retire' }}
        </button>
        <button ref="cancelButton" type="button" :class="styles.button" @click="dismissConfirm">
          Cancel
        </button>
      </div>
    </div>

    <section :class="styles.group" :aria-labelledby="`${idPrefix}-details`">
      <div :class="styles.head">
        <h3 :id="`${idPrefix}-details`" :class="styles.subheading">Details</h3>
        <label :class="styles.toggle">
          <input
            type="checkbox"
            :checked="webhook.enabled"
            :disabled="busy"
            @change="emit('update', { enabled: ($event.target as HTMLInputElement).checked })"
          />
          Enabled
        </label>
      </div>

      <form v-if="editing" :class="styles.form" @submit.prevent="save">
        <label :class="styles.field"
          >Name
          <input ref="nameInput" v-model="name" :class="styles.input" required />
        </label>
        <label :class="styles.field"
          >URL
          <input v-model="url" type="url" :class="styles.input" required />
        </label>
        <label :class="styles.field"
          >Event types (one per line, empty for all)
          <textarea v-model="events" :class="styles.input" rows="3" />
        </label>
        <div :class="styles.actions">
          <button type="submit" :class="styles.primary" :disabled="busy">Save</button>
          <button type="button" :class="styles.button" @click="stopEditing">Cancel</button>
        </div>
      </form>
      <template v-else>
        <dl :class="styles.facts">
          <dt>Name</dt>
          <dd>{{ webhook.name }}</dd>
          <dt>URL</dt>
          <dd :class="styles.mono">{{ webhook.url }}</dd>
          <dt>Events</dt>
          <dd>{{ eventTypesLabel(webhook.event_types) }}</dd>
          <dt>Created</dt>
          <dd>{{ webhook.created_by }} · {{ formatDateTime(webhook.created_at) }}</dd>
          <dt>Updated</dt>
          <dd>{{ formatDateTime(webhook.updated_at) }}</dd>
        </dl>
        <div :class="styles.actions">
          <button ref="editButton" type="button" :class="styles.button" @click="edit">Edit</button>
          <button
            type="button"
            :class="styles.danger"
            :disabled="busy"
            @click="ask({ kind: 'delete' }, $event)"
          >
            Delete
          </button>
        </div>
      </template>
    </section>

    <section :class="styles.group" :aria-labelledby="`${idPrefix}-secrets`">
      <div :class="styles.head">
        <h3 :id="`${idPrefix}-secrets`" :class="styles.subheading">Signing secrets</h3>
        <button
          type="button"
          :class="styles.button"
          :disabled="busy || isRotating(webhook)"
          @click="emit('rotate-secret', webhook.id)"
        >
          Rotate secret
        </button>
      </div>
      <p v-if="isRotating(webhook)" :class="styles.meta">
        Rotating: both secrets are accepted until the old one is retired.
      </p>
      <ul v-if="webhook.secrets.length" :class="styles.list">
        <li v-for="s in webhook.secrets" :key="s.id" :class="styles.item">
          <div>
            <code>{{ s.id }}</code>
            <div :class="styles.meta">
              Created {{ formatDateTime(s.created_at) }} ·
              {{ s.encrypted ? 'encrypted' : 'not encrypted' }}
            </div>
          </div>
          <button
            v-if="isRotating(webhook)"
            type="button"
            :class="styles.danger"
            :disabled="busy"
            :aria-label="`Retire secret ${s.id}`"
            @click="ask({ kind: 'retire', secretId: s.id }, $event)"
          >
            Retire
          </button>
        </li>
      </ul>
      <p v-else :class="styles.meta">No signing secrets.</p>
    </section>

    <section :class="styles.group" :aria-labelledby="`${idPrefix}-deliveries`">
      <h3 :id="`${idPrefix}-deliveries`" :class="styles.subheading">Deliveries</h3>
      <PynWebhookDeliveries
        :deliveries="deliveries"
        :status="deliveriesStatus"
        :has-more="deliveriesHasMore"
        :loading="deliveriesLoading"
        :error="deliveriesError"
        :can-redeliver="canRedeliver"
        :redelivering-id="redeliveringId"
        @filter="emit('filter', $event)"
        @load-more="emit('load-more')"
        @redeliver="emit('redeliver', $event)"
      />
    </section>
  </div>
</template>
