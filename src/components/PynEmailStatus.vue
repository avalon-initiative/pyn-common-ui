<script setup lang="ts">
import { useId } from 'vue'
import styles from '../styles/PynEmailStatus.module.scss'
import {
  MAILER_LABELS,
  MAILER_SENTENCES,
  verificationSentence,
} from '../state/server-invitation.state'
import type { MailerKind } from '../types/server-invitation.types'

defineProps<{ mailer: MailerKind; verification: boolean }>()

const id = useId()
</script>

<template>
  <section :class="styles.panel" :aria-labelledby="`${id}-title`">
    <h3 :id="`${id}-title`" :class="styles.title">Email</h3>
    <dl :class="styles.facts">
      <dt>Mailer</dt>
      <dd>
        <strong>{{ MAILER_LABELS[mailer] ?? mailer }}</strong>
        <span :class="styles.meta">{{ MAILER_SENTENCES[mailer] }}</span>
      </dd>
      <dt>Address verification</dt>
      <dd>
        <strong>{{ verification ? 'On' : 'Off' }}</strong>
        <span :class="styles.meta">{{ verificationSentence(verification) }}</span>
      </dd>
    </dl>
  </section>
</template>
