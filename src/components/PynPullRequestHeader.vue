<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import PynDiffStat from './PynDiffStat.vue'
import PynIcon from './PynIcon.vue'
import PynPerson from './PynPerson.vue'
import PynPullStateChip from './PynPullStateChip.vue'
import styles from '../styles/PynPullRequestHeader.module.scss'
import { pullWhen } from '../state/pull-request.state'
import { copyText } from '../utils/copy'
import { formatAgo } from '../utils/ago'
import type { PullRequestSummary } from '../types/pull-request.types'

const props = defineProps<{
  pull: PullRequestSummary
  now?: Date
  /** Shows the edit button beside the title; it emits `editTitle`. */
  editable?: boolean
}>()
const emit = defineEmits<{ editTitle: [] }>()

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
    <h1 :class="styles.title">
      {{ pull.title }}
      <button
        v-if="editable"
        type="button"
        :class="styles.edit"
        aria-label="Edit title"
        title="Edit title"
        @click="emit('editTitle')"
      >
        <PynIcon name="edit" />
      </button>
    </h1>
    <div :class="styles.meta">
      <PynPullStateChip :state="pull.state" />
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
