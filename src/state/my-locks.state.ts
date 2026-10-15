import type { MyLock } from '../types/lock.types'

export const myLockKey = (l: MyLock) => `${l.owner}/${l.name}:${l.path}`
