<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import PynMenu from './PynMenu.vue'
import styles from '../styles/PynRepoSocial.module.scss'
import { forkMenu } from '../state/repo-social.state'
import type { RepoSocial, SocialButton, SocialKind } from '../types/repo-social.types'

const props = defineProps<RepoSocial>()
const emit = defineEmits<{ press: [kind: SocialKind]; menu: [kind: SocialKind, id: string] }>()

const META: Record<SocialKind, { icon: string; label: string; on: string }> = {
  watch: { icon: 'eye', label: 'Watch', on: 'Watching' },
  fork: { icon: 'fork', label: 'Fork', on: 'Fork' },
  star: { icon: 'star', label: 'Star', on: 'Starred' },
}

const buttons = computed(() =>
  (['watch', 'fork', 'star'] as const)
    .filter((kind) => props[kind])
    .map((kind) => {
      const b = props[kind] as SocialButton
      const menu =
        kind === 'fork' && props.forks ? forkMenu(b, props.forks, props.forksEmpty) : b.menu
      return { kind, ...b, menu, ...META[kind], text: b.active ? META[kind].on : META[kind].label }
    }),
)
</script>

<template>
  <div v-if="buttons.length" :class="styles.group" role="group" aria-label="Repository activity">
    <div v-for="b in buttons" :key="b.kind" :class="styles.split" :data-kind="b.kind">
      <button
        type="button"
        :class="[styles.main, b.active && styles.active]"
        :disabled="b.disabled"
        :aria-pressed="b.kind === 'fork' ? undefined : !!b.active"
        @click="emit('press', b.kind)"
      >
        <PynIcon :name="b.icon" :class="styles.icon" /><span :class="styles.label">{{
          b.text
        }}</span>
        <span :class="styles.count" data-count>{{ b.count }}</span>
      </button>
      <PynMenu
        v-if="b.menu?.length"
        :class="styles.menu"
        :label="`${b.label} options`"
        :items="b.menu"
        align="end"
        @select="emit('menu', b.kind, $event)"
      >
        <PynIcon name="chevron" />
      </PynMenu>
    </div>
  </div>
</template>
