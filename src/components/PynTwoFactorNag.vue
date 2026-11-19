<script setup lang="ts">
import { computed } from 'vue'
import PynViewNotice from './PynViewNotice.vue'
import { formatDate } from '../utils/datetime'
import type { TwoFactorRequired } from '../types/two-factor.types'

const props = defineProps<{ required: TwoFactorRequired; href: string }>()

const who = computed(() =>
  props.required.by === 'organization' && props.required.organization
    ? `The organization ${props.required.organization}`
    : 'This server',
)
</script>

<template>
  <PynViewNotice tone="warning" title="Two-factor authentication required">
    <template v-if="required.enforced">
      {{ who }} requires two-factor authentication. Set up a second factor to keep using your
      account.
    </template>
    <template v-else>
      {{ who }} requires two-factor authentication from {{ formatDate(required.deadline) }}. Set up
      a second factor before then.
    </template>
    <a :href="href">Set up two-factor authentication</a>
  </PynViewNotice>
</template>
