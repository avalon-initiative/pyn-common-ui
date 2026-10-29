<script setup lang="ts">
import styles from '../styles/PynUsageBreakdown.module.scss'
import PynUsageMeter from './PynUsageMeter.vue'
import { formatBytes } from '../utils/bytes'
import type { RepoUsageBreakdown } from '../types/usage.types'

defineProps<{ breakdown: RepoUsageBreakdown }>()
</script>

<template>
  <section :class="styles.page" aria-labelledby="breakdown-title">
    <h2 id="breakdown-title" :class="styles.title">Storage in {{ breakdown.repository }}</h2>
    <PynUsageMeter
      label="Stored"
      unit="bytes"
      :used="breakdown.stored_bytes"
      :limit="breakdown.storage_cap"
    />
    <p :class="styles.note" data-note>
      Folders and paths can add up to more than the stored total, because content shared between
      them counts in each.
    </p>
    <h3 :class="styles.subtitle">Folders</h3>
    <table v-if="breakdown.folders.length" :class="styles.table">
      <thead>
        <tr>
          <th scope="col">Folder</th>
          <th scope="col" :class="styles.num">Files</th>
          <th scope="col" :class="styles.num">Stored</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in breakdown.folders" :key="f.folder">
          <td :class="styles.path">{{ f.folder || '(repository root)' }}</td>
          <td :class="styles.num">{{ f.files }}</td>
          <td :class="styles.num">{{ formatBytes(f.stored_bytes) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else :class="styles.empty">No folders hold any content yet.</p>
    <h3 :class="styles.subtitle">Largest paths</h3>
    <table v-if="breakdown.largest_paths.length" :class="styles.table">
      <thead>
        <tr>
          <th scope="col">Path</th>
          <th scope="col" :class="styles.num">Revisions</th>
          <th scope="col" :class="styles.num">Stored</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in breakdown.largest_paths" :key="p.path">
          <td :class="styles.path">{{ p.path }}</td>
          <td :class="styles.num">{{ p.revisions }}</td>
          <td :class="styles.num">{{ formatBytes(p.stored_bytes) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else :class="styles.empty">No paths hold any content yet.</p>
  </section>
</template>
