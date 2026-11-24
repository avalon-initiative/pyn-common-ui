<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import PynConfirmDialog from './PynConfirmDialog.vue'
import PynDialog from './PynDialog.vue'
import styles from '../styles/PynTagDialog.module.scss'
import { pickerBranch } from '../state/branch-picker.state'
import { isCommitId, tagNameProblem } from '../state/tags.state'
import type { BranchOption } from '../types/branch.types'
import type { NewTag, TagOption } from '../types/tag.types'

const props = defineProps<{
  open: boolean
  /** `create` asks for a name, a target and a message; `delete` confirms. */
  mode: 'create' | 'delete'
  /** Branches offered as the target; the select also offers a typed commit. */
  branches: BranchOption[]
  /** Existing tags, checked for a taken name. */
  tags?: TagOption[]
  /** The tag being deleted. */
  name?: string
  /** Target preselected on create: a branch name; defaults to the default branch. */
  from?: string
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{
  close: []
  create: [payload: NewTag]
  delete: [name: string]
}>()

const COMMIT = '\u0000commit'
const id = useId()
const typed = ref('')
const target = ref('')
const commit = ref('')
const message = ref('')

watch(
  () => props.open,
  (open) => {
    if (!open) return
    typed.value = ''
    target.value = props.from || pickerBranch(undefined, props.branches) || COMMIT
    commit.value = ''
    message.value = ''
  },
  { immediate: true },
)

const trimmed = computed(() => typed.value.trim())
const problem = computed(() => tagNameProblem(trimmed.value, props.tags ?? []))
const byCommit = computed(() => target.value === COMMIT)
const commitProblem = computed(() =>
  byCommit.value && commit.value.trim() && !isCommitId(commit.value)
    ? 'Enter a commit id of at least 4 hex digits.'
    : '',
)
const valid = computed(
  () =>
    !!trimmed.value &&
    !problem.value &&
    (byCommit.value ? isCommitId(commit.value) : !!target.value),
)

function submit() {
  if (!valid.value || props.busy) return
  const note = message.value.trim()
  emit('create', {
    name: trimmed.value,
    target: byCommit.value ? commit.value.trim() : target.value,
    ...(note ? { message: note } : {}),
  })
}
</script>

<template>
  <PynConfirmDialog
    v-if="mode === 'delete'"
    :open="open"
    title="Delete tag"
    confirm-label="Delete tag"
    danger
    :busy="busy"
    :error="error"
    @close="emit('close')"
    @confirm="emit('delete', name ?? '')"
  >
    <p :class="styles.text">
      Delete <strong :class="styles.mono">{{ name }}</strong>? The tag is removed; the commit it
      points at stays.
    </p>
  </PynConfirmDialog>
  <PynDialog v-else :open="open" title="New tag" size="sm" @close="emit('close')">
    <form :id="`${id}-form`" :class="styles.form" @submit.prevent="submit">
      <label :class="styles.field" :for="`${id}-name`"><span>Tag name</span></label>
      <input
        :id="`${id}-name`"
        v-model="typed"
        :class="styles.input"
        type="text"
        autocomplete="off"
        spellcheck="false"
        placeholder="v1.0.0"
        required
        :aria-invalid="!!problem || undefined"
        :aria-describedby="problem ? `${id}-problem` : undefined"
      />
      <p v-if="problem" :id="`${id}-problem`" :class="styles.problem">{{ problem }}</p>
      <label :class="styles.field" :for="`${id}-target`"><span>Target</span></label>
      <select :id="`${id}-target`" v-model="target" :class="styles.input">
        <option v-for="b in branches" :key="b.name" :value="b.name">
          {{ b.name }}{{ b.isDefault ? ' (default)' : '' }}
        </option>
        <option :value="COMMIT">A commit…</option>
      </select>
      <template v-if="byCommit">
        <label :class="styles.field" :for="`${id}-commit`"><span>Commit</span></label>
        <input
          :id="`${id}-commit`"
          v-model="commit"
          :class="[styles.input, styles.mono]"
          type="text"
          autocomplete="off"
          spellcheck="false"
          placeholder="Commit id"
          required
          :aria-invalid="!!commitProblem || undefined"
          :aria-describedby="commitProblem ? `${id}-commit-problem` : undefined"
        />
        <p v-if="commitProblem" :id="`${id}-commit-problem`" :class="styles.problem">
          {{ commitProblem }}
        </p>
      </template>
      <label :class="styles.field" :for="`${id}-message`">
        <span>Message <span :class="styles.optional">(optional)</span></span>
      </label>
      <textarea :id="`${id}-message`" v-model="message" :class="styles.input" rows="3" />
      <p v-if="error" :class="styles.problem" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <button type="button" :class="styles.cancel" :disabled="busy" @click="emit('close')">
        Cancel
      </button>
      <button type="submit" :form="`${id}-form`" :class="styles.confirm" :disabled="busy || !valid">
        Create tag
      </button>
    </template>
  </PynDialog>
</template>
