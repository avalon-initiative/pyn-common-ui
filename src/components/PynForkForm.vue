<script setup lang="ts">
import { ref, useId } from 'vue'
import PynTextField from './PynTextField.vue'
import styles from '../styles/PynForkForm.module.scss'
import type { ForkFormValue, RepoRef } from '../types/repo.types'

const props = withDefaults(
  defineProps<{
    /** The repository being forked. */
    source: RepoRef
    /** Where the source link goes; defaults to `/<owner>/<name>`. */
    sourceHref?: string
    owner: string
    /** Accounts the fork can be created in; a select when there is more than one. */
    owners?: string[]
    /** Initial name; defaults to the source name. */
    name?: string
    /** The name as it will be stored; shown as a "Will be created as" preview. */
    nameCanonical?: string
    /** The source's default branch, named in the copy option. */
    defaultBranch?: string
    /** Initial state of the copy option. */
    defaultBranchOnly?: boolean
    /** Character limit of the description. */
    descriptionMax?: number
    busy?: boolean
    error?: string
    /** Makes Cancel a link; otherwise it is a button. */
    cancelHref?: string
  }>(),
  { defaultBranchOnly: true },
)

const emit = defineEmits<{
  submit: [ForkFormValue]
  'update:owner': [string]
  nameInput: [name: string]
  cancel: [event: MouseEvent]
}>()

const id = useId()
const name = ref(props.name ?? props.source.name)
const description = ref('')
const branchOnly = ref(props.defaultBranchOnly)

const onNameInput = () => emit('nameInput', name.value.trim())

const submit = () => {
  if (props.busy) return
  const value: ForkFormValue = {
    owner: props.owner,
    name: name.value.trim(),
    default_branch_only: branchOnly.value,
  }
  const text = description.value.trim()
  if (text) value.description = text
  emit('submit', value)
}
</script>

<template>
  <form :class="styles.page" :aria-busy="busy || undefined" @submit.prevent="submit">
    <header :class="styles.head">
      <h1 :class="styles.title">Create a new fork</h1>
      <p :class="styles.intro">
        A fork is a copy of a repository. Forking one lets you experiment freely without changing
        the source,
        <a
          :href="
            sourceHref ?? `/${encodeURIComponent(source.owner)}/${encodeURIComponent(source.name)}`
          "
          :class="styles.link"
          data-source
          >{{ source.owner }}/{{ source.name }}</a
        >.
      </p>
      <p :class="styles.intro"><em>Required fields are marked with an asterisk (*).</em></p>
    </header>
    <div :class="styles.identity">
      <div :class="styles.cell">
        <label :class="styles.label" :for="`${id}-owner`">Owner *</label>
        <select
          v-if="owners && owners.length > 1"
          :id="`${id}-owner`"
          :class="styles.input"
          :value="owner"
          :disabled="busy"
          data-owner
          @change="emit('update:owner', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="o in owners" :key="o" :value="o">{{ o }}</option>
        </select>
        <input
          v-else
          :id="`${id}-owner`"
          :class="[styles.input, styles.mono]"
          :value="owner"
          readonly
          data-owner
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
          :disabled="busy"
          autocapitalize="none"
          autocomplete="off"
          spellcheck="false"
          :aria-describedby="nameCanonical ? `${id}-canonical` : undefined"
          data-name
          @input="onNameInput"
        />
      </div>
    </div>
    <p v-if="nameCanonical" :id="`${id}-canonical`" :class="styles.hint" data-canonical>
      Will be created as: {{ nameCanonical }}
    </p>
    <p :class="styles.hint">
      By default, a fork has the name of its source repository. Change it to tell them apart.
    </p>
    <PynTextField
      v-model="description"
      label="Description"
      optional
      :maxlength="descriptionMax ?? 350"
      :disabled="busy"
      autocomplete="off"
    />
    <label :class="styles.check">
      <input v-model="branchOnly" type="checkbox" :disabled="busy" data-branch-only />
      <span :class="styles.checkText">
        <span :class="styles.checkTitle"
          >Copy the
          <code v-if="defaultBranch" :class="styles.branch">{{ defaultBranch }}</code><template
            v-else
            >default</template
          >
          branch only</span
        >
        <span :class="styles.hint">Other branches stay in the source repository.</span>
      </span>
    </label>
    <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.submit">
      <a v-if="cancelHref" :href="cancelHref" :class="styles.cancel" @click="emit('cancel', $event)"
        >Cancel</a
      >
      <button v-else type="button" :class="styles.cancel" @click="emit('cancel', $event)">
        Cancel
      </button>
      <button type="submit" :class="styles.primary" :disabled="busy">
        {{ busy ? 'Creating fork…' : 'Create fork' }}
      </button>
    </div>
  </form>
</template>
