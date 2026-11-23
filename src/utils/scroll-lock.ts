let locks = 0
let previous = ''

/** Stops the page behind an overlay from scrolling; returns the release function. Nested locks are counted. */
export function lockBodyScroll(): () => void {
  if (locks++ === 0) {
    previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  let released = false
  return () => {
    if (released) return
    released = true
    if (--locks === 0) document.body.style.overflow = previous
  }
}
