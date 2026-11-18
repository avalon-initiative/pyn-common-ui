<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import styles from '../styles/PynAccessMode.module.scss'
import { ACCESS_EFFECTS, ACCESS_LABELS, otherMode } from '../state/access.state'
import type { AccessCheckItem, AccessCheckStatus, AccessMode } from '../types/access.types'

const props = defineProps<{
  mode: AccessMode
  checklist?: AccessCheckItem[]
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ change: [mode: AccessMode] }>()

const statusText: Record<AccessCheckStatus, string> = {
  ok: 'Done',
  todo: 'To do',
  unknown: 'Not checked',
}

const target = computed(() => otherMode(props.mode))
const typed = ref('')
const confirming = ref(false)
const matches = computed(() => typed.value.trim().toLowerCase() === target.value)
const hintId = useId()

function cancel() {
  confirming.value = false
  typed.value = ''
}

function submit() {
  if (!confirming.value) confirming.value = true
  else if (matches.value && !props.busy) {
    emit('change', target.value)
    cancel()
  }
}
</script>

<template>
  <section :class="styles.panel">
    <h2 :class="styles.title">
      Server access: <span :class="styles.mode">{{ ACCESS_LABELS[mode] }}</span>
    </h2>

    <div :class="styles.warning" role="note">
      <p :class="styles.lead">Switching to {{ target }} means:</p>
      <ul :class="styles.effects">
        <li v-for="line in ACCESS_EFFECTS[target]" :key="line">{{ line }}</li>
      </ul>
    </div>

    <template v-if="target === 'public' && checklist?.length">
      <h3 :class="styles.heading">Before going public</h3>
      <ul :class="styles.checklist">
        <li v-for="item in checklist" :key="item.id" :class="styles.item">
          <span :class="[styles.status, styles[item.status]]">{{ statusText[item.status] }}</span>
          <span>
            <a v-if="item.href" :href="item.href">{{ item.label }}</a>
            <template v-else>{{ item.label }}</template>
            <span v-if="item.detail" :class="styles.detail">{{ item.detail }}</span>
          </span>
        </li>
      </ul>
    </template>

    <form :class="styles.form" @submit.prevent="submit">
      <template v-if="confirming">
        <label :class="styles.label" :for="hintId">
          Type <code>{{ target }}</code> to confirm
        </label>
        <input
          :id="hintId"
          v-model="typed"
          :class="styles.input"
          autocomplete="off"
          :disabled="busy"
        />
      </template>
      <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
      <div :class="styles.actions">
        <button type="submit" :class="styles.primary" :disabled="busy || (confirming && !matches)">
          {{ confirming ? `Make the server ${target}` : `Switch to ${target}` }}
        </button>
        <button
          v-if="confirming"
          type="button"
          :class="styles.cancel"
          :disabled="busy"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>
