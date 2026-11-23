<script setup lang="ts">
import styles from '../styles/PynRecentItems.module.scss'
import type { RecentItem } from '../types/dashboard.types'

defineProps<{ items: RecentItem[]; clearable?: boolean }>()
const emit = defineEmits<{ clear: [] }>()
</script>

<template>
  <div :class="styles.recent">
    <p :class="styles.note">
      Kept in this browser<template v-if="clearable">
        ·
        <button type="button" :class="styles.clear" @click="emit('clear')">Clear</button></template
      >
    </p>
    <ul v-if="items.length" :class="styles.list">
      <li v-for="item in items" :key="item.href" :class="styles.item" data-recent>
        <a :href="item.href" :class="styles.link">{{ item.label }}</a>
        <span :class="styles.kind">{{ item.kind }}</span>
      </li>
    </ul>
    <p v-else :class="styles.empty">Nothing opened yet.</p>
  </div>
</template>
