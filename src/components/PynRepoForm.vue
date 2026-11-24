<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import PynSettingsRow from './PynSettingsRow.vue'
import styles from '../styles/PynRepoForm.module.scss'
import { MAX_LOCKS_MAX, MAX_LOCKS_MIN, parseLockLimit } from '../state/repo.state'
import type { RepoFormValue, RepoSettings, Visibility } from '../types/repo.types'

const props = defineProps<{
  owner: string
  /** Offers an owner picker when there is a choice (yourself or organizations you own). */
  owners?: string[]
  /** Present when editing an existing repository. */
  repo?: RepoFormValue
  /** Effective lock limit, shown while the policy file sets it or the setting is empty. */
  effectiveMaxLocks?: number
  busy?: boolean
  /** Disables every control that writes; the current values stay shown. */
  readonly?: boolean
  error?: string
  /** Shows a secondary action next to the submit button: a link with `cancelHref`, else a button. */
  cancelHref?: string
  /** Defaults to "Cancel" when `cancelHref` is set. */
  cancelLabel?: string
  /** Creation layout: a title and intro, then numbered General and Configuration steps with option rows. */
  steps?: boolean
  /** Heading of the steps layout. */
  title?: string
  /** Text under the heading in the steps layout; the `intro` slot replaces it. */
  intro?: string
  /** A name offered under the name field; choosing it fills the field. */
  suggestion?: string
  /** Shows a description field (steps layout) whose value is sent as `description`. */
  describable?: boolean
  /** Character limit of the description. */
  descriptionMax?: number
}>()

const emit = defineEmits<{
  submit: [RepoSettings]
  'update:owner': [string]
  cancel: [event: MouseEvent]
}>()

const id = useId()
const name = ref(props.repo?.name ?? '')
const description = ref('')
const limit = computed(() => props.descriptionMax ?? 350)
const visibility = ref<Visibility>(props.repo?.visibility ?? 'private')
const leaseHours = ref(props.repo?.lease_hours ?? 8)

const byPolicy = props.repo?.max_locks_set_by_policy ?? false
const maxLocks = ref<string | number>(
  byPolicy ? (props.effectiveMaxLocks ?? '') : (props.repo?.max_locks_per_user_setting ?? ''),
)

// Empty clears the setting when editing and takes the server default when creating.
const submit = () => {
  if (props.readonly) return
  const settings: RepoSettings = {
    name: name.value.trim(),
    visibility: visibility.value,
    lease_hours: Number(leaseHours.value),
  }
  const max = parseLockLimit(maxLocks.value) ?? (props.repo ? null : undefined)
  if (!byPolicy && max !== undefined) settings.max_locks_per_user = max
  if (props.steps && props.describable) settings.description = description.value.trim()
  emit('submit', settings)
}
</script>

<template>
  <form v-if="steps" :class="styles.page" @submit.prevent="submit">
    <header :class="styles.head">
      <h1 :class="styles.title">{{ title ?? 'Create a new repository' }}</h1>
      <div :class="styles.intro">
        <slot name="intro">{{ intro }}</slot>
        <p :class="styles.required"><em>Required fields are marked with an asterisk (*).</em></p>
      </div>
    </header>
    <ol :class="styles.steps">
      <li :class="styles.step" :aria-labelledby="`${id}-general`">
        <span :class="styles.num" aria-hidden="true">1</span>
        <h2 :id="`${id}-general`" :class="styles.stepTitle">General</h2>
        <div :class="styles.identity">
          <div :class="styles.cell">
            <label :class="styles.label" :for="`${id}-owner`">Owner *</label>
            <select
              v-if="owners && owners.length > 1"
              :id="`${id}-owner`"
              :class="styles.input"
              :value="owner"
              :disabled="readonly"
              @change="emit('update:owner', ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="o in owners" :key="o" :value="o">{{ o }}</option>
            </select>
            <input
              v-else
              :id="`${id}-owner`"
              :class="[styles.input, styles.ownerFixed]"
              :value="owner"
              readonly
            />
          </div>
          <span :class="styles.slash" aria-hidden="true">/</span>
          <div :class="[styles.cell, styles.grow]">
            <label :class="styles.label" :for="`${id}-name`">Repository name *</label>
            <input
              :id="`${id}-name`"
              v-model="name"
              :class="styles.input"
              required
              maxlength="100"
              :disabled="readonly"
              autocapitalize="none"
              autocomplete="off"
              spellcheck="false"
            />
          </div>
        </div>
        <p v-if="suggestion" :class="styles.suggestion">
          Great repository names are short and memorable. How about
          <button type="button" :class="styles.suggest" @click="name = suggestion">
            {{ suggestion }}</button>?
        </p>
        <div v-if="describable" :class="styles.cell">
          <label :class="styles.label" :for="`${id}-description`">Description</label>
          <input
            :id="`${id}-description`"
            v-model="description"
            :class="styles.input"
            :maxlength="limit"
            :disabled="readonly"
            autocomplete="off"
          />
          <span :class="styles.counter" aria-live="polite"
            >{{ description.length }} / {{ limit }} characters</span
          >
        </div>
      </li>
      <li :class="styles.step" :aria-labelledby="`${id}-configuration`">
        <span :class="styles.num" aria-hidden="true">2</span>
        <h2 :id="`${id}-configuration`" :class="styles.stepTitle">Configuration</h2>
        <div :class="styles.options">
          <PynSettingsRow
            title="Choose visibility *"
            help="Choose who can see this repository."
            :label-for="`${id}-visibility`"
          >
            <select
              :id="`${id}-visibility`"
              v-model="visibility"
              :class="styles.input"
              :disabled="readonly"
            >
              <option value="private">private</option>
              <option value="public">public</option>
            </select>
          </PynSettingsRow>
          <PynSettingsRow
            title="Lease length (hours) *"
            help="How long a lock is held before it expires."
            :label-for="`${id}-lease`"
          >
            <input
              :id="`${id}-lease`"
              v-model="leaseHours"
              :class="[styles.input, styles.number]"
              type="number"
              min="1"
              max="720"
              required
              :disabled="readonly"
            />
          </PynSettingsRow>
          <PynSettingsRow
            title="Lock limit per user"
            :help="
              byPolicy
                ? 'Set by .pyn/pyn.toml; edit the policy file to change it.'
                : 'Active locks one user may hold at once. Leave empty for the server default.'
            "
            :label-for="`${id}-max-locks`"
          >
            <input
              :id="`${id}-max-locks`"
              v-model="maxLocks"
              :class="[styles.input, styles.number]"
              type="number"
              :min="MAX_LOCKS_MIN"
              :max="MAX_LOCKS_MAX"
              step="1"
              :readonly="byPolicy"
              :disabled="readonly"
              :placeholder="
                effectiveMaxLocks ? `Server default (${effectiveMaxLocks})` : 'Server default'
              "
            />
          </PynSettingsRow>
          <slot name="options" />
        </div>
      </li>
    </ol>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.submit">
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
      <button type="submit" :class="styles.primary" :disabled="busy || readonly">
        Create repository
      </button>
    </div>
  </form>
  <form v-else :class="styles.form" @submit.prevent="submit">
    <label v-if="owners && owners.length > 1" :class="styles.field"
      >Owner
      <select
        :class="styles.input"
        :value="owner"
        :disabled="readonly"
        @change="emit('update:owner', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="o in owners" :key="o" :value="o">{{ o }}</option>
      </select>
    </label>
    <label :class="styles.field"
      >Name
      <span :class="styles.name">
        <span :class="styles.owner">{{ owner }}/</span>
        <input
          v-model="name"
          :class="styles.input"
          placeholder="game"
          required
          maxlength="100"
          :disabled="readonly"
          autocapitalize="none"
        />
      </span>
    </label>
    <label :class="styles.field"
      >Visibility
      <select v-model="visibility" :class="styles.input" :disabled="readonly">
        <option value="private">private</option>
        <option value="public">public</option>
      </select>
    </label>
    <label :class="styles.field"
      >Lease length (hours)
      <input
        v-model="leaseHours"
        :class="styles.input"
        type="number"
        min="1"
        max="720"
        required
        :disabled="readonly"
      />
    </label>
    <label :class="styles.field"
      >Lock limit per user
      <input
        v-model="maxLocks"
        :class="styles.input"
        type="number"
        :min="MAX_LOCKS_MIN"
        :max="MAX_LOCKS_MAX"
        step="1"
        :readonly="byPolicy"
        :disabled="readonly"
        :placeholder="
          effectiveMaxLocks ? `Server default (${effectiveMaxLocks})` : 'Server default'
        "
        aria-describedby="max-locks-hint"
      />
      <span id="max-locks-hint" :class="styles.hint">
        <template v-if="byPolicy"
          >Set by .pyn/pyn.toml; edit the policy file to change it.</template
        >
        <template v-else
          >Active locks one user may hold at once. Leave empty for the server default.</template
        >
      </span>
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button type="submit" :class="styles.primary" :disabled="busy || readonly">
        {{ repo ? 'Save changes' : 'Create repository' }}
      </button>
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
