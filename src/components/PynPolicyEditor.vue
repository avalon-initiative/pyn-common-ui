<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import styles from '../styles/PynPolicyEditor.module.scss'
import { highlightToml } from '../utils/toml-highlight'

const text = defineModel<string>('text', { required: true })
const props = defineProps<{
  headRevision?: number | string
  dirty?: boolean
  saving?: boolean
  readonly?: boolean
  disabled?: boolean
  /** 1-based lines to mark as invalid, e.g. the `line`s of an invalid_rules notice. */
  problemLines?: number[]
}>()
const emit = defineEmits<{ save: []; revert: [] }>()
const id = useId()

const lines = computed(() => highlightToml(text.value))
const invalid = computed(() => new Set(props.problemLines ?? []))
const canSave = computed(() => !!props.dirty && !props.disabled && !props.readonly && !props.saving)
const offset = ref({ x: 0, y: 0 })

function onScroll(e: Event) {
  const el = e.target as HTMLTextAreaElement
  offset.value = { x: el.scrollLeft, y: el.scrollTop }
}

function onKeydown(e: KeyboardEvent) {
  if (!(e.ctrlKey || e.metaKey) || e.altKey || e.key.toLowerCase() !== 's') return
  e.preventDefault()
  if (canSave.value) emit('save')
}
</script>

<template>
  <section :class="styles.editor">
    <div :class="styles.head">
      <label :for="id" :class="styles.label">Policy (.pyn/pyn.toml)</label>
      <span v-if="headRevision !== undefined" :class="styles.revision"
        >Head revision {{ headRevision }}</span
      >
    </div>
    <div :class="styles.frame">
      <div :class="styles.gutter" aria-hidden="true">
        <div :style="{ transform: `translateY(${-offset.y}px)` }">
          <div
            v-for="(_, n) in lines"
            :key="n"
            :class="styles.number"
            :data-invalid="invalid.has(n + 1) || undefined"
          >
            {{ n + 1 }}
          </div>
        </div>
      </div>
      <div :class="styles.code">
        <div
          :class="styles.mirror"
          aria-hidden="true"
          :style="{ transform: `translate(${-offset.x}px, ${-offset.y}px)` }"
        >
          <div
            v-for="(tokens, n) in lines"
            :key="n"
            :class="styles.line"
            :data-invalid="invalid.has(n + 1) || undefined"
          >
            <span v-for="(t, k) in tokens" :key="k" :data-token="t.kind">{{ t.text }}</span>
          </div>
        </div>
        <textarea
          :id="id"
          v-model="text"
          :class="styles.area"
          spellcheck="false"
          autocomplete="off"
          autocapitalize="off"
          wrap="off"
          :readonly="readonly || saving"
          :disabled="disabled"
          @scroll="onScroll"
          @keydown="onKeydown"
        />
      </div>
    </div>
    <slot name="notice" />
    <p v-if="readonly" :class="styles.hint">You can read the policy but not change it.</p>
    <div :class="styles.actions">
      <button
        type="button"
        :class="styles.primary"
        :disabled="disabled || readonly || saving || !dirty"
        @click="emit('save')"
      >
        {{ saving ? 'Saving…' : 'Save' }}
      </button>
      <button
        type="button"
        :class="styles.button"
        :disabled="disabled || readonly || saving || !dirty"
        @click="emit('revert')"
      >
        Revert
      </button>
      <span v-if="dirty && !saving" :class="styles.status">Unsaved changes</span>
    </div>
  </section>
</template>
