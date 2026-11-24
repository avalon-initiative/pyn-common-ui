export type IconNode = (
  | [tag: string, attrs: Record<string, unknown>]
  | [tag: string, attrs: Record<string, unknown>, children: IconNode]
)[]

/** SVG inner markup, Lucide-style element nodes, or a Lucide icon object. */
export type IconSource = string | IconNode | { node: IconNode }

export type IconPack = Record<string, IconSource>
