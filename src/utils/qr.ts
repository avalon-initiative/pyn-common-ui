// Byte-mode QR encoder, versions 1-10, error correction level M.
type Block = [count: number, data: number, count2: number, data2: number]
const ECC: Array<[ecc: number, blocks: Block]> = [
  [10, [1, 16, 0, 0]],
  [16, [1, 28, 0, 0]],
  [26, [1, 44, 0, 0]],
  [18, [2, 32, 0, 0]],
  [24, [2, 43, 0, 0]],
  [16, [4, 27, 0, 0]],
  [18, [4, 31, 0, 0]],
  [22, [2, 38, 2, 39]],
  [22, [3, 36, 2, 37]],
  [26, [4, 43, 1, 44]],
]
const ALIGN = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
]

const EXP = new Array<number>(512)
const LOG = new Array<number>(256)
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x
  LOG[x] = i
  x <<= 1
  if (x & 0x100) x ^= 0x11d
}
for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]

function reedSolomon(data: number[], degree: number): number[] {
  let gen = [1]
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(gen.length + 1).fill(0)
    gen.forEach((g, j) => {
      next[j] ^= g
      next[j + 1] ^= g ? EXP[LOG[g] + i] : 0
    })
    gen = next
  }
  const rem = new Array<number>(degree).fill(0)
  for (const d of data) {
    const f = d ^ rem.shift()!
    rem.push(0)
    if (f) gen.slice(1).forEach((g, j) => (rem[j] ^= g ? EXP[LOG[g] + LOG[f]] : 0))
  }
  return rem
}

function bch(value: number, bits: number, poly: number): number {
  const polyLen = poly.toString(2).length
  let rem = value << (polyLen - 1)
  for (let i = bits - 1 + polyLen - 1; i >= polyLen - 1; i--)
    if ((rem >> i) & 1) rem ^= poly << (i - (polyLen - 1))
  return (value << (polyLen - 1)) | rem
}

function codewords(bytes: number[], version: number): number[] {
  const [eccLen, [n1, d1, n2, d2]] = ECC[version - 1]
  const total = n1 * d1 + n2 * d2
  const bits: number[] = []
  const put = (v: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((v >> i) & 1)
  }
  put(0b0100, 4)
  put(bytes.length, version < 10 ? 8 : 16)
  bytes.forEach((b) => put(b, 8))
  put(0, Math.min(4, total * 8 - bits.length))
  while (bits.length % 8) bits.push(0)
  const data: number[] = []
  for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2))
  for (let pad = 0xec; data.length < total; pad ^= 0xec ^ 0x11) data.push(pad)

  const blocks: number[][] = []
  let at = 0
  for (let i = 0; i < n1 + n2; i++) {
    const len = i < n1 ? d1 : d2
    blocks.push(data.slice(at, at + len))
    at += len
  }
  const eccs = blocks.map((b) => reedSolomon(b, eccLen))
  const out: number[] = []
  for (let i = 0; i < d2 || i < d1; i++) blocks.forEach((b) => i < b.length && out.push(b[i]))
  for (let i = 0; i < eccLen; i++) eccs.forEach((e) => out.push(e[i]))
  return out
}

function layout(version: number, words: number[]) {
  const size = version * 4 + 17
  const dark = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const fn = Array.from({ length: size }, () => new Array<boolean>(size).fill(false))
  const set = (x: number, y: number, v: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    dark[y][x] = v
    fn[y][x] = true
  }
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy))
        set(cx + dx, cy + dy, d !== 4 && d !== 2)
      }
  }
  finder(3, 3)
  finder(size - 4, 3)
  finder(3, size - 4)
  for (let i = 8; i < size - 8; i++) {
    set(i, 6, i % 2 === 0)
    set(6, i, i % 2 === 0)
  }
  const centers = ALIGN[version - 1]
  for (const cy of centers)
    for (const cx of centers) {
      const onFinder =
        (cx === 6 && (cy === 6 || cy === centers[centers.length - 1])) ||
        (cy === 6 && cx === centers[centers.length - 1])
      if (onFinder) continue
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++)
          set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
    }
  const reserve = (x: number, y: number) => {
    if (x !== 6 && y !== 6) set(x, y, false)
  }
  for (let i = 0; i < 9; i++) {
    reserve(8, i)
    reserve(i, 8)
  }
  for (let i = 0; i < 8; i++) {
    reserve(size - 1 - i, 8)
    reserve(8, size - 1 - i)
  }
  if (version >= 7) {
    const info = bch(version, 6, 0x1f25)
    for (let i = 0; i < 18; i++) {
      const bit = ((info >> i) & 1) === 1
      const a = size - 11 + (i % 3)
      const b = Math.floor(i / 3)
      set(a, b, bit)
      set(b, a, bit)
    }
  }
  set(8, size - 8, true)

  const bits = words.flatMap((w) => Array.from({ length: 8 }, (_, i) => ((w >> (7 - i)) & 1) === 1))
  let k = 0
  for (let right = size - 1, up = true; right > 0; right -= 2, up = !up) {
    if (right === 6) right = 5
    for (let n = 0; n < size; n++) {
      const y = up ? size - 1 - n : n
      for (const x of [right, right - 1]) if (!fn[y][x]) dark[y][x] = bits[k++] ?? false
    }
  }
  return { size, dark, fn }
}

const MASKS: Array<(x: number, y: number) => boolean> = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
]

function penalty(m: boolean[][]): number {
  const size = m.length
  let score = 0
  for (let pass = 0; pass < 2; pass++)
    for (let a = 0; a < size; a++) {
      let run = 1
      for (let b = 1; b < size; b++) {
        const same = pass ? m[b][a] === m[b - 1][a] : m[a][b] === m[a][b - 1]
        run = same ? run + 1 : 1
        if (run === 5) score += 3
        else if (run > 5) score++
      }
    }
  const darkCount = m.flat().filter(Boolean).length
  return score + Math.floor(Math.abs((darkCount * 100) / (size * size) - 50) / 5) * 10
}

function withMask(base: ReturnType<typeof layout>, mask: number): boolean[][] {
  const { size, dark, fn } = base
  const m = dark.map((row, y) => row.map((v, x) => (fn[y][x] ? v : v !== MASKS[mask](x, y))))
  const format = bch(mask, 5, 0x537) ^ 0x5412
  const bit = (i: number) => ((format >> i) & 1) === 1
  for (let i = 0; i <= 5; i++) m[i][8] = bit(i)
  m[7][8] = bit(6)
  m[8][8] = bit(7)
  m[8][7] = bit(8)
  for (let i = 9; i < 15; i++) m[8][14 - i] = bit(i)
  for (let i = 0; i < 8; i++) m[8][size - 1 - i] = bit(i)
  for (let i = 8; i < 15; i++) m[size - 15 + i][8] = bit(i)
  m[size - 8][8] = true
  return m
}

/** Dark-module matrix for `text` (UTF-8), or null when it does not fit version 10. */
export function qrMatrix(text: string): boolean[][] | null {
  const bytes = Array.from(new TextEncoder().encode(text))
  const version = ECC.findIndex(
    ([, [n1, d1, n2, d2]], i) => n1 * d1 + n2 * d2 >= bytes.length + (i < 9 ? 2 : 3),
  )
  if (version < 0) return null
  const base = layout(version + 1, codewords(bytes, version + 1))
  let best: boolean[][] = []
  let bestScore = Infinity
  for (let mask = 0; mask < 8; mask++) {
    const m = withMask(base, mask)
    const s = penalty(m)
    if (s < bestScore) [best, bestScore] = [m, s]
  }
  return best
}
