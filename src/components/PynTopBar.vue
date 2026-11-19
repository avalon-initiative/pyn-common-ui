<script setup lang="ts">
import { computed } from 'vue'
import PynIcon from './PynIcon.vue'
import PynMenu from './PynMenu.vue'
import PynAvatar from './PynAvatar.vue'
import PynSearch from './PynSearch.vue'
import styles from '../styles/PynTopBar.module.scss'
import { themeChoices } from '../state/theme.state'
import type { ThemeChoice } from '../state/theme.state'
import type { MenuItem } from '../types/shell.types'

const props = defineProps<{
  user?: string
  /** Shown beside the account name and used for the avatar initials. */
  displayName?: string | null
  avatarUrl?: string | null
  repos?: string[]
  theme: ThemeChoice
  /** Public variant: sign-in link and theme control, no search, create or account menus. */
  signedOut?: boolean
  signInHref?: string
  admin?: boolean
  extraAccount?: MenuItem[]
}>()
const emit = defineEmits<{
  open: [slug: string]
  theme: [ThemeChoice]
  signOut: []
  account: [id: string]
}>()

const create: MenuItem[] = [
  { id: 'new-repo', label: 'New repository', href: '/_/new' },
  { id: 'new-org', label: 'New organization', href: '/_/new-org' },
]
const themeItems = computed<MenuItem[]>(() =>
  themeChoices.map((t) => ({
    id: `theme:${t.id}`,
    label: `${t.label} theme`,
    checked: props.theme === t.id,
  })),
)
const account = computed<MenuItem[]>(() => [
  { id: 'settings', label: 'Account settings', href: '/_/settings' },
  ...(props.admin ? [{ id: 'admin', label: 'Server administration', href: '/_/admin' }] : []),
  ...(props.extraAccount ?? []),
  { id: 'sep-theme', label: '', separator: true },
  ...themeItems.value,
  { id: 'sep-out', label: '', separator: true },
  { id: 'sign-out', label: 'Sign out' },
])

function pick(id: string) {
  if (id === 'sign-out') emit('signOut')
  else if (id.startsWith('theme:')) emit('theme', id.slice(6) as ThemeChoice)
  else if (props.extraAccount?.some((i) => i.id === id)) emit('account', id)
}
</script>

<template>
  <div :class="styles.bar">
    <a href="/" :class="styles.brand">PYN</a>
    <template v-if="signedOut">
      <span :class="styles.spacer" />
      <PynMenu label="Theme" :items="themeItems" @select="pick"
        >Theme<PynIcon name="chevron" :class="styles.chevron"
      /></PynMenu>
      <a :href="signInHref ?? '/_/sign-in'" :class="styles.signIn" data-sign-in>Sign in</a>
    </template>
    <template v-else>
      <PynSearch :options="repos ?? []" :class="styles.search" @open="emit('open', $event)" />
      <PynMenu label="Create" :items="create">
        <PynIcon name="plus" /><PynIcon name="chevron" :class="styles.chevron" />
      </PynMenu>
      <PynMenu label="Account menu" :items="account" @select="pick">
        <template #header>
          <p :class="styles.who">
            Signed in as <template v-if="displayName">{{ displayName }} ({{ user }})</template
            ><template v-else>{{ user }}</template>
          </p>
        </template>
        <PynAvatar
          v-if="displayName || avatarUrl"
          :username="user ?? ''"
          :name="displayName"
          :src="avatarUrl"
        />
        <span v-else :class="styles.avatar">{{ (user ?? '').slice(0, 1).toUpperCase() }}</span>
      </PynMenu>
    </template>
  </div>
</template>
