<script setup lang="ts">
import { reactive, ref } from 'vue'
import styles from '../styles/PynAddAccount.module.scss'
import { useReveal } from '../state/reveal.state'
import type { NewAccount } from '../types/server-invitation.types'

defineProps<{ busy?: boolean; error?: string }>()
const emit = defineEmits<{ add: [NewAccount]; cancel: [] }>()
/** Add form open; Add account shows while closed. The app closes it after a success. */
const adding = defineModel<boolean>('adding', { default: false })

const form = reactive<NewAccount>({ username: '', password: '' })
const field = ref<HTMLInputElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
useReveal(adding, field, button, () => Object.assign(form, { username: '', password: '' }))

function add() {
  emit('add', { username: form.username.trim(), password: form.password })
  form.password = ''
}
function cancel() {
  adding.value = false
  emit('cancel')
}
</script>

<template>
  <form v-if="adding" :class="styles.form" @submit.prevent="add">
    <h3 :class="styles.subheading">Add an account</h3>
    <label :class="styles.field"
      >User name
      <input
        ref="field"
        v-model="form.username"
        :class="styles.input"
        required
        autocapitalize="none"
        autocomplete="off"
        :disabled="busy"
      />
    </label>
    <label :class="styles.field"
      >One-time password (10 characters or more)
      <input
        v-model="form.password"
        :class="styles.input"
        type="password"
        minlength="10"
        required
        autocomplete="new-password"
        :disabled="busy"
      />
    </label>
    <p :class="styles.note">The person must choose their own password when they first sign in.</p>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button type="submit" :class="styles.primary" :disabled="busy">Add account</button>
      <button type="button" :class="styles.cancel" @click="cancel">Cancel</button>
    </div>
  </form>
  <button v-else ref="button" type="button" :class="styles.primary" @click="adding = true">
    Add account
  </button>
</template>
