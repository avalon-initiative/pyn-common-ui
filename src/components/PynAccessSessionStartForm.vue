<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import styles from '../styles/PynAccessSessionStartForm.module.scss'
import {
  ACCESS_SESSION_NOTES_MAX,
  ACCESS_SESSION_REASONS,
  accessSessionProblem,
} from '../state/access-session.state'
import type { AccessSessionReason, AccessSessionStart } from '../types/access-session.types'

defineProps<{ user: string; busy?: boolean; error?: string }>()
const emit = defineEmits<{ submit: [AccessSessionStart] }>()

const id = useId()
const reason = ref<AccessSessionReason | ''>('')
const notes = ref('')
const submitted = ref(false)

const problem = computed(() => accessSessionProblem(reason.value, notes.value))

function submit() {
  submitted.value = true
  if (problem.value || !reason.value) return
  const text = notes.value.trim()
  emit('submit', text ? { reason: reason.value, notes: text } : { reason: reason.value })
}
</script>

<template>
  <form :class="styles.form" novalidate @submit.prevent="submit">
    <h2 :class="styles.heading">Act as {{ user }}</h2>
    <p :class="styles.note">
      The session lasts at most an hour and is recorded. {{ user }} sees who acted, why, and the
      notes below.
    </p>
    <label :class="styles.field" :for="`${id}-reason`">
      Reason
      <select
        :id="`${id}-reason`"
        v-model="reason"
        :class="styles.input"
        :aria-invalid="submitted && !reason ? 'true' : undefined"
        required
      >
        <option value="" disabled>Choose a reason</option>
        <option v-for="r in ACCESS_SESSION_REASONS" :key="r.value" :value="r.value">
          {{ r.label }}
        </option>
      </select>
    </label>
    <label :class="styles.field" :for="`${id}-notes`">
      Notes{{ reason === 'other' ? ' (required)' : ' (optional)' }}
      <textarea
        :id="`${id}-notes`"
        v-model="notes"
        :class="styles.input"
        rows="3"
        :maxlength="ACCESS_SESSION_NOTES_MAX"
        :aria-invalid="submitted && reason === 'other' && !notes.trim() ? 'true' : undefined"
        :aria-describedby="`${id}-count`"
      />
      <span :id="`${id}-count`" :class="styles.hint">
        {{ notes.length }} / {{ ACCESS_SESSION_NOTES_MAX }}
      </span>
    </label>
    <p v-if="submitted && problem" :class="styles.message" role="alert">{{ problem }}</p>
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <button type="submit" :class="styles.primary" :disabled="busy">
      {{ busy ? 'Starting...' : 'Start session' }}
    </button>
  </form>
</template>
