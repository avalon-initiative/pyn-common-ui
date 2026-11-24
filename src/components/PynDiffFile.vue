<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import PynDiffStat from './PynDiffStat.vue'
import PynIcon from './PynIcon.vue'
import PynLockBadge from './PynLockBadge.vue'
import PynModeChip from './PynModeChip.vue'
import styles from '../styles/PynDiffFile.module.scss'
import { diffAnchor, markedLines, segments, splitRows } from '../state/diff.state'
import { copyText } from '../utils/copy'
import type { DiffExpand, DiffFile, DiffLayout, DiffLine } from '../types/diff.types'

const props = withDefaults(
  defineProps<{
    file: DiffFile
    layout?: DiffLayout
    viewed?: boolean
    me?: string
    now?: Date
  }>(),
  { layout: 'unified' },
)
const collapsed = defineModel<boolean>('collapsed', { default: false })
const emit = defineEmits<{ 'update:viewed': [value: boolean]; expand: [DiffExpand] }>()

const hunks = computed(() =>
  props.file.hunks.map((h) => {
    const lines = markedLines(h)
    return { hunk: h, lines, rows: splitRows({ ...h, lines }) }
  }),
)
const STATUS = { added: 'Added', modified: 'Modified', deleted: 'Deleted', renamed: 'Renamed' }
const message = computed(() => {
  if (props.file.binary) return 'Binary file not shown'
  if (props.file.tooLarge) return 'Large diff not shown'
  if (!props.file.hunks.length) return 'No content changes'
  return ''
})
const lastHidden = computed(() => props.file.hunks.at(-1)?.hiddenAfter ?? 0)

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
async function copy() {
  copied.value = await copyText(props.file.path)
  clearTimeout(timer)
  if (copied.value) timer = setTimeout(() => (copied.value = false), 2000)
}
onBeforeUnmount(() => clearTimeout(timer))

const sign = (l: DiffLine) => (l.kind === 'add' ? '+' : l.kind === 'delete' ? '−' : ' ')
const expand = (hunk: number, direction: DiffExpand['direction']) =>
  emit('expand', { path: props.file.path, hunk, direction })
</script>

<template>
  <section
    :id="diffAnchor(file.path)"
    :class="styles.file"
    :data-viewed="viewed || undefined"
    :data-collapsed="collapsed || undefined"
    :aria-label="file.path"
  >
    <header :class="styles.head">
      <button
        type="button"
        :class="styles.toggle"
        :aria-expanded="!collapsed"
        :aria-label="collapsed ? `Expand ${file.path}` : `Collapse ${file.path}`"
        @click="collapsed = !collapsed"
      >
        <PynIcon name="chevron" :class="[styles.chevron, collapsed && styles.shut]" />
      </button>
      <span :class="styles.path">
        <template v-if="file.oldPath && file.oldPath !== file.path"
          ><span :class="styles.old">{{ file.oldPath }}</span> &rarr;
        </template>
        <span data-path>{{ file.path }}</span>
      </span>
      <button
        type="button"
        :class="styles.icon"
        :aria-label="copied ? 'Copied' : 'Copy path'"
        :title="copied ? 'Copied' : 'Copy path'"
        @click="copy"
      >
        <PynIcon :name="copied ? 'check' : 'copy'" />
      </button>
      <span :class="styles.status" :data-status="file.status">{{ STATUS[file.status] }}</span>
      <span v-if="file.mode === 'exclusive'" :class="styles.lock" data-lock>
        <PynModeChip mode="exclusive" />
        <PynLockBadge :lock="file.lock" :me="me" :now="now" />
      </span>
      <span :class="styles.tools">
        <PynDiffStat :additions="file.additions" :deletions="file.deletions" />
        <label :class="styles.viewed">
          <input
            type="checkbox"
            :checked="viewed"
            @change="emit('update:viewed', ($event.target as HTMLInputElement).checked)"
          />
          Viewed
        </label>
      </span>
    </header>
    <div v-if="!collapsed">
      <p v-if="message" :class="styles.message" data-message>{{ message }}</p>
      <div v-else :class="styles.scroll">
        <table :class="styles.diff" :data-layout="layout">
          <colgroup v-if="layout === 'split'">
            <col :class="styles.numCol" />
            <col />
            <col :class="styles.numCol" />
            <col />
          </colgroup>
          <colgroup v-else>
            <col :class="styles.numCol" />
            <col :class="styles.numCol" />
            <col />
          </colgroup>
          <tbody v-for="({ hunk, lines, rows }, i) in hunks" :key="i">
            <tr :class="styles.hunk" data-hunk>
              <td :class="styles.expand" :colspan="layout === 'split' ? 1 : 2">
                <template v-if="hunk.hiddenBefore">
                  <button
                    v-if="i > 0"
                    type="button"
                    :aria-label="`Expand ${hunk.hiddenBefore} hidden lines down`"
                    data-expand="down"
                    @click="expand(i, 'down')"
                  >
                    <PynIcon name="arrow-down-line" />
                  </button>
                  <button
                    type="button"
                    :aria-label="`Expand ${hunk.hiddenBefore} hidden lines up`"
                    data-expand="up"
                    @click="expand(i, 'up')"
                  >
                    <PynIcon name="arrow-up-line" />
                  </button>
                </template>
              </td>
              <td :class="styles.header" :colspan="layout === 'split' ? 3 : 1">
                {{ hunk.header }}
              </td>
            </tr>
            <template v-if="layout === 'split'">
              <tr v-for="(row, r) in rows" :key="r" :class="styles.row" data-row>
                <template v-for="side in ['left', 'right'] as const" :key="side">
                  <td
                    :class="[styles.num, row[side] && styles[row[side]!.kind]]"
                    :data-line="side === 'left' ? row.left?.oldNo : row.right?.newNo"
                  />
                  <td :class="[styles.code, row[side] ? styles[row[side]!.kind] : styles.blank]">
                    <template v-if="row[side]">
                      <span :class="styles.sign" aria-hidden="true">{{
                        sign(row[side]!)
                      }}</span><template
                        v-for="(seg, s) in segments(row[side]!.text, row[side]!.marks)"
                        :key="s"
                        ><mark v-if="seg.marked" :class="styles.mark">{{ seg.text }}</mark
                        ><template v-else>{{ seg.text }}</template></template
                      >
                    </template>
                  </td>
                </template>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(line, l) in lines" :key="l" :class="styles.row" data-row>
                <td :class="[styles.num, styles[line.kind]]" :data-line="line.oldNo" />
                <td :class="[styles.num, styles[line.kind]]" :data-line="line.newNo" />
                <td :class="[styles.code, styles[line.kind]]">
                  <span :class="styles.sign" aria-hidden="true">{{ sign(line) }}</span><template
                    v-for="(seg, s) in segments(line.text, line.marks)"
                    :key="s"
                    ><mark v-if="seg.marked" :class="styles.mark">{{ seg.text }}</mark
                    ><template v-else>{{ seg.text }}</template></template
                  >
                </td>
              </tr>
            </template>
          </tbody>
          <tbody v-if="lastHidden">
            <tr :class="styles.hunk">
              <td :class="styles.expand" :colspan="layout === 'split' ? 1 : 2">
                <button
                  type="button"
                  :aria-label="`Expand ${lastHidden} hidden lines down`"
                  data-expand="down"
                  @click="expand(hunks.length - 1, 'down')"
                >
                  <PynIcon name="arrow-down-line" />
                </button>
              </td>
              <td :class="styles.header" :colspan="layout === 'split' ? 3 : 1" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
