<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PynDismissButton from './PynDismissButton.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynNotificationsBell.module.scss'
import { countText, notificationsText } from '../state/top-bar.state'
import { formatAgo } from '../utils/ago'
import { formatDateTime } from '../utils/datetime'
import type { BellEntry } from '../types/top-bar.types'

const props = defineProps<{
  /** Pending items; the badge hides at zero while the bell stays. Ignored when `entries` is given. */
  count?: number
  /** Notices and invitations listed above the Work in progress state; their number drives the badge. */
  entries?: BellEntry[]
  now?: Date
  /** Where pending items are listed; the panel links there when the count is above zero. */
  href?: string
}>()

const emit = defineEmits<{ dismiss: [id: string]; accept: [id: string]; decline: [id: string] }>()

const total = computed(() => (props.entries ? props.entries.length : props.count))
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

const away = (e: Event) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false
}
const escape = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  open.value = false
  trigger.value?.focus()
}
const stop = () => {
  document.removeEventListener('click', away)
  document.removeEventListener('keydown', escape)
}
watch(open, async (o) => {
  if (!o) return stop()
  document.addEventListener('click', away)
  document.addEventListener('keydown', escape)
  await nextTick()
  panel.value?.focus()
})
onBeforeUnmount(stop)
</script>

<template>
  <div ref="root" :class="styles.bell">
    <button
      ref="trigger"
      type="button"
      :class="styles.trigger"
      aria-haspopup="dialog"
      :aria-expanded="open"
      data-bell
      @click="open = !open"
    >
      <PynIcon name="bell" />
      <span v-if="countText(total)" :class="styles.badge" aria-hidden="true" data-badge>{{
        countText(total)
      }}</span>
      <span :class="styles.hidden">{{ notificationsText(total) }}</span>
    </button>
    <div
      v-if="open"
      ref="panel"
      :class="styles.panel"
      role="dialog"
      aria-label="Notifications"
      tabindex="-1"
    >
      <ul v-if="entries?.length" :class="styles.list" aria-label="Notifications">
        <li v-for="e in entries" :key="e.id" :class="styles.entry" data-entry>
          <div :class="styles.body">
            <a v-if="e.href" :href="e.href" :class="styles.title">{{ e.title }}</a>
            <span v-else :class="styles.title">{{ e.title }}</span>
            <time v-if="e.at" :class="styles.time" :datetime="e.at" :title="formatDateTime(e.at)">{{
              formatAgo(e.at, now ?? new Date())
            }}</time>
            <span v-if="e.kind === 'invitation'" :class="styles.actions">
              <button
                type="button"
                :class="styles.accept"
                :disabled="e.busy"
                :aria-label="`Accept ${e.title}`"
                data-accept
                @click="emit('accept', e.id)"
              >
                Accept
              </button>
              <button
                type="button"
                :class="styles.decline"
                :disabled="e.busy"
                :aria-label="`Decline ${e.title}`"
                data-decline
                @click="emit('decline', e.id)"
              >
                Decline
              </button>
            </span>
          </div>
          <PynDismissButton
            v-if="e.kind !== 'invitation'"
            :label="`Dismiss ${e.title}`"
            data-dismiss
            @click="emit('dismiss', e.id)"
          />
        </li>
      </ul>
      <PynEmptyState
        kind="wip"
        compact
        :heading-level="3"
        icon="bell"
        description="Notifications will appear here once the server keeps an inbox."
      />
      <a v-if="href && countText(total)" :href="href" :class="styles.link" data-pending>
        {{ notificationsText(total) }} waiting
      </a>
    </div>
  </div>
</template>
