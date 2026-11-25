<script setup lang="ts">
import PynAvatarUpload from './PynAvatarUpload.vue'
import PynSettingsSection from './PynSettingsSection.vue'

defineProps<{
  owner: string
  /** The repository's own icon; without it the owner's avatar stands in. */
  iconUrl?: string | null
  ownerAvatarUrl?: string | null
  busy?: boolean
  /** Disables upload and remove. */
  readonly?: boolean
  error?: string
}>()
const emit = defineEmits<{ upload: [File]; clear: [] }>()
</script>

<template>
  <PynSettingsSection
    title="Repository icon"
    description="Shown beside the name in the header, repository lists, Explore and the forks menu. Without one, the owner's avatar stands in."
    plain
    form-width
    data-repo-icon
  >
    <PynAvatarUpload
      :name="owner"
      :src="iconUrl"
      :fallback-src="ownerAvatarUrl"
      alt="Repository icon"
      noun="icon"
      :busy="busy"
      :disabled="readonly"
      :error="error"
      @upload="emit('upload', $event)"
      @remove="emit('clear')"
    >
      <template #note
        >PNG, JPEG or WebP, at most 1 MiB. A square image of at least 200 × 200 pixels looks best;
        it is shown round.</template
      >
    </PynAvatarUpload>
  </PynSettingsSection>
</template>
