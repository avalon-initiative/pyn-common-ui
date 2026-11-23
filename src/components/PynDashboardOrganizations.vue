<script setup lang="ts">
import PynDashboardCard from './PynDashboardCard.vue'
import PynEmptyState from './PynEmptyState.vue'
import PynOrgList from './PynOrgList.vue'
import type { OrgInfo } from '../types/org.types'

withDefaults(
  defineProps<{
    orgs: OrgInfo[]
    loading?: boolean
    error?: string
    seeAllHref?: string
    createHref?: string
  }>(),
  { seeAllHref: '/_/orgs', createHref: '/_/new-org' },
)
const emit = defineEmits<{ retry: []; create: [event: MouseEvent] }>()
</script>

<template>
  <PynDashboardCard
    heading="Organizations"
    :see-all-href="orgs.length ? seeAllHref : undefined"
    :loading="loading"
    :error="error"
    retryable
    @retry="emit('retry')"
  >
    <PynOrgList :orgs="orgs">
      <template #empty>
        <PynEmptyState
          compact
          :heading-level="3"
          title="Create an organization"
          description="Organizations let a team share repositories and their locks."
          primary-label="New organization"
          :primary-href="createHref"
          @primary="emit('create', $event)"
        />
      </template>
    </PynOrgList>
  </PynDashboardCard>
</template>
