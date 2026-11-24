<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import PynConfirmDialog from './PynConfirmDialog.vue'
import PynDialog from './PynDialog.vue'
import styles from '../styles/PynBranchDialog.module.scss'
import { pickerBranch } from '../state/branch-picker.state'
import type { BranchOption } from '../types/branch.types'

const props = defineProps<{
  open: boolean
  /** `create` asks for a name and a start point, `rename` for a new name, `delete` confirms. */
  mode: 'create' | 'rename' | 'delete'
  /** Branches offered by the start-from select and checked for a taken name. */
  branches: BranchOption[]
  /** The branch being renamed or deleted. */
  name?: string
  /** Start-from preselected on create; defaults to the default branch. */
  from?: string
  /** Deleting needs a force step: the branch has revisions no other branch holds. */
  unmerged?: boolean
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{
  close: []
  create: [payload: { name: string; from: string }]
  rename: [name: string, newName: string]
  delete: [payload: { name: string; force: boolean }]
}>()

const id = useId()
const typed = ref('')
const start = ref('')
const force = ref(false)

watch(
  () => props.open,
  (open) => {
    if (!open) return
    typed.value = props.mode === 'rename' ? (props.name ?? '') : ''
    start.value = props.from ?? pickerBranch(undefined, props.branches)
    force.value = false
  },
  { immediate: true },
)

const trimmed = computed(() => typed.value.trim())
const taken = computed(
  () =>
    !!trimmed.value &&
    trimmed.value !== props.name &&
    props.branches.some((b) => b.name === trimmed.value),
)
const problem = computed(() => (taken.value ? 'A branch with this name already exists.' : ''))
const unchanged = computed(() => props.mode === 'rename' && trimmed.value === props.name)
const valid = computed(() => !!trimmed.value && !taken.value && !unchanged.value)

function submit() {
  if (!valid.value || props.busy) return
  if (props.mode === 'create') emit('create', { name: trimmed.value, from: start.value })
  else if (props.mode === 'rename') emit('rename', props.name ?? '', trimmed.value)
}
</script>

<template>
  <PynConfirmDialog
    v-if="mode === 'delete'"
    :open="open"
    title="Delete branch"
    confirm-label="Delete branch"
    danger
    :confirm-disabled="unmerged && !force"
    :busy="busy"
    :error="error"
    @close="emit('close')"
    @confirm="emit('delete', { name: name ?? '', force: !!unmerged })"
  >
    <p :class="styles.text">
      Delete <strong :class="styles.mono">{{ name }}</strong>? The branch is removed; revisions
      other branches hold stay.
    </p>
    <template v-if="unmerged">
      <p :class="styles.warning" role="alert">
        This branch has revisions no other branch holds. Deleting it discards them.
      </p>
      <label :class="styles.check">
        <input v-model="force" type="checkbox" />
        <span>Delete it anyway</span>
      </label>
    </template>
  </PynConfirmDialog>
  <PynDialog
    v-else
    :open="open"
    :title="mode === 'create' ? 'New branch' : 'Rename branch'"
    size="sm"
    @close="emit('close')"
  >
    <form :id="`${id}-form`" :class="styles.form" @submit.prevent="submit">
      <label :class="styles.field" :for="`${id}-name`">
        <span>{{ mode === 'create' ? 'Branch name' : 'New name' }}</span>
      </label>
      <input
        :id="`${id}-name`"
        v-model="typed"
        :class="styles.input"
        type="text"
        autocomplete="off"
        spellcheck="false"
        required
        :aria-invalid="taken || undefined"
        :aria-describedby="problem ? `${id}-problem` : undefined"
      />
      <p v-if="problem" :id="`${id}-problem`" :class="styles.problem">{{ problem }}</p>
      <template v-if="mode === 'create'">
        <label :class="styles.field" :for="`${id}-from`">
          <span>Start from</span>
        </label>
        <select :id="`${id}-from`" v-model="start" :class="styles.input">
          <option v-for="b in branches" :key="b.name" :value="b.name">
            {{ b.name }}{{ b.isDefault ? ' (default)' : '' }}
          </option>
        </select>
      </template>
      <p v-if="error" :class="styles.problem" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <button type="button" :class="styles.cancel" :disabled="busy" @click="emit('close')">
        Cancel
      </button>
      <button type="submit" :form="`${id}-form`" :class="styles.confirm" :disabled="busy || !valid">
        {{ mode === 'create' ? 'Create branch' : 'Rename branch' }}
      </button>
    </template>
  </PynDialog>
</template>
