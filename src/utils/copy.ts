/** Copies `text` to the clipboard, falling back to execCommand where the async API is missing (plain http). Resolves whether it worked. */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to the legacy path
    }
  }
  return legacyCopy(text)
}

function legacyCopy(text: string): boolean {
  if (typeof document === 'undefined' || !document.body) return false
  const active = document.activeElement as HTMLElement | null
  const selection = document.getSelection()
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i))
    : []
  const area = document.createElement('textarea')
  area.value = text
  area.readOnly = true
  area.setAttribute('aria-hidden', 'true')
  area.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;pointer-events:none'
  document.body.appendChild(area)
  let ok: boolean
  try {
    area.select()
    area.setSelectionRange(0, text.length)
    ok = typeof document.execCommand === 'function' && document.execCommand('copy')
  } catch {
    ok = false
  } finally {
    document.body.removeChild(area)
    if (selection) {
      selection.removeAllRanges()
      ranges.forEach((r) => selection.addRange(r))
    }
    active?.focus?.()
  }
  return ok
}
