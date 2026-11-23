<script setup lang="ts">
import PynEmptyState from './PynEmptyState.vue'

withDefaults(defineProps<{ newRepoHref?: string; newOrgHref?: string }>(), {
  newRepoHref: '/_/new',
  newOrgHref: '/_/new-org',
})
const emit = defineEmits<{ newRepo: [event: MouseEvent]; newOrg: [event: MouseEvent] }>()
</script>

<template>
  <PynEmptyState
    title="Create your first repository"
    description="Track your files, lock the ones that cannot be merged, or create an organization to share the work with a team."
    primary-label="New repository"
    :primary-href="newRepoHref"
    secondary-label="Create an organization"
    :secondary-href="newOrgHref"
    @primary="emit('newRepo', $event)"
    @secondary="emit('newOrg', $event)"
  />
</template>
