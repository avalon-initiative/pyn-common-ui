<script setup lang="ts">
import { computed, reactive, ref, useId, watch } from 'vue'
import styles from '../styles/PynTokenForm.module.scss'
import {
  availableResources,
  buildPermissions,
  DEFAULT_EXPIRY,
  expiryFromDate,
  expiryPreview,
  filterRepos,
  LEVEL_LABELS,
  TOKEN_EXPIRY_CHOICES,
  tokenFormProblem,
} from '../state/token.state'
import type { TokenAccessMode, TokenForm, TokenLevel, TokenOwnerOption } from '../types/token.types'

const props = defineProps<{
  /** The account and the organizations the creator belongs to; the first is the default. */
  owners: TokenOwnerOption[]
  /** Repositories of the chosen owner, offered by the picker for `selected` access. */
  repos: string[]
  /** ISO instant used to compute expiry dates; defaults to the current time. */
  now?: string
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ submit: [TokenForm]; cancel: []; 'owner-change': [string] }>()

const id = useId()
const form = reactive({
  name: '',
  description: '',
  owner: props.owners[0]?.name ?? '',
  expiry: DEFAULT_EXPIRY,
  customDate: '',
  mode: 'public' as TokenAccessMode,
})
const levels = reactive<Record<string, TokenLevel | ''>>({})
const selected = ref<string[]>([])
const query = ref('')
const submitted = ref(false)

const clock = computed(() => (props.now ? new Date(props.now) : new Date()))
const kind = computed(() => props.owners.find((o) => o.name === form.owner)?.kind ?? 'account')
const resources = computed(() => availableResources(kind.value, form.mode))
const choice = computed(
  () => TOKEN_EXPIRY_CHOICES.find((c) => c.value === form.expiry) ?? TOKEN_EXPIRY_CHOICES[1],
)
const matches = computed(() =>
  filterRepos(props.repos, query.value).filter((r) => !selected.value.includes(r)),
)
const permissions = computed(() => buildPermissions(levels, kind.value, form.mode))
const problem = computed(() =>
  tokenFormProblem({
    name: form.name,
    expiry: form.expiry,
    customDate: form.customDate,
    now: clock.value,
    mode: form.mode,
    repos: selected.value,
    permissions: permissions.value,
  }),
)

watch(
  () => form.owner,
  (owner) => {
    selected.value = []
    query.value = ''
    for (const k of Object.keys(levels)) levels[k] = ''
    emit('owner-change', owner)
  },
)

function select(repo: string) {
  selected.value = [...selected.value, repo]
}

function deselect(repo: string) {
  selected.value = selected.value.filter((r) => r !== repo)
}

function submit() {
  submitted.value = true
  if (problem.value) return
  const out: TokenForm = {
    name: form.name.trim(),
    owner: form.owner,
    repository_access:
      form.mode === 'selected' ? { mode: 'selected', repos: selected.value } : { mode: form.mode },
    permissions: permissions.value,
  }
  if (form.description.trim()) out.description = form.description.trim()
  if (form.expiry === 'never') out.never = true
  else if (form.expiry === 'custom') out.expires_at = expiryFromDate(form.customDate) ?? undefined
  emit('submit', out)
}
</script>

<template>
  <form :class="styles.form" novalidate @submit.prevent="submit">
    <label :class="styles.field"
      >Token name
      <input v-model="form.name" :class="styles.input" placeholder="ci" required />
    </label>
    <label :class="styles.field"
      >Description (optional)
      <textarea v-model="form.description" :class="styles.input" rows="2" />
    </label>

    <label :class="styles.field"
      >Resource owner
      <select v-model="form.owner" :class="styles.input">
        <option v-for="o in owners" :key="o.name" :value="o.name">
          {{ o.name }}{{ o.kind === 'account' ? ' (you)' : '' }}
        </option>
      </select>
      <span :class="styles.hint">
        {{
          kind === 'org'
            ? 'The token acts only on this organization and the repositories it owns, within your role there.'
            : 'The token acts only on your account and the repositories you own, within your role.'
        }}
      </span>
    </label>

    <label :class="styles.field"
      >Expiration
      <select v-model="form.expiry" :class="styles.input">
        <option v-for="c in TOKEN_EXPIRY_CHOICES" :key="c.value" :value="c.value">
          {{ c.label }}{{ expiryPreview(c, clock) ? ` (${expiryPreview(c, clock)})` : ''
          }}{{ c.value === DEFAULT_EXPIRY ? ' (default)' : '' }}
        </option>
      </select>
      <input
        v-if="form.expiry === 'custom'"
        v-model="form.customDate"
        type="date"
        :class="styles.input"
      />
      <span v-if="form.expiry === 'never'" :class="styles.warning" role="note">
        A token that never expires stays valid until you revoke it. Prefer an expiry.
      </span>
      <span v-else-if="expiryPreview(choice, clock)" :class="styles.hint">
        Expires {{ expiryPreview(choice, clock) }}.
      </span>
    </label>

    <fieldset :class="styles.group">
      <legend>Repository access</legend>
      <label :class="styles.choice">
        <input v-model="form.mode" type="radio" :name="`${id}-mode`" value="public" />
        <span>Public repositories<small>Read-only access to public repositories.</small></span>
      </label>
      <label :class="styles.choice">
        <input v-model="form.mode" type="radio" :name="`${id}-mode`" value="all" />
        <span>All repositories<small>Every repository the owner has now and later.</small></span>
      </label>
      <label :class="styles.choice">
        <input v-model="form.mode" type="radio" :name="`${id}-mode`" value="selected" />
        <span>Only select repositories<small>The ones you pick below.</small></span>
      </label>

      <div v-if="form.mode === 'selected'" :class="styles.picker">
        <input
          v-model="query"
          type="search"
          :class="styles.input"
          placeholder="Search repositories"
          aria-label="Search repositories"
        />
        <ul v-if="matches.length" :class="styles.matches">
          <li v-for="r in matches" :key="r">
            <button type="button" :class="styles.match" @click="select(r)">{{ r }}</button>
          </li>
        </ul>
        <p v-else :class="styles.hint">No repositories match.</p>
        <ul v-if="selected.length" :class="styles.chips" aria-label="Selected repositories">
          <li v-for="r in selected" :key="r" :class="styles.chip">
            {{ r }}
            <button type="button" :aria-label="`Remove ${r}`" @click="deselect(r)">&times;</button>
          </li>
        </ul>
      </div>
    </fieldset>

    <fieldset :class="styles.group">
      <legend>Permissions</legend>
      <p v-if="form.mode === 'public'" :class="styles.hint">
        Public access takes no repository permissions.
      </p>
      <div v-for="r in resources" :key="r.resource" :class="styles.permission">
        <label :for="`${id}-${r.resource}`">
          {{ r.label }}<small>{{ r.description }}</small>
        </label>
        <select
          v-if="r.resource !== 'metadata'"
          :id="`${id}-${r.resource}`"
          v-model="levels[r.resource]"
          :class="styles.input"
        >
          <option value="">No access</option>
          <option v-for="l in r.levels" :key="l" :value="l">
            {{ l === 'read' && r.levels.length === 1 ? 'Read' : LEVEL_LABELS[l] }}
          </option>
        </select>
        <select v-else :id="`${id}-${r.resource}`" :class="styles.input" disabled>
          <option>Read</option>
        </select>
      </div>
    </fieldset>

    <p v-if="submitted && problem" :class="styles.message" role="alert">{{ problem }}</p>
    <p v-else-if="error" :class="styles.error" role="alert">{{ error }}</p>
    <div :class="styles.actions">
      <button type="submit" :class="styles.primary" :disabled="busy">Generate token</button>
      <button type="button" :class="styles.button" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>
