<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynAccountNotice.module.scss'
import {
  NOTICE_TEXT,
  NO_EMAIL_NOTE,
  NOTICE_TITLES,
  VERIFICATION_GUIDANCE,
  VERIFICATION_NOT_REQUIRED_TEXT,
} from '../state/account.state'
import type { BlockedStatus } from '../types/auth.types'
import PynIcon from './PynIcon.vue'
import PynResendForm from './PynResendForm.vue'

const props = defineProps<{
  status: BlockedStatus
  emailVerification?: boolean
  /** Replaces the default note shown when the server sends no confirmation email. */
  noEmailNote?: string
  user?: string
  busy?: boolean
  sent?: boolean
  error?: string
}>()
const emit = defineEmits<{ resend: [string]; back: [] }>()
const showNote = computed(
  () => props.emailVerification === false && props.status !== 'account_disabled',
)
const text = computed(() =>
  props.status === 'pending_verification' && props.emailVerification === false
    ? VERIFICATION_NOT_REQUIRED_TEXT
    : NOTICE_TEXT[props.status],
)
</script>

<template>
  <section :class="[styles.card, status === 'account_disabled' && styles.disabled]">
    <PynIcon :name="status === 'account_disabled' ? 'stop' : 'alert'" :class="styles.icon" />
    <h2 :class="styles.title">{{ NOTICE_TITLES[status] }}</h2>
    <p :class="styles.text">
      <template v-if="user"
        >Account <strong>{{ user }}</strong>.
      </template>
      {{ text }}
    </p>
    <p v-if="status === 'pending_verification' && emailVerification" :class="styles.text">
      {{ VERIFICATION_GUIDANCE }}
    </p>
    <p v-if="showNote" :class="styles.text" data-no-email>{{ noEmailNote ?? NO_EMAIL_NOTE }}</p>
    <PynResendForm
      v-if="status === 'pending_verification'"
      :busy="busy"
      :sent="sent"
      :error="error"
      @resend="(email) => emit('resend', email)"
    />
    <button type="button" :class="styles.link" @click="emit('back')">Back to sign in</button>
  </section>
</template>
