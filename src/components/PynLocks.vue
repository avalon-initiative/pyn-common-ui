<script setup lang="ts">
import { ref } from 'vue'
import PynLockIcon from './PynLockIcon.vue'
import PynPerson from './PynPerson.vue'
import PynModeChip from './PynModeChip.vue'
import styles from '../styles/PynLocks.module.scss'
import { formatDateTime } from '../utils/datetime'
import { formatLease } from '../utils/lease'
import type { LockInfo } from '../types/lock.types'

defineProps<{
  locks: LockInfo[]
  canForce?: boolean
  now?: Date
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ forceUnlock: [{ path: string; reason: string }] }>()

const forcing = ref('')
const reason = ref('')

function confirm() {
  emit('forceUnlock', { path: forcing.value, reason: reason.value.trim() })
  forcing.value = ''
  reason.value = ''
}
</script>

<template>
  <section :class="styles.page">
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div v-if="locks.length" :class="styles.box">
      <div :class="styles.head">
        {{ locks.length }} {{ locks.length === 1 ? 'lock' : 'locks' }} held
      </div>
      <ul :class="styles.list">
        <li v-for="lock in locks" :key="lock.path" :class="styles.item">
          <span :class="styles.path"
            ><PynLockIcon :class="styles.lockIcon" /><template
              v-for="(part, i) in lock.path.split(/(?<=\/)/)"
              :key="i"
              >{{ part }}<wbr /></template
          ></span>
          <span :class="styles.info">
            <PynModeChip mode="exclusive" />
            <span :class="styles.meta" :title="`Expires ${formatDateTime(lock.expires_at)}`">
              <PynPerson :name="lock.owner" :identity="lock.identity" /> ·
              {{ formatLease(lock.expires_at, now ?? new Date()) }}</span
            >
          </span>
          <button
            v-if="canForce && forcing !== lock.path"
            type="button"
            :class="[styles.danger, styles.action]"
            @click="forcing = lock.path"
          >
            Force unlock
          </button>
          <form v-else-if="forcing === lock.path" :class="styles.reason" @submit.prevent="confirm">
            <input v-model="reason" :class="styles.input" placeholder="Reason" required />
            <button type="submit" :class="styles.danger" :disabled="busy">Unlock</button>
            <button type="button" :class="styles.quiet" @click="forcing = ''">Cancel</button>
          </form>
        </li>
      </ul>
    </div>
    <p v-else :class="styles.empty">No locks are held.</p>
  </section>
</template>
