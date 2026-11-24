// Writes fonts.css, the latin woff2 files and the licences of the bundled font sets into <out> (default dist).
// The families come from the @fontsource-variable packages (SIL OFL 1.1) in node_modules.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const out = process.argv[2] ?? 'dist'
const faces = [
  ['geist', 'Geist Variable'],
  ['geist-mono', 'Geist Mono Variable'],
  ['pixelify-sans', 'Pixelify Sans Variable'],
]

mkdirSync(join(out, 'fonts'), { recursive: true })
let css = '/* Bundled font faces (latin subset, SIL OFL 1.1); see NOTICE. Import once per app. */\n'
for (const [pkg, family] of faces) {
  const dir = `node_modules/@fontsource-variable/${pkg}`
  const file = `${pkg}-latin-wght-normal.woff2`
  copyFileSync(`${dir}/files/${file}`, join(out, 'fonts', file))
  copyFileSync(`${dir}/LICENSE`, join(out, 'fonts', `LICENSE-${pkg}.txt`))
  const block = readFileSync(`${dir}/wght.css`, 'utf8').match(
    new RegExp(`/\\* ${pkg}-latin-wght-normal \\*/\\s*@font-face \\{[^}]*\\}`),
  )[0]
  const weight = block.match(/font-weight: ([\d ]+);/)[1]
  const range = block.match(/unicode-range: ([^;]+);/)[1]
  css += `@font-face {
  font-family: '${family}';
  font-style: normal;
  font-display: swap;
  font-weight: ${weight};
  src: url(./fonts/${file}) format('woff2-variations');
  unicode-range: ${range};
}
`
}
writeFileSync(join(out, 'fonts.css'), css)
