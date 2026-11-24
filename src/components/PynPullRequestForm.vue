<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PynBranchPicker from './PynBranchPicker.vue'
import PynIcon from './PynIcon.vue'
import PynTextArea from './PynTextArea.vue'
import PynTextField from './PynTextField.vue'
import styles from '../styles/PynPullRequestForm.module.scss'
import { pickerBranch } from '../state/branch-picker.state'
import type { BranchOption } from '../types/branch.types'
import type { NewPullRequest } from '../types/pull-request.types'

const props = withDefaults(
  defineProps<{
    branches: BranchOption[]
    branchesLoading?: boolean
    branchesError?: string
    busy?: boolean
    error?: string
    /** Heading above the form; empty hides it. */
    heading?: string
    description?: string
    titleMax?: number
    /** Adds a Cancel link; without it, `cancelLabel` adds a button that emits `cancel`. */
    cancelHref?: string
    cancelLabel?: string
  }>(),
  {
    heading: 'Open a pull request',
    description: 'Compare two branches and describe the change for review.',
    titleMax: 256,
  },
)
/** Target branch; empty takes the default branch. */
const base = defineModel<string>('base', { default: '' })
/** Source branch. */
const head = defineModel<string>('head', { default: '' })
const title = defineModel<string>('title', { default: '' })
const body = defineModel<string>('body', { default: '' })
const draft = defineModel<boolean>('draft', { default: false })
const emit = defineEmits<{ submit: [pull: NewPullRequest]; cancel: [] }>()

watch(
  () => props.branches,
  (list) => {
    if (!base.value && list.length) base.value = pickerBranch(undefined, list)
  },
  { immediate: true },
)

const tried = ref(false)
const same = computed(() => !!base.value && base.value === head.value)
const branchProblem = computed(() => {
  if (same.value) return 'Choose two different branches.'
  if (tried.value && !head.value) return 'Choose the branch to merge.'
  return ''
})
const titleProblem = computed(() => (tried.value && !title.value.trim() ? 'Enter a title.' : ''))
const valid = computed(() => !!base.value && !!head.value && !same.value && !!title.value.trim())

function submit() {
  tried.value = true
  if (!valid.value || props.busy) return
  emit('submit', {
    title: title.value.trim(),
    body: body.value,
    draft: draft.value,
    base: base.value,
    head: head.value,
  })
}
</script>

<template>
  <form :class="styles.form" data-pull-form novalidate @submit.prevent="submit">
    <header v-if="heading" :class="styles.header">
      <h1 :class="styles.heading">{{ heading }}</h1>
      <p v-if="description" :class="styles.intro">{{ description }}</p>
    </header>
    <div :class="styles.branches" role="group" aria-label="Branches">
      <PynIcon name="merge" :class="styles.mark" />
      <PynBranchPicker
        :branches="branches"
        :current="base"
        prefix="base:"
        :loading="branchesLoading"
        :error="branchesError"
        data-base-picker
        @select="(name) => (base = name)"
      />
      <PynIcon name="arrow-left" :class="styles.mark" />
      <PynBranchPicker
        :branches="branches"
        :current="head || 'choose a branch'"
        prefix="compare:"
        :loading="branchesLoading"
        :error="branchesError"
        data-head-picker
        @select="(name) => (head = name)"
      />
    </div>
    <p v-if="branchProblem" :class="styles.problem" role="alert" data-branch-problem>
      {{ branchProblem }}
    </p>
    <div v-if="$slots.compare" :class="styles.compare"><slot name="compare" /></div>
    <div :class="styles.box">
      <PynTextField
        v-model="title"
        label="Title"
        required
        :maxlength="titleMax"
        :counter="false"
        :error="titleProblem"
        :disabled="busy"
      />
      <PynTextArea
        v-model="body"
        label="Description"
        placeholder="Add a description"
        help="Markdown is supported."
        :rows="8"
        :disabled="busy"
        @submit="submit"
      />
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <div :class="styles.actions">
        <label :class="styles.draft">
          <input v-model="draft" type="checkbox" :disabled="busy" data-draft />
          Create as draft
        </label>
        <a v-if="cancelHref" :href="cancelHref" :class="styles.cancel">{{
          cancelLabel ?? 'Cancel'
        }}</a>
        <button
          v-else-if="cancelLabel"
          type="button"
          :class="styles.cancel"
          :disabled="busy"
          @click="emit('cancel')"
        >
          {{ cancelLabel }}
        </button>
        <button type="submit" :class="styles.submit" :disabled="busy" data-submit>
          {{ busy ? 'Creating…' : draft ? 'Create draft pull request' : 'Create pull request' }}
        </button>
      </div>
    </div>
  </form>
</template>
