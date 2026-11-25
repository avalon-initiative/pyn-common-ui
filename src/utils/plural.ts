/** The noun for a count: `one` for exactly 1, else `many` (default `one` + "s"). */
export const pluralWord = (n: number, one: string, many = `${one}s`): string =>
  n === 1 ? one : many

/** "1 repository" or "75 repositories". */
export const pluralize = (n: number, one: string, many?: string): string =>
  `${n} ${pluralWord(n, one, many)}`
