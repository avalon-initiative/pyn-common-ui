<script setup lang="ts">
import { computed } from 'vue'
import styles from '../styles/PynEmptyState.module.scss'
import PynIcon from './PynIcon.vue'

export type PynEmptyStateKind = 'empty' | 'unsupported' | 'wip'

const KIND_DEFAULTS: Record<
  PynEmptyStateKind,
  { title: string; description: string; icon: string }
> = {
  empty: {
    title: 'Nothing here yet',
    description: 'Items will show up here once there are some.',
    icon: 'folder',
  },
  unsupported: {
    title: 'Not supported yet',
    description: 'This feature is not available in pyn yet.',
    icon: 'info',
  },
  wip: {
    title: 'Work in progress',
    description: 'This part is still being built and will appear here when it is ready.',
    icon: 'history',
  },
}

const props = withDefaults(
  defineProps<{
    /** Picks default title, text and icon; each is overridden by its own prop or slot. */
    kind?: PynEmptyStateKind
    title?: string
    description?: string
    /** PynIcon name replacing the kind's default icon. */
    icon?: string
    /** Commands shown one per line in a monospace block under the description. */
    commands?: string[]
    primaryLabel?: string
    primaryHref?: string
    secondaryLabel?: string
    secondaryHref?: string
    compact?: boolean
    /** One muted line with the icon beside the title, for a side column section. */
    inline?: boolean
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  }>(),
  { compact: false, inline: false, headingLevel: 2 },
)
const shown = computed(() => {
  const d = props.kind ? KIND_DEFAULTS[props.kind] : undefined
  return {
    title: props.title ?? d?.title ?? '',
    description: props.description ?? d?.description,
    icon: props.icon ?? d?.icon,
  }
})
const emit = defineEmits<{ primary: [event: MouseEvent]; secondary: [event: MouseEvent] }>()
</script>

<template>
  <div :class="[styles.empty, compact && styles.compact, inline && styles.inline]">
    <div v-if="$slots.icon || shown.icon" :class="styles.icon" aria-hidden="true">
      <slot name="icon"><PynIcon v-if="shown.icon" :name="shown.icon" /></slot>
    </div>
    <component :is="`h${headingLevel}`" :class="styles.title">{{ shown.title }}</component>
    <p v-if="shown.description" :class="styles.description">{{ shown.description }}</p>
    <ul v-if="commands?.length" :class="styles.commands" aria-label="Commands">
      <li v-for="(command, i) in commands" :key="i">
        <code :class="styles.command" data-command>{{ command }}</code>
      </li>
    </ul>
    <div v-if="primaryLabel || secondaryLabel || $slots.actions" :class="styles.actions">
      <slot name="actions" />
      <template v-if="primaryLabel">
        <a
          v-if="primaryHref"
          :href="primaryHref"
          :class="styles.primary"
          @click="emit('primary', $event)"
          >{{ primaryLabel }}</a
        >
        <button v-else type="button" :class="styles.primary" @click="emit('primary', $event)">
          {{ primaryLabel }}
        </button>
      </template>
      <template v-if="secondaryLabel">
        <a
          v-if="secondaryHref"
          :href="secondaryHref"
          :class="styles.secondary"
          @click="emit('secondary', $event)"
          >{{ secondaryLabel }}</a
        >
        <button v-else type="button" :class="styles.secondary" @click="emit('secondary', $event)">
          {{ secondaryLabel }}
        </button>
      </template>
    </div>
  </div>
</template>
