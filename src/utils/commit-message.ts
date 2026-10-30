const isBlank = (line: string) => line.trim() === ''

/** Drops leading blank lines; whitespace-only text yields "". */
function skipBlankLines(text: string): string {
  let rest = text
  for (;;) {
    const nl = rest.indexOf('\n')
    if (nl < 0 || !isBlank(rest.slice(0, nl))) break
    rest = rest.slice(nl + 1)
  }
  return isBlank(rest) ? '' : rest
}

function split(message: string): [string, string] {
  let rest = skipBlankLines(message)
  const lines: string[] = []
  while (rest) {
    const nl = rest.indexOf('\n')
    const line = nl < 0 ? rest : rest.slice(0, nl)
    if (isBlank(line)) break
    lines.push(line.trimEnd())
    rest = nl < 0 ? '' : rest.slice(nl + 1)
  }
  return [lines.join(' '), skipBlankLines(rest)]
}

/** The first paragraph with its lines joined on single spaces, as git does. */
export const commitSubject = (message: string): string => split(message)[0]

/** The text after the blank lines that follow the subject; "" when there is none. */
export const commitBody = (message: string): string => split(message)[1]
