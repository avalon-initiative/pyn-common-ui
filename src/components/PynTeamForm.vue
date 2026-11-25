<script setup lang="ts">
import { computed, reactive, ref, useId } from 'vue'
import PynSettingsSection from './PynSettingsSection.vue'
import styles from '../styles/PynTeamForm.module.scss'
import { useReveal } from '../state/reveal.state'
import { teamSlug } from '../state/team.state'
import type { TeamFormValue } from '../types/team.types'

const props = defineProps<{
  /** Present when editing: the fields start from it and the form is always shown. */
  team?: { slug: string; name: string; description: string }
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ submit: [TeamFormValue]; cancel: [] }>()
/** Create form open; New team shows while closed. The app closes it after a success. */
const adding = defineModel<boolean>('adding', { default: false })

const id = useId()
const form = reactive({
  name: props.team?.name ?? '',
  description: props.team?.description ?? '',
})
const field = ref<HTMLInputElement | null>(null)
const button = ref<HTMLButtonElement | null>(null)
const slug = computed(() => teamSlug(form.name))
useReveal(adding, field, button, () => {
  form.name = ''
  form.description = ''
})

const wrap = computed(() => (props.team ? PynSettingsSection : 'div'))
const wrapProps = computed(() =>
  props.team
    ? {
        title: 'Edit team',
        description: 'Rename the team or change what it is about.',
        plain: true,
      }
    : {},
)

function submit() {
  emit('submit', { name: form.name.trim(), description: form.description.trim() })
}
function cancel() {
  adding.value = false
  emit('cancel')
}
</script>

<template>
  <button
    v-if="!team && !adding"
    ref="button"
    type="button"
    :class="styles.primary"
    @click="adding = true"
  >
    New team
  </button>
  <component :is="wrap" v-else v-bind="wrapProps">
    <form :class="[styles.form, team && styles.boxed]" @submit.prevent="submit">
      <h3 v-if="!team" :class="styles.subheading">Create a team</h3>
      <label :class="styles.field"
        >Team name
        <input
          ref="field"
          v-model="form.name"
          :class="styles.input"
          maxlength="100"
          required
          :aria-describedby="!team && slug ? `${id}-slug` : undefined"
        />
        <span v-if="!team && slug" :id="`${id}-slug`" :class="styles.hint" data-slug
          >Will be created as: <code>{{ slug }}</code></span
        >
      </label>
      <label :class="styles.field"
        >Description
        <textarea v-model="form.description" :class="styles.input" maxlength="500" rows="3" />
      </label>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <div :class="styles.actions">
        <button type="submit" :class="styles.primary" :disabled="busy">
          {{ team ? 'Save' : 'Create team' }}
        </button>
        <button v-if="!team" type="button" :class="styles.cancel" @click="cancel">Cancel</button>
      </div>
    </form>
  </component>
</template>
