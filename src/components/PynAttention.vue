<script setup lang="ts">
import { computed, useId } from 'vue'
import PynEmptyState from './PynEmptyState.vue'
import PynLockIcon from './PynLockIcon.vue'
import styles from '../styles/PynAttention.module.scss'
import { formatLease, EXPIRING_SOON_MS } from '../utils/lease'
import { repoPath, repoSlug } from '../state/repo.state'
import type { AttentionNotice } from '../types/dashboard.types'
import type { MyLock } from '../types/lock.types'
import type { OrgInvitation } from '../types/org.types'

const props = withDefaults(
  defineProps<{
    locks?: MyLock[]
    invitations?: OrgInvitation[]
    notices?: AttentionNotice[]
    now?: Date
    /** Locks listed before "and N more". */
    maxLocks?: number
    locksHref?: string
    /** Where Accept leads for an invitation. */
    invitationHref?: (invitation: OrgInvitation) => string
  }>(),
  { maxLocks: 5, locksHref: '/_/locks' },
)
const emit = defineEmits<{ accept: [org: string, event: MouseEvent] }>()

const uid = useId()
const clock = computed(() => props.now ?? new Date())
const sorted = computed(() =>
  [...(props.locks ?? [])].sort((a, b) => a.expires_at.localeCompare(b.expires_at)),
)
const shown = computed(() => sorted.value.slice(0, props.maxLocks))
const hidden = computed(() => sorted.value.length - shown.value.length)
const soon = (l: MyLock) =>
  new Date(l.expires_at).getTime() - clock.value.getTime() < EXPIRING_SOON_MS
const empty = computed(
  () => !props.locks?.length && !props.invitations?.length && !props.notices?.length,
)
</script>

<template>
  <div :class="styles.attention">
    <PynEmptyState
      v-if="empty"
      compact
      :heading-level="3"
      title="You are all caught up"
      description="Invitations, notices and locks that are about to expire show up here."
    />
    <section v-if="invitations?.length" :class="styles.group" :aria-labelledby="`${uid}-inv`">
      <h3 :id="`${uid}-inv`" :class="styles.title">Invitations</h3>
      <ul :class="styles.list">
        <li v-for="i in invitations" :key="i.org" :class="styles.item" data-invitation>
          <span :class="styles.what">
            <strong>{{ i.org }}</strong>
            <span :class="styles.meta">Invited by {{ i.invited_by }} as {{ i.role }}</span>
          </span>
          <a
            :href="invitationHref ? invitationHref(i) : '/_/invitations'"
            :class="styles.action"
            @click="emit('accept', i.org, $event)"
            >Accept<span :class="styles.hidden">{{ ` invitation to ${i.org}` }}</span></a
          >
        </li>
      </ul>
    </section>
    <section v-if="locks?.length" :class="styles.group" :aria-labelledby="`${uid}-locks`">
      <h3 :id="`${uid}-locks`" :class="styles.title">Locks you hold</h3>
      <ul :class="styles.list">
        <li v-for="l in shown" :key="`${repoSlug(l)}:${l.path}`" :class="styles.item" data-lock>
          <span :class="styles.what">
            <span :class="styles.path"><PynLockIcon :class="styles.lockIcon" />{{ l.path }}</span>
            <a :href="repoPath(l)" :class="styles.meta">{{ repoSlug(l) }}</a>
          </span>
          <span :class="styles.meta" :data-expiring="soon(l) || undefined">
            <template v-if="soon(l)">Expiring soon: </template
            >{{ formatLease(l.expires_at, clock) }}
          </span>
        </li>
      </ul>
      <a v-if="hidden > 0" :href="locksHref" :class="styles.more" data-more
        >and {{ hidden }} more {{ hidden === 1 ? 'lock' : 'locks' }}</a
      >
    </section>
    <section v-if="notices?.length" :class="styles.group" :aria-labelledby="`${uid}-notices`">
      <h3 :id="`${uid}-notices`" :class="styles.title">Notices</h3>
      <ul :class="styles.list">
        <li v-for="n in notices" :key="n.id" :class="styles.item" data-notice>
          <a v-if="n.href" :href="n.href" :class="styles.link">{{ n.text }}</a>
          <span v-else>{{ n.text }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
