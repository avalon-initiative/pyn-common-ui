<script setup lang="ts">
import { computed, useId } from 'vue'
import PynLoading from './PynLoading.vue'
import PynModeChip from './PynModeChip.vue'
import styles from '../styles/PynPolicyView.module.scss'
import { matchedIndex } from '../state/policy.state'
import type { Mode } from '../types/lock.types'
import type { PolicyRule } from '../types/policy.types'

const props = withDefaults(
  defineProps<{
    /** The mode of every path no rule matches. */
    mode: Mode
    rules: PolicyRule[]
    /** Name of the policy file. */
    file?: string
    /** A path the policy was evaluated for, with `matched` the rule that applies to it. */
    path?: string
    /** Zero-based rule index, or the pattern of the rule, that matches `path`. */
    matched?: number | string | null
    editHref?: string
    loading?: boolean
    error?: string
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  }>(),
  { file: '.pyn/pyn.toml', headingLevel: 2 },
)

const id = useId()
const hit = computed(() => (props.path ? matchedIndex(props.rules, props.matched) : -1))
</script>

<template>
  <section :class="styles.view" :aria-labelledby="id">
    <div :class="styles.head">
      <component :is="`h${headingLevel}`" :id="id" :class="styles.title">Path policy</component>
      <code :class="styles.file" :title="file" data-file>{{ file }}</code>
      <a v-if="editHref" :href="editHref" :class="styles.edit" data-edit>Edit policy</a>
    </div>
    <PynLoading v-if="loading" label="Loading policy" variant="block" />
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <template v-else>
      <p :class="styles.default">Default mode: <PynModeChip :mode="mode" /></p>
      <ul :class="styles.explain" aria-label="Modes">
        <li><strong>Shared</strong>: anyone can edit and changes are merged.</li>
        <li><strong>Exclusive</strong>: one person holds the lock to edit; others wait.</li>
      </ul>
      <p v-if="path" :class="styles.match" role="status" data-match>
        <code :class="styles.path">{{ path }}</code>
        <template v-if="hit >= 0"> Matches rule {{ hit + 1 }}.</template>
        <template v-else> Matches no rule: the default mode, {{ mode }}, applies.</template>
      </p>
      <p v-if="!rules.length" :class="styles.empty" data-empty>
        No rules: every path is {{ mode }}
      </p>
      <div v-else :class="styles.scroll">
        <table :class="styles.table">
          <caption :class="styles.caption">
            Rules, in the order they are checked
          </caption>
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Pattern</th>
              <th scope="col">Mode</th>
              <th scope="col">Comment</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(r, i) in rules"
              :key="i"
              :class="i === hit && styles.matched"
              :data-matched="i === hit || undefined"
              :aria-current="i === hit ? 'true' : undefined"
            >
              <th scope="row" :class="styles.num">
                {{ i + 1 }}<span v-if="i === hit" :class="styles.flag"> Matched</span>
              </th>
              <td :class="styles.pattern" :title="r.pattern">
                <code>{{ r.pattern }}</code>
              </td>
              <td><PynModeChip :mode="r.mode" /></td>
              <td :class="styles.comment">{{ r.comment }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>
