<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import PynConfirmDialog from './PynConfirmDialog.vue'
import styles from '../styles/PynRepoVisibility.module.scss'
import { DANGER_ZONE } from '../state/settings-section.state'
import type { Visibility } from '../types/repo.types'

const props = defineProps<{
  /** `owner/name`, named in the confirmation. */
  slug: string
  visibility: Visibility
  busy?: boolean
  /** Disables the change. */
  readonly?: boolean
  error?: string
}>()
const emit = defineEmits<{ change: [visibility: Visibility] }>()
const bare = inject(DANGER_ZONE, undefined)

const confirming = ref(false)
const next = computed<Visibility>(() => (props.visibility === 'public' ? 'private' : 'public'))

function confirm() {
  confirming.value = false
  emit('change', next.value)
}
</script>

<template>
  <div :class="styles.row" :data-bare="bare || undefined" data-visibility-change>
    <div :class="styles.text">
      <h3 :class="styles.heading">Change visibility</h3>
      <p :class="styles.note">
        This repository is currently <strong data-current>{{ visibility }}</strong>.
      </p>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    </div>
    <button
      type="button"
      :class="styles.danger"
      :disabled="busy || readonly"
      @click="confirming = true"
    >
      Change visibility
    </button>
    <PynConfirmDialog
      :open="confirming"
      :title="`Make ${slug} ${next}?`"
      :confirm-label="`Make ${next}`"
      danger
      :busy="busy"
      @close="confirming = false"
      @confirm="confirm"
    >
      <ul :class="styles.effects" data-effects>
        <template v-if="next === 'public'">
          <li>
            Everyone who can browse this server can see it, its files and its history. Pushing and
            taking locks still need a role.
          </li>
          <li>Forks made while it was private stay private.</li>
        </template>
        <template v-else>
          <li>Only its members and the teams given access can see it.</li>
          <li>Forks of a private repository stay private.</li>
        </template>
        <li>Stars and watchers are kept.</li>
      </ul>
    </PynConfirmDialog>
  </div>
</template>
