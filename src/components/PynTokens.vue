<script setup lang="ts">
import { watch } from 'vue'
import styles from '../styles/PynTokens.module.scss'
import { formatDate } from '../utils/datetime'
import { describeAccess, describeExpiry, describeGrant } from '../state/token.state'
import PynTokenForm from './PynTokenForm.vue'
import type { TokenForm, TokenInfo, TokenOwnerOption } from '../types/token.types'

const props = defineProps<{
  tokens: TokenInfo[]
  owners: TokenOwnerOption[]
  repos: string[]
  secret?: string
  busy?: boolean
  error?: string
}>()

const emit = defineEmits<{
  create: [TokenForm]
  revoke: [string]
  dismiss: []
  'owner-change': [string]
}>()

/** Create form open; Generate new token shows while closed. A new `secret` closes it. */
const creating = defineModel<boolean>('adding', { default: false })

watch(
  () => props.secret,
  (secret) => {
    if (secret) creating.value = false
  },
)
</script>

<template>
  <section :class="styles.page">
    <h2 :class="styles.heading">Personal access tokens</h2>
    <p :class="styles.note">
      Tokens let scripts and automation act as you, for one owner, with only the permissions you
      choose. A token never grants more than your role allows and cannot be edited once created.
    </p>

    <div v-if="secret" :class="styles.secret" role="status">
      <strong>Copy your new token now. It is shown once.</strong>
      <code :class="styles.code">{{ secret }}</code>
      <button type="button" :class="styles.remove" @click="emit('dismiss')">Done</button>
    </div>

    <ul v-if="tokens.length" :class="styles.list">
      <li v-for="t in tokens" :key="t.id" :class="styles.item">
        <div>
          <strong>{{ t.name }}</strong>
          <span v-if="t.revoked_at" :class="styles.meta"> · revoked</span>
          <span v-if="t.sign_in" :class="styles.meta"> · sign-in</span>
          <div v-if="t.description" :class="styles.meta">{{ t.description }}</div>
          <div :class="styles.meta">
            Owner {{ t.owner }} · {{ describeAccess(t.repository_access) }}
            <template v-if="t.repository_access.repos?.length">
              ({{ t.repository_access.repos.join(', ') }})
            </template>
          </div>
          <div v-if="t.permissions.length" :class="styles.meta">
            {{ t.permissions.map(describeGrant).join(', ') }}
          </div>
          <div :class="styles.meta">
            Created {{ formatDate(t.created_at) }} · {{ describeExpiry(t) }} ·
            {{ t.last_used_at ? `last used ${formatDate(t.last_used_at)}` : 'never used' }}
          </div>
        </div>
        <button
          v-if="!t.revoked_at"
          type="button"
          :class="styles.remove"
          :disabled="busy"
          @click="emit('revoke', t.id)"
        >
          Revoke
        </button>
      </li>
    </ul>
    <p v-else :class="styles.empty">No tokens yet.</p>

    <p v-if="error && !creating" :class="styles.error" role="alert">{{ error }}</p>
    <PynTokenForm
      v-if="creating"
      :owners="owners"
      :repos="repos"
      :busy="busy"
      :error="error"
      @submit="emit('create', $event)"
      @cancel="creating = false"
      @owner-change="emit('owner-change', $event)"
    />
    <button v-else type="button" :class="styles.primary" @click="creating = true">
      Generate new token
    </button>
  </section>
</template>
