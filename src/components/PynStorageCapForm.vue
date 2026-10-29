<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import styles from '../styles/PynStorageCapForm.module.scss'
import { formatBytes } from '../utils/bytes'
import { CAP_UNITS, capToBytes, splitCap } from '../state/usage.state'
import type { SetRepoStorageCapRequest } from '../types/usage.types'

const props = defineProps<{
  /** The repository's current cap in bytes; null when it has none. */
  cap: number | null
  busy?: boolean
  error?: string
  /** Disables every control that writes; the current cap stays shown. */
  readonly?: boolean
}>()
const emit = defineEmits<{ save: [SetRepoStorageCapRequest]; clear: [] }>()

const initial = splitCap(props.cap)
const value = ref(initial.value)
const unit = ref(initial.unit)
const invalid = ref(false)

watch(
  () => props.cap,
  (cap) => {
    const s = splitCap(cap)
    value.value = s.value
    unit.value = s.unit
    invalid.value = false
  },
)

const current = computed(() => (props.cap === null ? 'No cap' : formatBytes(props.cap)))

function submit() {
  if (props.readonly) return
  const bytes = capToBytes(value.value, unit.value)
  invalid.value = bytes === null
  if (bytes !== null) emit('save', { storage_bytes: bytes })
}

function clear() {
  if (!props.readonly) emit('clear')
}
</script>

<template>
  <form :class="styles.form" @submit.prevent="submit">
    <p :class="styles.current">Current storage cap: {{ current }}</p>
    <div :class="styles.row">
      <label :class="styles.field"
        >Storage cap
        <input
          v-model="value"
          :class="styles.input"
          type="number"
          min="0"
          step="any"
          required
          :disabled="readonly"
          :aria-invalid="invalid"
          aria-describedby="cap-hint"
        />
      </label>
      <label :class="styles.field"
        >Unit
        <select v-model="unit" :class="styles.input" :disabled="readonly">
          <option v-for="u in CAP_UNITS" :key="u.label" :value="u.label">{{ u.label }}</option>
        </select>
      </label>
    </div>
    <span id="cap-hint" :class="styles.hint">
      Writes that add stored bytes are refused once use reaches the cap. Lowering it deletes
      nothing.
    </span>
    <p v-if="invalid" :class="styles.fieldError" role="alert">Enter a cap of zero or more.</p>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button type="submit" :class="styles.primary" :disabled="busy || readonly">Save cap</button>
      <button
        v-if="cap !== null"
        type="button"
        :class="styles.quiet"
        :disabled="busy || readonly"
        @click="clear"
      >
        Remove cap
      </button>
    </div>
  </form>
</template>
