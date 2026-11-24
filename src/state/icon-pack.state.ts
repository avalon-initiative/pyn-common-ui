import type { InjectionKey } from 'vue'
import type { IconPack } from '../types/icon.types'

/** Provide an `IconPack` (`app.provide(PYN_ICON_PACK, pack)`); its names win over the bundled Lucide set. */
export const PYN_ICON_PACK: InjectionKey<IconPack> = Symbol('pyn-icon-pack')
