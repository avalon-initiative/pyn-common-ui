import type { ShortcutBinding, ShortcutMatcher } from '../types/command-palette.types'

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'AltGraph', 'CapsLock'])

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return true
  const editable = target.closest('[contenteditable]')
  return !!editable && editable.getAttribute('contenteditable') !== 'false'
}

function same(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((k, i) => k === b[i])
}

/**
 * Matches single keys and short sequences such as g then h. Bindings must not be a prefix of
 * another; `now` is injectable for tests and defaults to Date.now.
 */
export function createShortcutMatcher(
  bindings: ShortcutBinding[],
  { timeoutMs = 1000, now = () => Date.now() }: { timeoutMs?: number; now?: () => number } = {},
): ShortcutMatcher {
  let pending: string[] = []
  let at = 0

  function reset() {
    pending = []
  }

  function step(buffer: string[]): string | null {
    const hit = bindings.find((b) => same(b.keys, buffer))
    if (hit) {
      reset()
      return hit.id
    }
    const prefix = bindings.some(
      (b) => b.keys.length > buffer.length && buffer.every((k, i) => b.keys[i] === k),
    )
    if (prefix) {
      pending = buffer
      at = now()
    } else reset()
    return null
  }

  function handle(e: KeyboardEvent): string | null {
    if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) {
      reset()
      return null
    }
    if (MODIFIER_KEYS.has(e.key)) return null
    if (pending.length && now() - at > timeoutMs) reset()
    if (pending.length) {
      const id = step([...pending, e.key])
      if (id || pending.length) return id
    }
    return step([e.key])
  }

  return { handle, reset }
}
