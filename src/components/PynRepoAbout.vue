<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynRepoAbout.module.scss'
import { languageShares } from '../utils/languages'
import type { LanguageBytes } from '../types/repo.types'

const props = defineProps<{
  description?: string | null
  website?: string | null
  /** Omitted shows a not-supported placeholder; an empty list shows nothing. */
  topics?: string[]
  /** Counts shown as stars, watching and forks; each is hidden unless given. */
  stars?: number
  watching?: number
  forks?: number
  /** Bytes per language; shown as a bar and a list of shares, hidden when omitted or empty. */
  languages?: LanguageBytes[]
}>()

const shares = computed(() => languageShares(props.languages ?? []))

const counts = computed(() =>
  [
    { icon: 'star', n: props.stars, unit: (n: number) => (n === 1 ? 'star' : 'stars') },
    { icon: 'eye', n: props.watching, unit: () => 'watching' },
    { icon: 'fork', n: props.forks, unit: (n: number) => (n === 1 ? 'fork' : 'forks') },
  ].filter((c): c is typeof c & { n: number } => c.n !== undefined),
)
</script>

<template>
  <section :class="styles.about" aria-label="About">
    <h2 :class="styles.title">About</h2>
    <p v-if="description?.trim()" :class="styles.description">{{ description }}</p>
    <p v-else :class="styles.none">No description provided</p>
    <a v-if="website?.trim()" :href="website" :class="styles.website" rel="noopener">{{
      website
    }}</a>
    <ul v-if="topics?.length" :class="styles.topics" aria-label="Topics">
      <li v-for="t in topics" :key="t" :class="styles.topic">{{ t }}</li>
    </ul>
    <p v-else-if="!topics" :class="styles.none" data-topics-unsupported>
      <PynIcon name="info" />Topics: not supported yet
    </p>
    <ul v-if="counts.length" :class="styles.counts" aria-label="Repository activity">
      <li v-for="c in counts" :key="c.icon" :class="styles.count">
        <PynIcon :name="c.icon" /><strong>{{ c.n }}</strong> {{ c.unit(c.n) }}
      </li>
    </ul>
    <div v-if="shares.length" :class="styles.languages" data-languages>
      <h3 :class="styles.subtitle">Languages</h3>
      <div :class="styles.bar" aria-hidden="true">
        <span
          v-for="l in shares"
          :key="l.name"
          :class="styles.segment"
          :style="{ flexGrow: l.bytes, backgroundColor: l.color }"
        />
      </div>
      <ul :class="styles.languageList" aria-label="Languages">
        <li v-for="l in shares" :key="l.name" :class="styles.language" data-language>
          <span :class="styles.dot" :style="{ backgroundColor: l.color }" aria-hidden="true" />
          <strong>{{ l.name }}</strong>
          <span :class="styles.percent">{{ l.percent < 0.1 ? '<0.1' : l.percent }}%</span>
        </li>
      </ul>
    </div>
  </section>
</template>
