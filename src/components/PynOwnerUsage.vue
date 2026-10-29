<script setup lang="ts">
import styles from '../styles/PynOwnerUsage.module.scss'
import PynUsageMeter from './PynUsageMeter.vue'
import type { OwnerUsage, RepoUsage } from '../types/usage.types'

defineProps<{ usage: OwnerUsage }>()
const emit = defineEmits<{ open: [RepoUsage] }>()

const repoName = (r: RepoUsage) => r.repository.split('/').slice(1).join('/') || r.repository
const repoOwner = (r: RepoUsage) => r.repository.slice(0, r.repository.length - repoName(r).length)
</script>

<template>
  <section :class="styles.page" aria-labelledby="owner-usage-title">
    <h2 id="owner-usage-title" :class="styles.title">Usage for {{ usage.owner }}</h2>
    <div :class="styles.meters">
      <PynUsageMeter
        label="Storage"
        unit="bytes"
        :used="usage.usage.stored_bytes"
        :limit="usage.limits.effective.storage_bytes"
      />
      <PynUsageMeter
        label="Repositories"
        unit="count"
        :used="usage.usage.repositories"
        :limit="usage.limits.effective.repositories"
      />
      <PynUsageMeter
        v-if="usage.usage.members !== null"
        label="Members"
        unit="count"
        :used="usage.usage.members"
        :limit="usage.limits.effective.members"
      />
    </div>
    <h3 :class="styles.subtitle">Repositories</h3>
    <ul v-if="usage.repositories.length" :class="styles.list">
      <li v-for="repo in usage.repositories" :key="repo.repo_id" :class="styles.item">
        <div :class="styles.info">
          <button type="button" :class="styles.name" @click="emit('open', repo)">
            <span :class="styles.owner">{{ repoOwner(repo) }}</span
            >{{ repoName(repo) }}
          </button>
          <span :class="styles.meta">{{ repo.files }} files · {{ repo.revisions }} revisions</span>
        </div>
        <PynUsageMeter
          :class="styles.repoMeter"
          label="Storage"
          unit="bytes"
          :used="repo.stored_bytes"
          :limit="repo.storage_cap"
        />
      </li>
    </ul>
    <p v-else :class="styles.empty">No repositories yet.</p>
  </section>
</template>
