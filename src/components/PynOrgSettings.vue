<script setup lang="ts">
import { ref, watch } from 'vue'
import styles from '../styles/PynOrgSettings.module.scss'
import { READ_ONLY_CHOICES, readOnlyChoice, readOnlyValue } from '../state/org.state'
import type { OrgSettings, ReadOnlyChoice } from '../types/org.types'

const props = defineProps<{
  settings: OrgSettings
  busy?: boolean
  /** Disables every control that writes; the current settings stay shown. */
  readonly?: boolean
  error?: string
}>()
const emit = defineEmits<{ save: [OrgSettings] }>()

const choice = ref<ReadOnlyChoice>(readOnlyChoice(props.settings.exclusive_read_only))
watch(
  () => props.settings.exclusive_read_only,
  (v) => (choice.value = readOnlyChoice(v)),
)

function submit() {
  if (!props.readonly) emit('save', { exclusive_read_only: readOnlyValue(choice.value) })
}
</script>

<template>
  <form :class="styles.form" @submit.prevent="submit">
    <h3 :class="styles.heading">Exclusive files</h3>
    <label :class="styles.field"
      >Make exclusive files read-only until locked
      <select v-model="choice" :class="styles.input" :disabled="busy || readonly">
        <option v-for="c in READ_ONLY_CHOICES" :key="c.value" :value="c.value">
          {{ c.label }}
        </option>
      </select>
    </label>
    <span :class="styles.hint">
      A courtesy in work trees: the server still publishes an exclusive path only for the account
      that holds its lock. A repository's own policy file overrides this.
    </span>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <button type="submit" :class="styles.primary" :disabled="busy || readonly">Save</button>
  </form>
</template>
