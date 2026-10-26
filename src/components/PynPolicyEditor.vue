<script setup lang="ts">
import { useId } from 'vue'
import styles from '../styles/PynPolicyEditor.module.scss'

const text = defineModel<string>('text', { required: true })
defineProps<{
  headRevision?: number | string
  dirty?: boolean
  saving?: boolean
  readonly?: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ save: []; revert: [] }>()
const id = useId()
</script>

<template>
  <section :class="styles.editor">
    <div :class="styles.head">
      <label :for="id" :class="styles.label">Policy (.pyn/pyn.toml)</label>
      <span v-if="headRevision !== undefined" :class="styles.revision"
        >Head revision {{ headRevision }}</span
      >
    </div>
    <textarea
      :id="id"
      v-model="text"
      :class="styles.area"
      spellcheck="false"
      autocomplete="off"
      autocapitalize="off"
      wrap="off"
      :readonly="readonly || saving"
      :disabled="disabled"
    />
    <slot name="notice" />
    <p v-if="readonly" :class="styles.hint">You can read the policy but not change it.</p>
    <div :class="styles.actions">
      <button
        type="button"
        :class="styles.primary"
        :disabled="disabled || readonly || saving || !dirty"
        @click="emit('save')"
      >
        {{ saving ? 'Saving…' : 'Save' }}
      </button>
      <button
        type="button"
        :class="styles.button"
        :disabled="disabled || readonly || saving || !dirty"
        @click="emit('revert')"
      >
        Revert
      </button>
      <span v-if="dirty && !saving" :class="styles.status">Unsaved changes</span>
    </div>
  </section>
</template>
