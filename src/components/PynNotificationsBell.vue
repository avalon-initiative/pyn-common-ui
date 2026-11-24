<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynNotificationsBell.module.scss'
import { countText, notificationsText } from '../state/top-bar.state'

const props = defineProps<{
  /** Pending items; the badge hides at zero while the bell stays. */
  count?: number
  /** Where pending items are listed; the panel links there when the count is above zero. */
  href?: string
}>()

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
      <span v-if="countText(props.count)" :class="styles.badge" aria-hidden="true" data-badge>{{
        countText(props.count)
      }}</span>
      <span :class="styles.hidden">{{ notificationsText(props.count) }}</span>
    </button>
    <div
      v-if="open"
      ref="panel"
      :class="styles.panel"
      role="dialog"
      aria-label="Notifications"
      tabindex="-1"
    >
      <PynEmptyState
        compact
        :heading-level="3"
        title="Work in progress"
        description="Notifications will appear here once the server keeps an inbox."
      >
        <template #icon><PynIcon name="bell" /></template>
      </PynEmptyState>
      <a v-if="href && countText(props.count)" :href="href" :class="styles.link" data-pending>
        {{ notificationsText(props.count) }} waiting
      </a>
    </div>
  </div>
</template>
