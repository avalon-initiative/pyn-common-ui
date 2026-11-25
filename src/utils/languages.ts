import type { LanguageBytes, LanguageShare } from '../types/repo.types'

// Linguist colours for the names the server detects.
const COLORS: Record<string, string> = {
  Batchfile: '#C1F12E',
  C: '#555555',
  'C#': '#178600',
  'C++': '#f34b7d',
  Clojure: '#db5855',
  CMake: '#DA3434',
  CSS: '#663399',
  Dart: '#00B4AB',
  Dockerfile: '#384d54',
  Elixir: '#6e4a7e',
  Erlang: '#B83998',
  GDScript: '#355570',
  GLSL: '#5686a5',
  Go: '#00ADD8',
  Haskell: '#5e5086',
  HCL: '#844FBA',
  HLSL: '#aace60',
  HTML: '#e34c26',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  Julia: '#a270ba',
  Kotlin: '#A97BFF',
  Less: '#1d365d',
  Lua: '#000080',
  Makefile: '#427819',
  Nim: '#ffc200',
  Nix: '#7e7eff',
  'Objective-C': '#438eff',
  'Objective-C++': '#6866fb',
  OCaml: '#ef7a08',
  Perl: '#0298c3',
  PHP: '#4F5D95',
  PowerShell: '#012456',
  'Protocol Buffer': '#cccccc',
  Python: '#3572A5',
  R: '#198CE7',
  Ruby: '#701516',
  Rust: '#dea584',
  Sass: '#a53b70',
  Scala: '#c22d40',
  SCSS: '#c6538c',
  ShaderLab: '#222c37',
  Shell: '#89e051',
  SQL: '#e38c00',
  Svelte: '#ff3e00',
  Swift: '#F05138',
  TypeScript: '#3178c6',
  Vue: '#41b883',
  WGSL: '#1a5e9a',
  Zig: '#ec915c',
}
const OTHER = '#8b949e'
const FALLBACK = ['#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#64748b']

export function languageColor(name: string): string {
  if (COLORS[name]) return COLORS[name]
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return FALLBACK[h % FALLBACK.length]
}

/** Shares to one decimal, largest first; past `max` entries the rest fold into "Other". */
export function languageShares(languages: LanguageBytes[], max = 6): LanguageShare[] {
  const sorted = languages
    .filter((l) => l.bytes > 0)
    .sort((a, b) => b.bytes - a.bytes || a.name.localeCompare(b.name))
  const total = sorted.reduce((sum, l) => sum + l.bytes, 0)
  if (!total) return []
  const pct = (bytes: number) => Math.round((bytes / total) * 1000) / 10
  const shown = sorted.length > max ? sorted.slice(0, max - 1) : sorted
  const out = shown.map((l) => ({
    name: l.name,
    bytes: l.bytes,
    percent: pct(l.bytes),
    color: languageColor(l.name),
  }))
  const rest = sorted.slice(shown.length).reduce((sum, l) => sum + l.bytes, 0)
  if (rest) out.push({ name: 'Other', bytes: rest, percent: pct(rest), color: OTHER })
  return out
}
