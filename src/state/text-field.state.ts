/** Ids of the help, error and counter lines, for `aria-describedby`. */
export function fieldDescribedBy(
  id: string,
  parts: { help?: string; error?: string; counter?: boolean },
): string | undefined {
  const ids = [
    parts.error && `${id}-error`,
    parts.help && `${id}-help`,
    parts.counter && `${id}-count`,
  ].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}

/** Whether the counter shows: on by default when there is a limit. */
export const showsCounter = (maxlength?: number, counter?: boolean) =>
  maxlength !== undefined && counter !== false
