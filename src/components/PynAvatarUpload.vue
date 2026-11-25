<script setup lang="ts">
import { computed, ref } from 'vue'
import styles from '../styles/PynAvatarUpload.module.scss'
import { imageProblem } from '../state/account-settings.state'

const props = withDefaults(
  defineProps<{
    /** Name the initial comes from when there is no image. */
    name?: string
    /** The current image; `remove` is offered only with it. */
    src?: string | null
    /** Shown instead of the initial when there is no `src`, such as the owner's avatar. */
    fallbackSrc?: string | null
    /** Accessible name of the preview image. */
    alt?: string
    /** Word used in the labels and messages, such as "avatar" or "icon". */
    noun?: string
    busy?: boolean
    disabled?: boolean
    error?: string
  }>(),
  { noun: 'avatar', alt: undefined, name: '' },
)
const emit = defineEmits<{ upload: [File]; remove: [] }>()

const localError = ref('')
const shown = computed(() => props.src || props.fallbackSrc || '')
const initial = computed(() => (props.name || '?')[0]!.toUpperCase())

function pick(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  localError.value = imageProblem(file, props.noun)
  if (!localError.value) emit('upload', file)
}
</script>

<template>
  <div :class="styles.upload">
    <div :class="styles.row">
      <img
        v-if="shown"
        :src="shown"
        :alt="alt ?? `Your ${noun}`"
        :class="styles.preview"
        :data-fallback="!src || undefined"
      />
      <span v-else :class="styles.preview" aria-hidden="true">{{ initial }}</span>
      <div :class="styles.actions">
        <label :class="[styles.pick, (busy || disabled) && styles.disabled]"
          >{{ busy ? 'Uploading…' : `Change ${noun}` }}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            :class="styles.file"
            :disabled="busy || disabled"
            @change="pick"
          />
        </label>
        <button
          v-if="src"
          type="button"
          :class="styles.remove"
          :disabled="busy || disabled"
          @click="emit('remove')"
        >
          Remove {{ noun }}
        </button>
        <p :class="styles.note">
          <slot name="note">PNG, JPEG or WebP, at most 1 MiB.</slot>
        </p>
      </div>
    </div>
    <p v-if="localError || error" :class="styles.error" role="alert">
      {{ localError || error }}
    </p>
  </div>
</template>
