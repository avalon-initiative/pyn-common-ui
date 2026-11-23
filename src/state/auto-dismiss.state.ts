import { onBeforeUnmount, ref, watch } from 'vue'

export const AUTO_DISMISS_MS = 10_000
export const FADE_MS = 400

export type DismissPhase = 'shown' | 'fading' | 'gone'

interface Options {
  /** Delay before the fade starts; 0 or less disables auto-dismiss. */
  delay: () => number
  onDismiss: () => void
}

/** Timer-driven fade-out that waits while the pointer or focus is inside the message. */
export function useAutoDismiss({ delay, onDismiss }: Options) {
  const phase = ref<DismissPhase>('shown')
  let timer: ReturnType<typeof setTimeout> | undefined
  let hovered = false
  let focused = false

  const clear = () => {
    clearTimeout(timer)
    timer = undefined
  }

  function finish() {
    clear()
    phase.value = 'gone'
    onDismiss()
  }

  function arm() {
    clear()
    const ms = delay()
    if (phase.value === 'gone' || ms <= 0 || hovered || focused) return
    timer = setTimeout(() => {
      phase.value = 'fading'
      timer = setTimeout(finish, FADE_MS)
    }, ms)
  }

  function hold(next: { hovered?: boolean; focused?: boolean }) {
    hovered = next.hovered ?? hovered
    focused = next.focused ?? focused
    if (phase.value === 'fading') phase.value = 'shown'
    arm()
  }

  /** Shows the message again with a full delay, for when its text changes. */
  function restart() {
    phase.value = 'shown'
    arm()
  }

  const handlers = {
    pointerenter: () => hold({ hovered: true }),
    pointerleave: () => hold({ hovered: false }),
    focusin: () => hold({ focused: true }),
    focusout: (e: FocusEvent) => {
      const root = e.currentTarget as Node | null
      if (!(e.relatedTarget instanceof Node && root?.contains(e.relatedTarget)))
        hold({ focused: false })
    },
  }

  watch(delay, arm)
  arm()
  onBeforeUnmount(clear)

  return { phase, handlers, restart, close: finish }
}
