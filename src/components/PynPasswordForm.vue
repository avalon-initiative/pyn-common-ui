<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import styles from '../styles/PynPasswordForm.module.scss'
import { passwordProblem } from '../state/password.state'

const props = defineProps<{
  rules?: string[]
  minLength?: number
  busy?: boolean
  error?: string
  success?: string
}>()
const emit = defineEmits<{ submit: [value: { current: string; next: string }] }>()

const current = ref('')
const next = ref('')
const confirm = ref('')
const tried = ref(false)

const problem = computed(() =>
  passwordProblem(
    { current: current.value, next: next.value, confirm: confirm.value },
    props.minLength,
  ),
)

watch(
  () => props.success,
  (message) => {
    if (!message) return
    current.value = next.value = confirm.value = ''
    tried.value = false
  },
)

function send() {
  tried.value = true
  if (problem.value || props.busy) return
  emit('submit', { current: current.value, next: next.value })
}
</script>

<template>
  <form :class="styles.form" novalidate @submit.prevent="send">
    <ul v-if="rules?.length" :class="styles.rules" aria-label="Password rules">
      <li v-for="rule in rules" :key="rule">{{ rule }}</li>
    </ul>
    <label :class="styles.field"
      >Current password
      <input
        v-model="current"
        :class="styles.input"
        type="password"
        autocomplete="current-password"
        required
        :disabled="busy"
      />
    </label>
    <label :class="styles.field"
      >New password
      <input
        v-model="next"
        :class="styles.input"
        type="password"
        autocomplete="new-password"
        required
        :minlength="minLength"
        :disabled="busy"
      />
    </label>
    <label :class="styles.field"
      >Confirm new password
      <input
        v-model="confirm"
        :class="styles.input"
        type="password"
        autocomplete="new-password"
        required
        :disabled="busy"
      />
    </label>
    <p v-if="tried && problem" :class="styles.error" role="alert">{{ problem }}</p>
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <p v-if="success" :class="styles.success" role="status">{{ success }}</p>
    <button type="submit" :class="styles.button" :disabled="busy">
      {{ busy ? 'Changing password…' : 'Change password' }}
    </button>
  </form>
</template>
