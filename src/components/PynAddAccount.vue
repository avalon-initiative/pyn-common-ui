<script setup lang="ts">
import { reactive } from 'vue'
import styles from '../styles/PynAddAccount.module.scss'
import type { NewAccount } from '../types/server-invitation.types'

defineProps<{ busy?: boolean; error?: string }>()
const emit = defineEmits<{ add: [NewAccount] }>()

const form = reactive<NewAccount>({ username: '', password: '' })

function add() {
  emit('add', { username: form.username.trim(), password: form.password })
  form.password = ''
}
</script>

<template>
  <form :class="styles.form" @submit.prevent="add">
    <h3 :class="styles.subheading">Add an account</h3>
    <label :class="styles.field"
      >User name
      <input
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
    <button type="submit" :class="styles.primary" :disabled="busy">Add account</button>
  </form>
</template>
