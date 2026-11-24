import type { InjectionKey, Ref } from 'vue'

/** Provided by a danger `PynSettingsSection` so delete components drop their own border. */
export const DANGER_ZONE: InjectionKey<Ref<boolean>> = Symbol('pyn-danger-zone')
