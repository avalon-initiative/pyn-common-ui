<script setup lang="ts">
import styles from '../styles/PynAccessSessionItem.module.scss'
import { formatDateTime } from '../utils/datetime'
import { reasonLabel, stateLabel } from '../state/access-session.state'
import type { AccessSessionInfo } from '../types/access-session.types'

defineProps<{ session: AccessSessionInfo; showUser?: boolean }>()
</script>

<template>
  <li :class="styles.item">
    <div :class="styles.head">
      <div>
        <strong>{{ session.admin }}</strong>
        <template v-if="showUser">
          acting as <strong>{{ session.user }}</strong></template
        >
        <span :class="[styles.state, session.state === 'active' && styles.live]">{{
          stateLabel(session.state)
        }}</span>
      </div>
      <slot name="actions" />
    </div>
    <p :class="styles.meta">Reason: {{ reasonLabel(session.reason) }}</p>
    <p v-if="session.notes" :class="styles.notes">{{ session.notes }}</p>
    <p :class="styles.meta">
      Started {{ formatDateTime(session.started_at) }} · Expires
      {{ formatDateTime(session.expires_at) }}
      <template v-if="session.ended_at"> · Ended {{ formatDateTime(session.ended_at) }}</template>
    </p>
    <details v-if="session.reached.length" :class="styles.reached">
      <summary>
        {{ session.reached.length }} {{ session.reached.length === 1 ? 'route' : 'routes' }} called
      </summary>
      <div :class="styles.scroll">
        <table :class="styles.table">
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">Route</th>
              <th scope="col">Target</th>
              <th scope="col">Calls</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in session.reached" :key="i">
              <td>{{ r.method }}</td>
              <td :class="styles.route">
                {{ r.route }}
                <span v-if="r.refused" :class="styles.refused">Refused</span>
              </td>
              <td>{{ r.target || '-' }}</td>
              <td>{{ r.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
    <p v-else :class="styles.meta">No routes called.</p>
  </li>
</template>
