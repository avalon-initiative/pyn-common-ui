<script setup lang="ts">
import { computed } from 'vue'
import PynAccessPage from './PynAccessPage.vue'
import PynAddPerson from './PynAddPerson.vue'
import PynInvites from './PynInvites.vue'
import PynTeamGrant from './PynTeamGrant.vue'
import type { InviteInfo, NewUser } from '../types/repo.types'
import type { AccessPageProps } from '../types/team.types'

// Listeners and v-models of PynAccessPage (manageVisibility, setRole, update:tab, ...) fall through to it.
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

const OWN = ['teams', 'invites', 'inviteCode', 'addPersonError', 'grantError', 'inviteError']
const access = computed(
  () =>
    Object.fromEntries(
      Object.entries(props).filter(([k]) => !OWN.includes(k)),
    ) as unknown as AccessPageProps,
)
const readonly = computed(() => !props.canManage)
</script>

<template>
  <PynAccessPage v-bind="access">
    <template #addPeople>
      <PynAddPerson
        :roles="roles"
        :busy="busy"
        :readonly="readonly"
        :error="addPersonError"
        @add-user="emit('addUser', $event)"
      />
    </template>
    <template #addTeams>
      <PynTeamGrant
        :teams="teams ?? []"
        :roles="roles"
        :busy="busy"
        :readonly="readonly"
        :error="grantError"
        @grant="emit('grant', $event)"
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
        @create="emit('createInvite', $event)"
        @revoke="emit('revokeInvite', $event)"
      />
    </template>
  </PynAccessPage>
</template>
