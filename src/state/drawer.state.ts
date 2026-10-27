const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'

export function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true',
  )
}

/** Next element to focus for a Tab press so focus wraps inside `root`, or null to let the browser move it. */
export function trapTarget(
  root: HTMLElement,
  active: Element | null,
  backwards: boolean,
): HTMLElement | null {
  const items = focusableIn(root)
  if (!items.length) return root
  const first = items[0]
  const last = items[items.length - 1]
  if (!active || !root.contains(active) || active === root) return backwards ? last : first
  if (backwards && active === first) return last
  if (!backwards && active === last) return first
  return null
}
