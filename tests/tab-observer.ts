// Fakes the layout PynTabs measures: the nav width, each probe tab's width and a ResizeObserver to replay.
export interface TabWidths {
  avail: number
  tab: number
  more: number
}

export function mockTabWidths(widths: TabWidths) {
  const size = { ...widths }
  const observers: { cb: ResizeObserverCallback; self: ResizeObserver }[] = []
  const saved = {
    ro: globalThis.ResizeObserver,
    width: Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth'),
    rect: HTMLElement.prototype.getBoundingClientRect,
  }
  globalThis.ResizeObserver = class {
    constructor(cb: ResizeObserverCallback) {
      observers.push({ cb, self: this as unknown as ResizeObserver })
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.tagName === 'NAV' ? size.avail : 0
    },
  })
  HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
    const probe = this.parentElement?.hasAttribute('data-probe')
    const w = !probe ? 0 : this === this.parentElement!.lastElementChild ? size.more : size.tab
    return { width: w, height: 0, top: 0, left: 0, right: w, bottom: 0, x: 0, y: 0 } as DOMRect
  }
  return {
    observers,
    resize(avail: number) {
      size.avail = avail
      for (const o of observers) o.cb([], o.self)
    },
    restore() {
      globalThis.ResizeObserver = saved.ro
      if (saved.width) Object.defineProperty(HTMLElement.prototype, 'clientWidth', saved.width)
      HTMLElement.prototype.getBoundingClientRect = saved.rect
    },
  }
}
