<script setup lang="ts">
import styles from '../styles/PynEmptyState.module.scss'

withDefaults(
  defineProps<{
    title: string
    description?: string
    primaryLabel?: string
    primaryHref?: string
    secondaryLabel?: string
    secondaryHref?: string
    compact?: boolean
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  }>(),
  { compact: false, headingLevel: 2 },
)
const emit = defineEmits<{ primary: [event: MouseEvent]; secondary: [event: MouseEvent] }>()
</script>

<template>
  <div :class="[styles.empty, compact && styles.compact]">
    <div v-if="$slots.icon" :class="styles.icon" aria-hidden="true"><slot name="icon" /></div>
    <component :is="`h${headingLevel}`" :class="styles.title">{{ title }}</component>
    <p v-if="description" :class="styles.description">{{ description }}</p>
    <div v-if="primaryLabel || secondaryLabel" :class="styles.actions">
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
