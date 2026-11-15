<script setup lang="ts">
import { computed } from 'vue'
import PynAvatar from './PynAvatar.vue'
import styles from '../styles/PynPerson.module.scss'
import { personLabel } from '../state/person.state'
import type { AvatarSize, PublicIdentity } from '../types/profile.types'

const props = withDefaults(
  defineProps<{
    /** The account name as written on the record. */
    name: string
    /** The account's current name, when it differs from `name` the written one is shown too. */
    current?: string | null
    identity?: PublicIdentity | null
    /** Show the avatar when an identity is given. */
    avatar?: boolean
    size?: AvatarSize
  }>(),
  { avatar: true, size: 'sm' },
)

const label = computed(() => personLabel(props.name, props.current, props.identity))
</script>

<template>
  <template v-if="label.plain">{{ name }}</template>
  <span v-else :class="styles.person">
    <PynAvatar
      v-if="avatar && identity"
      :username="label.account"
      :name="label.display"
      :src="identity.avatar_url"
      :size="size"
    />
    <!-- prettier-ignore -->
    <span :class="styles.text"><span v-if="label.display" :class="styles.display" data-display>{{ label.display }}</span> <span :class="styles.account" data-account>{{ label.account }}</span> <span v-if="label.written" :class="styles.written" data-written>(written as {{ label.written }})</span></span>
  </span>
</template>
