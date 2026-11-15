<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import styles from '../styles/PynAvatar.module.scss'
import { initials } from '../state/profile.state'
import type { AvatarSize } from '../types/profile.types'

const props = withDefaults(
  defineProps<{
    /** The account's username; the accessible name unless `name` is given. */
    username: string
    /** Display name; initials come from it when set. */
    name?: string | null
    /** Image URL; a missing or failing image falls back to initials. */
    src?: string | null
    size?: AvatarSize
  }>(),
  { size: 'md' },
)

const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)
const label = computed(() => props.name?.trim() || props.username)
const showImage = computed(() => !!props.src && !failed.value)
</script>

<template>
  <span :class="styles.avatar" :data-size="size" role="img" :aria-label="`${label}'s avatar`">
    <img
      v-if="showImage"
      :src="src ?? undefined"
      alt=""
      :class="styles.image"
      @error="failed = true"
    />
    <span v-else :class="styles.initials" data-initials aria-hidden="true">{{
      initials(label)
    }}</span>
  </span>
</template>
