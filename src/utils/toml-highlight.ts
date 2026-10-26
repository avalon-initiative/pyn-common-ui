export type TomlTokenKind = 'table' | 'key' | 'string' | 'number' | 'boolean' | 'comment' | 'plain'

export interface TomlToken {
  kind: TomlTokenKind
  text: string
}

interface State {
  /** Open multi-line string delimiter, if any. */
  multi: '"""' | "'''" | null
  /** Unclosed `[` count inside a multi-line array value. */
  depth: number
}

const NUMBER =
  /^[+-]?(?:inf|nan|0x[0-9a-fA-F_]+|0o[0-7_]+|0b[01_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?)/
const DATE = /^\d{4}-\d{2}-\d{2}(?:[Tt ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:[Zz]|[+-]\d{2}:\d{2})?)?/
const WORD = /^[A-Za-z_][\w-]*/

function push(out: TomlToken[], kind: TomlTokenKind, text: string) {
  if (!text) return
  const last = out[out.length - 1]
  if (last && last.kind === kind) last.text += text
  else out.push({ kind, text })
}

/** Scans a value (and anything after it) from `s`, updating the multi-line state. */
function scanValue(s: string, out: TomlToken[], st: State) {
  let i = 0
  while (i < s.length) {
    const rest = s.slice(i)
    const c = s[i]
    if (st.multi) {
      const end = rest.indexOf(st.multi)
      if (end < 0) return push(out, 'string', rest)
      push(out, 'string', rest.slice(0, end + 3))
      i += end + 3
      st.multi = null
    } else if (c === '#') {
      return push(out, 'comment', rest)
    } else if (rest.startsWith('"""') || rest.startsWith("'''")) {
      st.multi = rest.slice(0, 3) as State['multi']
      push(out, 'string', st.multi!)
      i += 3
    } else if (c === '"' || c === "'") {
      let j = i + 1
      while (j < s.length && s[j] !== c) j += c === '"' && s[j] === '\\' ? 2 : 1
      push(out, 'string', s.slice(i, j + 1))
      i = j + 1
    } else {
      const m = DATE.exec(rest) ?? NUMBER.exec(rest)
      const w = m ? null : WORD.exec(rest)
      if (m && !/[\w]/.test(s[i - 1] ?? ' ')) {
        push(out, 'number', m[0])
        i += m[0].length
      } else if (w) {
        push(out, w[0] === 'true' || w[0] === 'false' ? 'boolean' : 'plain', w[0])
        i += w[0].length
      } else {
        if (c === '[') st.depth++
        else if (c === ']' && st.depth > 0) st.depth--
        push(out, 'plain', c)
        i++
      }
    }
  }
}

/** Tokenizes TOML into one token list per line; a lenient highlighter, not a validator. */
export function highlightToml(text: string): TomlToken[][] {
  const st: State = { multi: null, depth: 0 }
  return text.split('\n').map((line) => {
    const out: TomlToken[] = []
    if (st.multi || st.depth > 0) {
      scanValue(line, out, st)
      return out
    }
    const table = /^(\s*)(\[\[?[^\]#]*\]\]?)(.*)$/.exec(line)
    if (table) {
      push(out, 'plain', table[1])
      push(out, 'table', table[2])
      scanValue(table[3], out, st)
      return out
    }
    const kv =
      /^(\s*)((?:[\w.-]+|"[^"]*"|'[^']*')(?:\s*\.\s*(?:[\w-]+|"[^"]*"|'[^']*'))*)(\s*=)(.*)$/.exec(
        line,
      )
    if (kv) {
      push(out, 'plain', kv[1])
      push(out, 'key', kv[2])
      push(out, 'plain', kv[3])
      scanValue(kv[4], out, st)
      return out
    }
    scanValue(line, out, st)
    return out
  })
}
