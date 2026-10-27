<script setup lang="ts">
import { computed, reactive, ref, useId } from 'vue'
import styles from '../styles/PynWebhookForm.module.scss'
import { parseEventTypes, webhookNameProblem, webhookUrlProblem } from '../state/webhook.state'
import PynSecretReveal from './PynSecretReveal.vue'
import type { WebhookCreate } from '../types/webhook.types'

defineProps<{
  /** Signing secret from the create response; switches the form to the one-time reveal. */
  secret?: string
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ submit: [WebhookCreate]; cancel: []; dismiss: [] }>()

const id = useId()
const form = reactive({ name: '', url: '', events: '', enabled: true })
const submitted = ref(false)

const nameProblem = computed(() => (submitted.value ? webhookNameProblem(form.name) : null))
const urlProblem = computed(() => (submitted.value ? webhookUrlProblem(form.url) : null))

function submit() {
  submitted.value = true
  if (webhookNameProblem(form.name) || webhookUrlProblem(form.url)) return
  emit('submit', {
    name: form.name.trim(),
    url: form.url.trim(),
    event_types: parseEventTypes(form.events),
    enabled: form.enabled,
  })
}
</script>

<template>
  <PynSecretReveal v-if="secret" :secret="secret" @dismiss="emit('dismiss')" />
  <form v-else :class="styles.form" novalidate @submit.prevent="submit">
    <label :class="styles.field"
      >Name
      <input
        v-model="form.name"
        :class="styles.input"
        required
        :aria-invalid="nameProblem ? 'true' : undefined"
        :aria-describedby="`${id}-name`"
      />
      <span :id="`${id}-name`" :class="nameProblem ? styles.message : styles.hint">{{
        nameProblem ?? '1 to 256 bytes, no control characters.'
      }}</span>
    </label>
    <label :class="styles.field"
      >URL
      <input
        v-model="form.url"
        type="url"
        :class="styles.input"
        required
        autocapitalize="none"
        :aria-invalid="urlProblem ? 'true' : undefined"
        :aria-describedby="`${id}-url`"
      />
      <span :id="`${id}-url`" :class="urlProblem ? styles.message : styles.hint">{{
        urlProblem ?? 'https only, no user name, password or fragment, at most 2048 bytes.'
      }}</span>
    </label>
    <label :class="styles.field"
      >Event types (one per line, empty for all)
      <textarea v-model="form.events" :class="styles.input" rows="3" />
    </label>
    <label :class="styles.toggle">
      <input v-model="form.enabled" type="checkbox" />
      Enabled
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button type="submit" :class="styles.primary" :disabled="busy">Create</button>
      <button type="button" :class="styles.button" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
