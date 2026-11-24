<script setup lang="ts">
import { useId } from 'vue'
import styles from '../styles/PynSettingsRow.module.scss'

defineProps<{
  title: string
  help?: string
  disabled?: boolean
}>()
const model = defineModel<boolean>({ default: false })

const id = useId()
</script>

<template>
  <div :class="styles.row">
    <div :class="styles.text">
      <label :for="id" :class="styles.title">{{ title }}</label>
      <span v-if="help" :class="styles.help">{{ help }}</span>
    </div>
    <div :class="styles.control">
      <input
        :id="id"
        v-model="model"
        type="checkbox"
        role="switch"
        :class="styles.switch"
        :disabled="disabled"
      />
    </div>
  </div>
</template>
