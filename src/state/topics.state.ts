export const MAX_TOPICS = 20
export const MAX_TOPIC_LENGTH = 50

/** Splits typed or pasted text on commas and whitespace, lowercased. */
export const splitTopics = (text: string): string[] =>
  text
    .split(/[\s,]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)

/** Adds topics in order, skipping duplicates; stops at the first invalid one or the limit. */
export function addTopics(
  current: string[],
  candidates: string[],
  max = MAX_TOPICS,
  maxLength = MAX_TOPIC_LENGTH,
): { topics: string[]; rest: string[]; error?: string } {
  const topics = [...current]
  for (let i = 0; i < candidates.length; i++) {
    const t = candidates[i]
    if (topics.includes(t)) continue
    if (t.length > maxLength || !/^[a-z0-9][a-z0-9-]*$/.test(t))
      return {
        topics,
        rest: candidates.slice(i),
        error: `Use 1 to ${maxLength} lowercase letters, digits or hyphens, starting with a letter or digit.`,
      }
    if (topics.length >= max)
      return { topics, rest: candidates.slice(i), error: `At most ${max} topics.` }
    topics.push(t)
  }
  return { topics, rest: [] }
}
