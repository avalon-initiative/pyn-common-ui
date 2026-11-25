import { nextTick, watch, type Ref } from 'vue'

type El = Ref<HTMLElement | null | undefined>

/**
 * Behaviour of a form opened by an action button: opening focuses `field`; closing runs `reset`
 * and, when focus was inside the removed form, returns it to `button`.
 */
export function useReveal(open: Ref<boolean>, field: El, button: El, reset?: () => void): void {
  watch(open, async (now) => {
    if (!now) reset?.()
    await nextTick()
    if (now) field.value?.focus()
    else if (!document.activeElement || document.activeElement === document.body)
      button.value?.focus()
  })
}
