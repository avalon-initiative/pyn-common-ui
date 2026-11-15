<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import styles from '../styles/PynProfileForm.module.scss'
import {
  PROFILE_LIMITS,
  avatarProblem,
  cleanProfile,
  profileProblem,
} from '../state/account-settings.state'
import type { ProfileValues } from '../types/account.types'

const props = defineProps<{
  profile: ProfileValues
  /** The user name, for the initial shown when there is no avatar. */
  user?: string
  avatarUrl?: string | null
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
const tried = ref(false)
const localAvatarError = ref('')

watch(
  () => props.profile,
  (p) => {
    form.value = fields(p)
    tried.value = false
  },
)

const value = computed(() => cleanProfile(form.value))
const problem = computed(() => profileProblem(value.value))
const initial = computed(() => (props.user || props.profile.display_name || '?')[0].toUpperCase())

function save() {
  tried.value = true
  if (problem.value || props.busy) return
  emit('save', value.value)
}

function pick(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  localAvatarError.value = avatarProblem(file)
  if (!localAvatarError.value) emit('avatar', file)
}
</script>

<template>
  <section :class="styles.page">
    <div :class="styles.avatarRow">
      <img v-if="avatarUrl" :src="avatarUrl" alt="Your avatar" :class="styles.avatar" />
      <span v-else :class="styles.avatar" aria-hidden="true">{{ initial }}</span>
      <div :class="styles.avatarActions">
        <label :class="styles.upload"
          >{{ avatarBusy ? 'Uploading…' : 'Change avatar' }}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            :class="styles.file"
            :disabled="avatarBusy"
            @change="pick"
          />
        </label>
        <button
          v-if="avatarUrl"
          type="button"
          :class="styles.remove"
          :disabled="avatarBusy"
          @click="emit('removeAvatar')"
        >
          Remove avatar
        </button>
        <p :class="styles.note">PNG, JPEG or WebP, at most 1 MiB.</p>
      </div>
    </div>
    <p v-if="localAvatarError || avatarError" :class="styles.error" role="alert">
      {{ localAvatarError || avatarError }}
    </p>

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
      <p v-if="tried && problem" :class="styles.error" role="alert">{{ problem }}</p>
      <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <p v-if="success" :class="styles.success" role="status">{{ success }}</p>
      <button type="submit" :class="styles.button" :disabled="busy">
        {{ busy ? 'Saving…' : 'Save profile' }}
      </button>
    </form>
  </section>
</template>
