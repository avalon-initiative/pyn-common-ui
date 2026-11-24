<script setup lang="ts">
import { computed, ref } from 'vue'
import PynButton from './PynButton.vue'
import PynFilterList from './PynFilterList.vue'
import PynIcon from './PynIcon.vue'
import PynPerson from './PynPerson.vue'
import PynSettingsSection from './PynSettingsSection.vue'
import styles from '../styles/PynAccessPage.module.scss'
import { ACCESS_TABS, accessControls, accessCounts, accessEmpty } from '../state/access-page.state'
import { isEditable, sourceNote } from '../state/team.state'
import type { AccessMode } from '../types/access.types'
import type { AccessAdd, AccessRow, AccessTab } from '../types/team.types'

const props = withDefaults(
  defineProps<{
    /** Rows of the open tab, already filtered and paged by the app. */
    rows: AccessRow[]
    /** Total rows of the open tab across every page. */
    count: number
    roles: string[]
    visibility?: AccessMode
    /** Shows Manage visibility. */
    canManageVisibility?: boolean
    /** Role every organization member holds; absent means none. */
    baseRole?: string | null
    baseRoleHref?: string
    directPeople?: number
    directTeams?: number
    /** Absent for a repository owned by a person: the organization card says so. */
    organization?: string
    organizationHref?: string
    orgPeople?: number
    orgTeams?: number
    /** Selected type and role filters; `all` shows everything. */
    type?: string
    role?: string
    page?: number
    pageSize?: number
    /** Shows Create team, Add people and Add teams, and the row controls. */
    canManage?: boolean
    busy?: boolean
    loading?: boolean
    error?: string
    title?: string
  }>(),
  {
    visibility: 'private',
    directPeople: 0,
    directTeams: 0,
    orgPeople: 0,
    orgTeams: 0,
    type: 'all',
    role: 'all',
    page: 1,
    pageSize: 30,
    title: 'Manage access',
  },
)
const emit = defineEmits<{
  manageVisibility: []
  createTeam: []
  add: [kind: AccessAdd]
  filter: [id: string, value: string]
  'update:page': [page: number]
  setRole: [payload: { name: string; role: string }]
  revoke: [name: string]
}>()
const tab = defineModel<AccessTab>('tab', { default: 'direct' })
const query = defineModel<string>('query', { default: '' })
const adding = defineModel<AccessAdd | undefined>('adding')

const controls = computed(() => accessControls(props.roles, props.type, props.role))
const empty = computed(() => accessEmpty(tab.value))
const filtered = computed(
  () => query.value.trim() !== '' || props.type !== 'all' || props.role !== 'all',
)
const isPublic = computed(() => props.visibility === 'public')
const tabRefs = ref<HTMLElement[]>([])

function toggle(kind: AccessAdd) {
  adding.value = adding.value === kind ? undefined : kind
  emit('add', kind)
}
function move(i: number, step: number) {
  const next = (i + step + ACCESS_TABS.length) % ACCESS_TABS.length
  tab.value = ACCESS_TABS[next]!.id
  tabRefs.value[next]?.focus()
}
const change = (name: string, e: Event) =>
  emit('setRole', { name, role: (e.target as HTMLSelectElement).value })
</script>

<template>
  <div :class="styles.page">
    <div :class="styles.visibility" data-visibility>
      <span :class="styles.visIcon" aria-hidden="true"><PynIcon name="repo" /></span>
      <div :class="styles.visText">
        <strong>{{ isPublic ? 'Public repository' : 'Private repository' }}</strong>
        <span :class="styles.muted">{{
          isPublic
            ? 'This repository is public and visible to anyone'
            : 'Only people and teams with access can see this repository'
        }}</span>
      </div>
      <button
        v-if="canManageVisibility"
        type="button"
        :class="styles.button"
        @click="emit('manageVisibility')"
      >
        Manage visibility
      </button>
    </div>

    <div :class="styles.cards">
      <section :class="styles.card" data-card="base-role" aria-labelledby="pyn-access-base">
        <header :class="styles.cardHead">
          <h3 id="pyn-access-base" :class="styles.cardTitle">Base role</h3>
          <span :class="styles.pill" data-role>{{ baseRole ?? 'None' }}</span>
        </header>
        <p :class="styles.cardText">
          <template v-if="baseRole">
            <strong>Base role {{ baseRole }}.</strong> All organization members hold this role on
            this repository.
          </template>
          <template v-else>
            <strong>No base role set.</strong> Organization members can access this repository only
            when granted a role.
          </template>
          <a v-if="baseRoleHref" :href="baseRoleHref" :class="styles.link">Set base role</a>
        </p>
      </section>
      <section :class="styles.card" data-card="direct" aria-labelledby="pyn-access-direct">
        <header :class="styles.cardHead">
          <h3 id="pyn-access-direct" :class="styles.cardTitle">Direct access</h3>
          <PynIcon name="users" :class="styles.cardIcon" />
        </header>
        <p :class="styles.cardText">
          <template v-if="directPeople + directTeams">
            <strong>{{ accessCounts(directPeople, directTeams) }}</strong> have direct access to
            this repository.
          </template>
          <template v-else>
            <strong>No one has direct access.</strong> Only owners can contribute to this
            repository.
          </template>
        </p>
      </section>
      <section :class="styles.card" data-card="organization" aria-labelledby="pyn-access-org">
        <header :class="styles.cardHead">
          <h3 id="pyn-access-org" :class="styles.cardTitle">Organization access</h3>
          <PynIcon name="database" :class="styles.cardIcon" />
        </header>
        <p :class="styles.cardText">
          <template v-if="organization">
            <strong>{{ accessCounts(orgPeople, orgTeams) }}</strong> can access this repository
            through {{ organization }}.
            <a v-if="organizationHref" :href="organizationHref" :class="styles.link">Manage</a>
          </template>
          <template v-else>
            <strong>Owned by a person.</strong> There is no organization access to manage.
          </template>
        </p>
      </section>
    </div>

    <PynSettingsSection :title="title" plain>
      <template v-if="canManage" #actions>
        <button type="button" :class="styles.plainButton" @click="emit('createTeam')">
          Create team
        </button>
        <PynButton label="Add people" variant="secondary" @click="toggle('people')" />
        <PynButton label="Add teams" variant="secondary" @click="toggle('teams')" />
      </template>
      <div v-if="adding === 'people' && $slots.addPeople" :class="styles.panel" data-add="people">
        <slot name="addPeople" />
      </div>
      <div v-if="adding === 'teams' && $slots.addTeams" :class="styles.panel" data-add="teams">
        <slot name="addTeams" />
      </div>
      <div :class="styles.tabs" role="tablist" aria-label="Access source">
        <button
          v-for="(t, i) in ACCESS_TABS"
          :key="t.id"
          :ref="(el) => (tabRefs[i] = el as HTMLElement)"
          type="button"
          role="tab"
          :class="styles.tab"
          :aria-selected="tab === t.id"
          :tabindex="tab === t.id ? 0 : -1"
          @click="tab = t.id"
          @keydown.right.prevent="move(i, 1)"
          @keydown.left.prevent="move(i, -1)"
        >
          {{ t.label }}
        </button>
      </div>
      <PynFilterList
        v-model:query="query"
        role="tabpanel"
        noun="person"
        plural="people"
        search-label="Search by name"
        placeholder="Search by name"
        label="People and teams with access"
        :count="count"
        :controls="controls"
        :page="page"
        :page-size="pageSize"
        :loading="loading"
        :error="error"
        :filtered="filtered"
        :empty-title="empty.title"
        :empty-description="empty.description"
        @control="(id, v) => emit('filter', id, v)"
        @update:page="emit('update:page', $event)"
      >
        <li v-for="r in rows" :key="`${r.kind}:${r.name}`" :class="styles.row">
          <span :class="styles.who">
            <a v-if="r.href" :href="r.href" :class="styles.name"
              ><PynPerson :name="r.name" :identity="r.identity"
            /></a>
            <strong v-else><PynPerson :name="r.name" :identity="r.identity" /></strong>
            <span :class="styles.muted" data-kind>{{ r.kind === 'team' ? 'Team' : 'Person' }}</span>
            <span v-if="sourceNote(r.source)" :class="styles.muted" data-source>{{
              sourceNote(r.source)
            }}</span>
          </span>
          <span :class="styles.actions">
            <select
              v-if="canManage && isEditable(r)"
              :class="styles.select"
              :value="r.role"
              :aria-label="`Role of ${r.name}`"
              :disabled="busy"
              @change="change(r.name, $event)"
            >
              <option v-for="o in roles" :key="o" :value="o">{{ o }}</option>
            </select>
            <span v-else :class="styles.pill" data-role>{{ r.role }}</span>
            <button
              v-if="canManage && isEditable(r)"
              type="button"
              :class="styles.danger"
              :disabled="busy"
              :aria-label="`Revoke ${r.name}`"
              @click="emit('revoke', r.name)"
            >
              Revoke
            </button>
          </span>
        </li>
      </PynFilterList>
    </PynSettingsSection>

    <PynSettingsSection
      v-if="$slots.invites"
      title="Invitations"
      description="Invite someone with a code that grants a role when used."
      plain
    >
      <slot name="invites" />
    </PynSettingsSection>
  </div>
</template>
