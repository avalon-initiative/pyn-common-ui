<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import PynIcon from './PynIcon.vue'
import PynMarkdown from './PynMarkdown.vue'
import styles from '../styles/PynReadme.module.scss'
import { blobPath, fileKind, parentOf } from '../state/blob.state'
import type { ReadmeDoc } from '../types/blob.types'

const props = defineProps<{
  readme: ReadmeDoc
  /** More documents shown as tabs after README, such as CONTRIBUTING; the first is the default. */
  others?: ReadmeDoc[]
  owner: string
  name: string
  /** Branch the links keep; omitted is the default branch. */
  branch?: string
}>()

const uid = useId()
const index = ref(0)
const tabEls = ref<HTMLElement[]>([])
const docs = computed(() => [props.readme, ...(props.others ?? [])])
const doc = computed(() => docs.value[index.value] ?? props.readme)
const label = (d: ReadmeDoc, i: number) => (i === 0 ? 'README' : d.name.replace(/\.[^.]+$/, ''))

watch(
  () => [props.readme.path, props.others?.length],
  () => (index.value = 0),
)

async function onKey(e: KeyboardEvent) {
  const last = docs.value.length - 1
  const moves: Record<string, number> = {
    ArrowRight: index.value === last ? 0 : index.value + 1,
    ArrowLeft: index.value === 0 ? last : index.value - 1,
    Home: 0,
    End: last,
  }
  const to = moves[e.key]
  if (to === undefined) return
  e.preventDefault()
  index.value = to
  await nextTick()
  tabEls.value[to]?.focus()
}
</script>

<template>
  <section :class="styles.readme" aria-label="README">
    <header :class="styles.header">
      <div :class="styles.tabs" role="tablist" aria-label="Documents" @keydown="onKey">
        <button
          v-for="(d, i) in docs"
          :id="`${uid}-tab-${i}`"
          :key="d.path"
          :ref="(el) => (tabEls[i] = el as HTMLElement)"
          type="button"
          role="tab"
          :class="styles.tab"
          :aria-selected="index === i"
          :aria-controls="`${uid}-panel`"
          :tabindex="index === i ? 0 : -1"
          @click="index = i"
        >
          <PynIcon name="book" :class="styles.icon" />{{ label(d, i) }}
        </button>
      </div>
      <a
        :href="blobPath({ owner, name }, doc.path, branch)"
        :class="styles.title"
        :title="`Open ${doc.name}`"
        ><PynIcon name="file" :class="styles.icon" /><span :class="styles.file">{{
          doc.name
        }}</span></a
      >
    </header>
    <div
      :id="`${uid}-panel`"
      :class="styles.body"
      role="tabpanel"
      :aria-labelledby="`${uid}-tab-${index}`"
    >
      <PynMarkdown
        v-if="fileKind(doc.path) === 'markdown'"
        :source="doc.text"
        :owner="owner"
        :name="name"
        :dir="parentOf(doc.path)"
        :branch="branch"
      />
      <pre v-else :class="styles.plain">{{ doc.text }}</pre>
    </div>
  </section>
</template>
