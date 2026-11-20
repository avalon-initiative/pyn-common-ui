<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from '../styles/PynAccessSessionList.module.scss'
import { newestFirst } from '../state/access-session.state'
import type { AccessSessionInfo, StartedAccessSession } from '../types/access-session.types'
import PynAccessSessionItem from './PynAccessSessionItem.vue'
import PynSecretReveal from './PynSecretReveal.vue'

const props = defineProps<{
  sessions: AccessSessionInfo[]
  /** A session just started; its secret is shown until dismissed. */
  started?: StartedAccessSession
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ end: [string]; dismiss: [] }>()

const ordered = computed(() => newestFirst(props.sessions))
const confirming = ref<string | null>(null)

function end(id: string) {
  confirming.value = null
  emit('end', id)
}
</script>

<template>
  <section :class="styles.page">
    <h2 :class="styles.heading">Access sessions</h2>
    <PynSecretReveal
      v-if="started"
      :secret="started.secret"
      message="Copy this session secret now. It is shown once."
      @dismiss="emit('dismiss')"
    >
      Present it as a bearer token to the <code>pyn</code> CLI or an API client to act as
      {{ started.info.user }}. It stops working at the session's expiry or when you end it.
    </PynSecretReveal>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <ul v-if="ordered.length" :class="styles.list">
      <PynAccessSessionItem v-for="s in ordered" :key="s.id" :session="s" show-user>
        <template v-if="s.state === 'active'" #actions>
          <form v-if="confirming === s.id" :class="styles.confirm" @submit.prevent="end(s.id)">
            <span>End this session?</span>
            <button type="submit" :class="styles.danger" :disabled="busy">End session</button>
            <button type="button" :class="styles.quiet" @click="confirming = null">Cancel</button>
          </form>
          <button
            v-else
            type="button"
            :class="styles.danger"
            :disabled="busy"
            :aria-label="`End session on ${s.user}`"
            @click="confirming = s.id"
          >
            End
          </button>
        </template>
      </PynAccessSessionItem>
    </ul>
    <p v-else :class="styles.empty">No administrator has acted as any account.</p>
  </section>
</template>
