import {
  Bell,
  BookMarked,
  BookOpen,
  Building2,
  Calendar,
  ChartColumn,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Code,
  Copy,
  Database,
  Download,
  Ellipsis,
  Eye,
  File,
  Folder,
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  History,
  House,
  Info,
  KeyRound,
  Link,
  List,
  ListFilter,
  Lock,
  LockOpen,
  Mail,
  MapPin,
  Menu,
  OctagonExclamationPoint,
  PanelLeft,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Tag,
  Trash,
  TriangleExclamationPoint,
  User,
  Users,
  X,
} from '@lucide/icons'
import type { IconPack, IconSource } from '../types/icon.types'

/** Bundled Lucide icons keyed by pyn name; a name that is not here draws nothing unless a pack has it. */
export const lucideIcons: IconPack = {
  home: House,
  repo: BookMarked,
  settings: Settings,
  search: Search,
  plus: Plus,
  bell: Bell,
  close: X,
  chevron: ChevronDown,
  menu: Menu,
  key: KeyRound,
  folder: Folder,
  file: File,
  branch: GitBranch,
  lock: Lock,
  info: Info,
  'check-circle': CircleCheck,
  alert: TriangleExclamationPoint,
  stop: OctagonExclamationPoint,
  code: Code,
  insights: ChartColumn,
  check: Check,
  history: History,
  list: List,
  eye: Eye,
  filter: ListFilter,
  user: User,
  star: Star,
  fork: GitFork,
  copy: Copy,
  book: BookOpen,
  tag: Tag,
  users: Users,
  shield: ShieldCheck,
  mail: Mail,
  database: Database,
  download: Download,
  trash: Trash,
  more: Ellipsis,
  sidebar: PanelLeft,
  'chevron-right': ChevronRight,
  calendar: Calendar,
  commit: GitCommitHorizontal,
  'lock-open': LockOpen,
  'map-pin': MapPin,
  building: Building2,
  link: Link,
}

const escape = (v: unknown) =>
  String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Serializes an icon source to SVG inner markup; Lucide's `key` attribute is dropped. */
export function iconMarkup(source: IconSource | undefined): string {
  if (!source) return ''
  if (typeof source === 'string') return source
  const nodes = 'node' in source ? source.node : source
  return nodes
    .map(([tag, attrs, children]) => {
      const a = Object.entries(attrs)
        .filter(([k]) => k !== 'key')
        .map(([k, v]) => ` ${k}="${escape(v)}"`)
        .join('')
      return `<${tag}${a}>${children ? iconMarkup(children) : ''}</${tag}>`
    })
    .join('')
}
