<script setup lang="ts">
import { computed, ref } from 'vue'
import PynAvatar from './PynAvatar.vue'
import PynFilterList from './PynFilterList.vue'
import PynIcon from './PynIcon.vue'
import PynSettingsSection from './PynSettingsSection.vue'
import styles from '../styles/PynTeamDetail.module.scss'
import { formatDate } from '../utils/datetime'
import { repoPath } from '../state/repo.state'
import { matchingMembers, splitRepo, toggleMember } from '../state/team.state'
import type { TeamInfo } from '../types/team.types'

const props = defineProps<{
  team: TeamInfo
  /** Organization members who could be added. */
  candidates: string[]
  /** Owners add and remove members. */
  owner: boolean
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{
  add: [user: string]
  remove: [user: string]
  removeMany: [users: string[]]
}>()

const query = ref('')
const adding = defineModel<boolean>('adding', { default: false })
const picked = ref('')
const chosen = ref<string[]>([])

const shown = computed(() => matchingMembers(props.team.members, query.value))
const allChosen = computed(
  () => shown.value.length > 0 && shown.value.every((u) => chosen.value.includes(u)),
)

function add() {
  if (!picked.value) return
  emit('add', picked.value)
  picked.value = ''
}
function selectAll(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  chosen.value = on
    ? [...new Set([...chosen.value, ...shown.value])]
    : chosen.value.filter((u) => !shown.value.includes(u))
}
function removeChosen() {
  const users = chosen.value.filter((u) => props.team.members.includes(u))
  chosen.value = []
  emit('removeMany', users)
}
</script>

<template>
  <section :class="styles.page">
    <aside :class="styles.about" data-about aria-label="About this team">
      <PynAvatar :username="team.slug" :name="team.name" size="xl" :class="styles.avatar" />
      <h2 :class="styles.title">{{ team.name }}</h2>
      <p :class="styles.meta">
        <code>{{ team.slug }}</code> · created {{ formatDate(team.created_at) }}
      </p>
      <h3 :class="styles.aboutHeading">About</h3>
      <p :class="team.description ? styles.description : styles.muted" data-description>
        {{ team.description || 'No description.' }}
      </p>
    </aside>

    <div :class="styles.main">
      <PynSettingsSection title="Members" plain>
        <div v-if="owner && adding" :class="styles.panel" data-add>
          <p v-if="!candidates.length" :class="styles.muted">
            Every member of the organization is in this team.
          </p>
          <form v-else :class="styles.form" @submit.prevent="add">
            <label :class="styles.field"
              >Add an organization member
              <select v-model="picked" :class="styles.input" required>
                <option value="" disabled>Choose a member</option>
                <option v-for="c in candidates" :key="c" :value="c">{{ c }}</option>
              </select>
            </label>
            <button type="submit" :class="styles.primary" :disabled="busy">Add</button>
            <button type="button" :class="styles.cancel" @click="adding = false">Cancel</button>
          </form>
        </div>
        <p v-if="error" :class="styles.error" role="alert">{{ error }}</p>
        <PynFilterList
          v-model:query="query"
          noun="member"
          search-label="Find a member"
          placeholder="Find a member…"
          label="Team members"
          :count="shown.length"
          :filtered="query.trim() !== ''"
          empty-title="No members"
          empty-description="Add an organization member to give them this team's access."
          :page-size="Math.max(shown.length, 1)"
        >
          <template v-if="owner" #actions>
            <button
              type="button"
              :class="styles.primary"
              :aria-expanded="adding"
              @click="adding = !adding"
            >
              Add a member
            </button>
          </template>
          <template v-if="owner && shown.length" #lead>
            <input
              type="checkbox"
              :class="styles.check"
              :checked="allChosen"
              aria-label="Select all members"
              data-select-all
              @change="selectAll"
            />
          </template>
          <template v-if="owner && chosen.length" #header>
            <button
              type="button"
              :class="styles.danger"
              :disabled="busy"
              data-remove-selected
              @click="removeChosen"
            >
              Remove {{ chosen.length }} selected
            </button>
          </template>
          <li v-for="u in shown" :key="u" :class="styles.item" data-member>
            <label v-if="owner" :class="styles.who">
              <input
                type="checkbox"
                :class="styles.check"
                :checked="chosen.includes(u)"
                :aria-label="`Select ${u}`"
                @change="chosen = toggleMember(chosen, u)"
              />
              <PynAvatar :username="u" size="sm" />
              <strong>{{ u }}</strong>
            </label>
            <span v-else :class="styles.who">
              <PynAvatar :username="u" size="sm" />
              <strong>{{ u }}</strong>
            </span>
            <button
              v-if="owner"
              type="button"
              :class="styles.danger"
              :disabled="busy"
              :aria-label="`Remove ${u}`"
              @click="emit('remove', u)"
            >
              Remove
            </button>
          </li>
        </PynFilterList>
      </PynSettingsSection>

      <PynSettingsSection title="Repositories" plain>
        <ul v-if="team.repos.length" :class="styles.list" data-repos>
          <li v-for="r in team.repos" :key="r.repo" :class="styles.item">
            <a :href="repoPath(splitRepo(r.repo))" :class="styles.link">
              <PynIcon name="repo" />{{ r.repo }}
            </a>
            <span :class="styles.pill" data-role>{{ r.role }}</span>
          </li>
        </ul>
        <p v-else :class="styles.muted">This team has no role on any repository.</p>
      </PynSettingsSection>
    </div>
  </section>
</template>
