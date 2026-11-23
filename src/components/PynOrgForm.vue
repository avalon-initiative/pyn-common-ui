<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import styles from '../styles/PynOrgForm.module.scss'

const props = defineProps<{
  busy?: boolean
  error?: string
  nameMessage?: string
  /** The name as it will be stored; shown as a preview hint. */
  nameCanonical?: string
  /** Shows a secondary action next to the submit button: a link with `cancelHref`, else a button. */
  cancelHref?: string
  /** Defaults to "Cancel" when `cancelHref` is set. */
  cancelLabel?: string
}>()
const emit = defineEmits<{
  submit: [name: string]
  nameInput: [name: string]
  cancel: [event: MouseEvent]
}>()

const name = ref('')
const id = useId()
const describedBy = computed(() =>
  [
    `${id}-hint`,
    props.nameCanonical ? `${id}-canonical` : '',
    props.nameMessage ? `${id}-message` : '',
  ]
    .filter(Boolean)
    .join(' '),
)
</script>

<template>
  <form :class="styles.form" @submit.prevent="emit('submit', name.trim())">
    <label :class="styles.field"
      >Organization name
      <input
        v-model="name"
        :class="styles.input"
        placeholder="studio"
        required
        minlength="2"
        maxlength="39"
        autocapitalize="none"
        :aria-describedby="describedBy"
        :aria-invalid="nameMessage ? 'true' : undefined"
        @input="emit('nameInput', name.trim())"
      />
      <span :id="`${id}-hint`" :class="styles.hint"
        >2 to 39 letters, digits, "-" or "_". Spaces become "-" and case is ignored. It shares its
        namespace with user names.</span
      >
      <span v-if="nameCanonical" :id="`${id}-canonical`" :class="styles.hint" data-canonical
        >Will be created as: {{ nameCanonical }}</span
      >
      <span v-if="nameMessage" :id="`${id}-message`" :class="styles.message">{{
        nameMessage
      }}</span>
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button type="submit" :class="styles.primary" :disabled="busy">Create organization</button>
      <template v-if="cancelHref || cancelLabel">
        <a
          v-if="cancelHref"
          :href="cancelHref"
          :class="styles.cancel"
          @click="emit('cancel', $event)"
          >{{ cancelLabel ?? 'Cancel' }}</a
        >
        <button v-else type="button" :class="styles.cancel" @click="emit('cancel', $event)">
          {{ cancelLabel }}
        </button>
      </template>
    </div>
  </form>
</template>
