<script setup lang="ts">
import { computed, ref } from 'vue'
import PynCommandBlock from './PynCommandBlock.vue'
import PynIcon from './PynIcon.vue'
import styles from '../styles/PynQuickSetup.module.scss'
import { copyText } from '../utils/copy'

const props = defineProps<{
  name: string
  /** The clone command, for example `pyn clone acme/game`. */
  command?: string
  /** HTTPS clone address; with it the panel shows the address field and the HTTPS / SSH toggle. */
  httpsUrl?: string
  /** SSH clone address; without it the SSH tab says SSH is not supported yet. */
  sshUrl?: string
}>()
const emit = defineEmits<{ copy: [kind: 'https' | 'ssh' | 'commands', text: string] }>()

const tab = ref<'https' | 'ssh'>('https')
const copied = ref(false)
const failed = ref(false)
const tabs = [
  { id: 'https' as const, label: 'HTTPS' },
  { id: 'ssh' as const, label: 'SSH' },
]

const clone = computed(() => props.command ?? `pyn clone <server>/<owner>/${props.name}`)
const first = computed(() => [
  '# Get a work tree, add your files and publish them',
  clone.value,
  `cd ${props.name}`,
  'pyn add .',
  'pyn commit -m "First commit"',
  'pyn push',
])
const locking = [
  '# Files marked exclusive in .pyn/pyn.toml are locked while one person edits them',
  'pyn lock <path>',
  '# edit the file, then commit to upload it and release the lock',
  'pyn commit -m "Update"',
]
const address = computed(() => (tab.value === 'ssh' ? props.sshUrl : props.httpsUrl))

function pick(id: 'https' | 'ssh') {
  tab.value = id
  copied.value = false
  failed.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  e.preventDefault()
  pick(tab.value === 'https' ? 'ssh' : 'https')
}
async function copyAddress() {
  if (!address.value) return
  const ok = await copyText(address.value)
  failed.value = !ok
  copied.value = ok
  if (ok) emit('copy', tab.value, address.value)
}
</script>

<template>
  <section :class="styles.box" aria-labelledby="quick-setup-title">
    <div :class="styles.setup">
      <h2 id="quick-setup-title" :class="styles.title">Quick setup</h2>
      <div v-if="httpsUrl" :class="styles.address">
        <div :class="styles.toggle" role="tablist" aria-label="Clone with" @keydown="onKey">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            role="tab"
            :class="styles.tab"
            :aria-selected="tab === t.id"
            :tabindex="tab === t.id ? 0 : -1"
            @click="pick(t.id)"
          >
            {{ t.label }}
          </button>
        </div>
        <div v-if="address" :class="styles.field">
          <input :class="styles.input" :value="address" readonly :aria-label="`${tab} address`" />
          <button
            type="button"
            :class="styles.copy"
            :aria-label="`Copy ${tab === 'ssh' ? 'SSH' : 'HTTPS'} address`"
            :title="copied ? 'Copied' : 'Copy'"
            @click="copyAddress"
          >
            <PynIcon :name="copied ? 'check' : 'copy'" />
          </button>
        </div>
        <p v-else :class="styles.notice" role="status" data-ssh-unsupported>
          <PynIcon name="info" />SSH is not supported yet by pyn. Please try again next release.
        </p>
      </div>
      <p v-if="failed" :class="styles.error" role="status">Could not copy</p>
      <p :class="styles.text">This repository is empty. Clone it, add your files and push.</p>
    </div>
    <div :class="styles.steps">
      <h3 :class="styles.heading">…or start from the command line</h3>
      <PynCommandBlock
        :lines="first"
        label="first commit commands"
        @copy="emit('copy', 'commands', $event)"
      />
      <h3 :class="styles.heading">…then lock a file before editing it</h3>
      <PynCommandBlock
        :lines="locking"
        label="lock commands"
        @copy="emit('copy', 'commands', $event)"
      />
    </div>
  </section>
</template>
