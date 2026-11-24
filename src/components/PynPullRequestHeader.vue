<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import PynDiffStat from './PynDiffStat.vue'
import PynIcon from './PynIcon.vue'
import PynPerson from './PynPerson.vue'
import PynPullStateChip from './PynPullStateChip.vue'
import PynTextField from './PynTextField.vue'
import styles from '../styles/PynPullRequestHeader.module.scss'
import { pullWhen } from '../state/pull-request.state'
import { copyText } from '../utils/copy'
import { formatAgo } from '../utils/ago'
import type { PullRequestSummary } from '../types/pull-request.types'

const props = defineProps<{
  pull: PullRequestSummary
  now?: Date
  /** Shows the edit button beside the title; it opens an inline editor and emits `editTitle`. */
  editable?: boolean
  titleSaving?: boolean
  titleError?: string
}>()
const emit = defineEmits<{ editTitle: []; saveTitle: [title: string] }>()

// The editor closes on Cancel, on an unchanged Save, or when the saved title arrives.
const editing = ref(false)
const typed = ref('')
const field = ref<InstanceType<typeof PynTextField> | null>(null)
async function startEdit() {
  typed.value = props.pull.title
  editing.value = true
  emit('editTitle')
  await nextTick()
  field.value?.focus()
}
function save() {
  const t = typed.value.trim()
  if (!t || props.titleSaving) return
  if (t === props.pull.title) editing.value = false
  else emit('saveTitle', t)
}
watch(
  () => props.pull.title,
  () => (editing.value = false),
)

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
async function copyBranch() {
  copied.value = await copyText(props.pull.head)
  clearTimeout(timer)
  if (copied.value) timer = setTimeout(() => (copied.value = false), 2000)
}
onBeforeUnmount(() => clearTimeout(timer))
const when = () => pullWhen(props.pull)
</script>

<template>
  <header :class="styles.header">
    <form
      v-if="editing"
      :class="styles.editor"
      data-title-editor
      @submit.prevent="save"
      @keydown.esc="editing = false"
    >
      <PynTextField
        ref="field"
        v-model="typed"
        :class="styles.field"
        label="Title"
        hide-label
        :maxlength="256"
        :counter="false"
        :error="titleError"
        :disabled="titleSaving"
      />
      <div :class="styles.editActions">
        <button
          type="submit"
          :class="styles.save"
          :disabled="titleSaving || !typed.trim()"
          data-save-title
        >
          {{ titleSaving ? 'Saving…' : 'Save' }}
        </button>
        <button
          type="button"
          :class="styles.cancel"
          :disabled="titleSaving"
          @click="editing = false"
        >
          Cancel
        </button>
      </div>
    </form>
    <h1 v-else :class="styles.title">
      {{ pull.title }}
      <button
        v-if="editable"
        type="button"
        :class="styles.edit"
        aria-label="Edit title"
        title="Edit title"
        @click="startEdit"
      >
        <PynIcon name="edit" />
      </button>
    </h1>
    <div :class="styles.meta">
      <PynPullStateChip :state="pull.state" :draft="pull.draft" />
      <span :class="styles.author">
        <strong><PynPerson :name="pull.author.user" :identity="pull.author" /></strong>
        {{ when().verb }} {{ formatAgo(when().at, now ?? new Date()) }}
      </span>
      <span :class="styles.branches" data-branches>
        <code :class="styles.branch" data-base>{{ pull.base }}</code>
        <PynIcon name="arrow-left" :class="styles.arrow" />
        <span :class="styles.branch"
          ><code data-head>{{ pull.head }}</code>
          <button
            type="button"
            :class="styles.copy"
            :aria-label="copied ? 'Copied' : 'Copy branch name'"
            :title="copied ? 'Copied' : 'Copy branch name'"
            @click="copyBranch"
          >
            <PynIcon :name="copied ? 'check' : 'copy'" />
          </button>
        </span>
      </span>
      <PynDiffStat :additions="pull.additions" :deletions="pull.deletions" />
    </div>
  </header>
</template>
