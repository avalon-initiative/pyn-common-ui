<script setup lang="ts">
import styles from '../styles/PynShortcutsHelp.module.scss'
import PynDialog from './PynDialog.vue'
import type { ShortcutGroup } from '../types/command-palette.types'

defineProps<{
  open: boolean
  groups: ShortcutGroup[]
  /** The dialog's accessible name and visible heading. */
  label: string
}>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <PynDialog :open="open" :title="label" size="lg" @close="emit('close')">
    <div :class="styles.body">
      <section v-for="g in groups" :key="g.title" :class="styles.group">
        <h3 :class="styles.groupTitle">{{ g.title }}</h3>
        <dl :class="styles.list">
          <div v-for="s in g.shortcuts" :key="s.label" :class="styles.row">
            <dt :class="styles.name">{{ s.label }}</dt>
            <dd :class="styles.keys">
              <template v-for="(k, i) in s.keys" :key="i">
                <span v-if="i > 0" :class="styles.then" aria-hidden="true">then</span>
                <kbd :class="styles.kbd">{{ k }}</kbd>
              </template>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  </PynDialog>
</template>
