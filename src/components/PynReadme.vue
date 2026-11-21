<script setup lang="ts">
import PynIcon from './PynIcon.vue'
import PynMarkdown from './PynMarkdown.vue'
import styles from '../styles/PynReadme.module.scss'
import { blobPath, fileKind, parentOf } from '../state/blob.state'
import type { ReadmeDoc } from '../types/blob.types'

defineProps<{
  readme: ReadmeDoc
  owner: string
  name: string
  /** Branch the links keep; omitted is the default branch. */
  branch?: string
}>()
</script>

<template>
  <section :class="styles.readme" aria-label="README">
    <header :class="styles.header">
      <PynIcon name="file" :class="styles.icon" />
      <a :href="blobPath({ owner, name }, readme.path, branch)" :class="styles.title">{{
        readme.name
      }}</a>
    </header>
    <div :class="styles.body">
      <PynMarkdown
        v-if="fileKind(readme.path) === 'markdown'"
        :source="readme.text"
        :owner="owner"
        :name="name"
        :dir="parentOf(readme.path)"
        :branch="branch"
      />
      <pre v-else :class="styles.plain">{{ readme.text }}</pre>
    </div>
  </section>
</template>
