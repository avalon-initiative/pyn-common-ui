<script setup lang="ts">
import { ref, watch } from 'vue'
import PynSettingsSection from './PynSettingsSection.vue'
import styles from '../styles/PynTwoFactorRequirement.module.scss'
import { GRACE_DAYS_DEFAULT, GRACE_DAYS_MAX, validGraceDays } from '../state/two-factor.state'
import { formatDate } from '../utils/datetime'
import type { TwoFactorRequirementChange, TwoFactorSetting } from '../types/two-factor.types'

const props = defineProps<{
  setting: TwoFactorSetting
  /** Wraps the form in a titled settings section; without it the form renders bare. */
  title?: string
  description?: string
  busy?: boolean
  /** Disables every control that writes; the current setting stays shown. */
  readonly?: boolean
  error?: string
}>()
const emit = defineEmits<{ change: [TwoFactorRequirementChange] }>()

const required = ref(props.setting.required)
const days = ref<number>(props.setting.grace_days ?? GRACE_DAYS_DEFAULT)
const invalid = ref(false)

watch(
  () => props.setting,
  (s) => {
    required.value = s.required
    days.value = s.grace_days ?? GRACE_DAYS_DEFAULT
    invalid.value = false
  },
)

function submit() {
  if (props.readonly) return
  invalid.value = !validGraceDays(days.value)
  if (!invalid.value) emit('change', { required: required.value, grace_days: days.value })
}
</script>

<template>
  <component
    :is="title ? PynSettingsSection : 'div'"
    v-bind="title ? { title, description, plain: true } : {}"
  >
    <form :class="styles.form" @submit.prevent="submit">
      <label :class="styles.check"
        ><input v-model="required" type="checkbox" :disabled="busy || readonly" /> Require a second
        factor</label
      >
      <p v-if="setting.required && setting.since" :class="styles.hint">
        Required since {{ formatDate(setting.since) }}.
      </p>
      <label :class="styles.field"
        >Grace period in days
        <input
          v-model.number="days"
          :class="styles.input"
          type="number"
          min="0"
          :max="GRACE_DAYS_MAX"
          step="1"
          required
          :disabled="busy || readonly"
          :aria-invalid="invalid"
        />
      </label>
      <span :class="styles.hint">
        Accounts without a second factor keep full access for this long, then can only set one up.
        Changing it starts the clock again.
      </span>
      <p v-if="invalid" :class="styles.fieldError" role="alert">
        Enter a whole number from 0 to {{ GRACE_DAYS_MAX }}.
      </p>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <button type="submit" :class="styles.primary" :disabled="busy || readonly">Save</button>
    </form>
  </component>
</template>
