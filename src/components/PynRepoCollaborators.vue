<script setup lang="ts">
import { computed } from 'vue'
import PynAccessPage from './PynAccessPage.vue'
import PynAddPerson from './PynAddPerson.vue'
import PynInvites from './PynInvites.vue'
import PynTeamGrant from './PynTeamGrant.vue'
import type { InviteInfo, NewUser } from '../types/repo.types'
import type { AccessAdd, AccessPageProps, AccessTab } from '../types/team.types'

// PynAccessPage's other listeners (manageVisibility, setRole, ...) fall through to it.
const props = defineProps<
  AccessPageProps & {
    /** Teams that hold no role in the repository yet, offered in Add teams. */
    teams?: string[]
    invites?: InviteInfo[]
    /** The code of the invitation just created; the server shows it only once. */
    inviteCode?: string
    addPersonError?: string
    grantError?: string
    inviteError?: string
  }
>()
const emit = defineEmits<{
  addUser: [NewUser]
  grant: [{ name: string; role: string }]
  createInvite: [{ role: string; hours: number }]
  revokeInvite: [string]
}>()

const tab = defineModel<AccessTab>('tab', { default: 'direct' })
const query = defineModel<string>('query', { default: '' })
const adding = defineModel<AccessAdd | undefined>('adding')
/** New invitation form open; the app closes it after a success. */
const inviting = defineModel<boolean>('inviting', { default: false })

const OWN = [
  'teams',
  'invites',
  'inviteCode',
  'addPersonError',
  'grantError',
  'inviteError',
  'inviting',
  'invitingModifiers',
]
const access = computed(
  () =>
    Object.fromEntries(
      Object.entries(props).filter(([k]) => !OWN.includes(k)),
    ) as unknown as AccessPageProps,
)
const readonly = computed(() => !props.canManage)
</script>

<template>
  <PynAccessPage v-bind="access" v-model:tab="tab" v-model:query="query" v-model:adding="adding">
    <template #addPeople>
      <PynAddPerson
        :roles="roles"
        :busy="busy"
        :readonly="readonly"
        :error="addPersonError"
        cancel-label="Cancel"
        @add-user="emit('addUser', $event)"
        @cancel="adding = undefined"
      />
    </template>
    <template #addTeams>
      <PynTeamGrant
        :teams="teams ?? []"
        :roles="roles"
        :busy="busy"
        :readonly="readonly"
        :error="grantError"
        cancel-label="Cancel"
        @grant="emit('grant', $event)"
        @cancel="adding = undefined"
      />
    </template>
    <template v-if="invites" #invites>
      <PynInvites
        :invites="invites"
        :roles="roles"
        :code="inviteCode"
        :busy="busy"
        :readonly="readonly"
        :error="inviteError"
        v-model:adding="inviting"
        @create="emit('createInvite', $event)"
        @revoke="emit('revokeInvite', $event)"
      />
    </template>
  </PynAccessPage>
</template>
