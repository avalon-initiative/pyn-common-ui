<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import styles from '../styles/PynProfileForm.module.scss'
import {
  PROFILE_LIMITS,
  VISIBILITY_FIELDS,
  cleanProfile,
  fullVisibility,
  profileProblem,
} from '../state/account-settings.state'
import PynAvatarUpload from './PynAvatarUpload.vue'
import PynSettingsSection from './PynSettingsSection.vue'
import PynSettingsToggle from './PynSettingsToggle.vue'
import type { ProfileValues, ProfileVisibility } from '../types/account.types'

const props = defineProps<{
  profile: ProfileValues
  /** The user name, for the initial shown when there is no avatar. */
  user?: string
  avatarUrl?: string | null
  /** Per-field visibility; the Visibility section shows only when given, and the save payload then carries all flags. */
  visibility?: ProfileVisibility
  busy?: boolean
  avatarBusy?: boolean
  error?: string
  avatarError?: string
  success?: string
}>()
const emit = defineEmits<{ save: [ProfileValues]; avatar: [File]; removeAvatar: [] }>()

const L = PROFILE_LIMITS
const fields = (p: ProfileValues) => ({
  display_name: p.display_name ?? '',
  bio: p.bio ?? '',
  location: p.location ?? '',
  company: p.company ?? '',
  links: (p.links ?? []).join('\n'),
})
const form = ref(fields(props.profile))
const flags = ref(fullVisibility(props.visibility ?? {}))
const tried = ref(false)

watch(
  () => props.visibility,
  (v) => {
    flags.value = fullVisibility(v ?? {})
  },
)

watch(
  () => props.profile,
  (p) => {
    form.value = fields(p)
    tried.value = false
  },
)

const value = computed(() => cleanProfile(form.value))
const problem = computed(() => profileProblem(value.value))

function save() {
  tried.value = true
  if (problem.value || props.busy) return
  emit('save', props.visibility ? { ...value.value, visibility: { ...flags.value } } : value.value)
}
</script>

<template>
  <section :class="styles.page">
    <PynAvatarUpload
      :name="user || profile.display_name || ''"
      :src="avatarUrl"
      alt="Your avatar"
      :busy="avatarBusy"
      :error="avatarError"
      @upload="emit('avatar', $event)"
      @remove="emit('removeAvatar')"
    />

    <form :class="styles.form" novalidate @submit.prevent="save">
      <label :class="styles.field"
        >Display name
        <input
          v-model="form.display_name"
          :class="styles.input"
          :maxlength="L.name"
          :disabled="busy"
        />
      </label>
      <label :class="styles.field"
        >Bio
        <textarea
          v-model="form.bio"
          :class="styles.input"
          rows="3"
          :maxlength="L.bio"
          :disabled="busy"
        />
        <span :class="styles.count">{{ form.bio.length }} / {{ L.bio }}</span>
      </label>
      <label :class="styles.field"
        >Location
        <input
          v-model="form.location"
          :class="styles.input"
          :maxlength="L.location"
          :disabled="busy"
        />
      </label>
      <label :class="styles.field"
        >Company
        <input
          v-model="form.company"
          :class="styles.input"
          :maxlength="L.company"
          :disabled="busy"
        />
      </label>
      <label :class="styles.field"
        >Links
        <textarea
          v-model="form.links"
          :class="styles.input"
          rows="3"
          placeholder="https://example.com"
          :disabled="busy"
        />
        <span :class="styles.count">One address per line, up to {{ L.links }}.</span>
      </label>
      <PynSettingsSection
        v-if="visibility"
        title="Visibility"
        description="Choose what others see on your profile."
      >
        <PynSettingsToggle
          v-for="f in VISIBILITY_FIELDS"
          :key="f.key"
          v-model="flags[f.key]"
          :title="f.title"
          :help="f.help"
          :disabled="busy"
        />
      </PynSettingsSection>
      <p v-if="tried && problem" :class="styles.error" role="alert">{{ problem }}</p>
      <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <p v-if="success" :class="styles.success" role="status">{{ success }}</p>
      <button type="submit" :class="styles.button" :disabled="busy">
        {{ busy ? 'Saving…' : 'Save profile' }}
      </button>
    </form>
  </section>
</template>
