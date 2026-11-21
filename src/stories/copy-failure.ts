/** Story helper: makes both copy paths fail, then clicks the first button labelled `label`. */
export function failCopy(canvasElement: HTMLElement, label: string): void {
  Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
  document.execCommand = () => false
  const button = Array.from(canvasElement.querySelectorAll('button')).find(
    (b) => b.textContent?.trim() === label,
  )
  button?.click()
}
