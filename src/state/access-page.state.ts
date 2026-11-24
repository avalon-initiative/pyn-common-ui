import type { FilterListControl } from '../types/filter-list.types'
import type { AccessTab } from '../types/team.types'

const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`

export const accessCounts = (people: number, teams: number): string =>
  `${plural(people, 'person', 'people')} and ${plural(teams, 'team', 'teams')}`

export const ACCESS_TABS: { id: AccessTab; label: string }[] = [
  { id: 'direct', label: 'Direct access' },
  { id: 'organization', label: 'Organization access' },
]

export const accessControls = (
  roles: string[],
  type = 'all',
  role = 'all',
): FilterListControl[] => [
  {
    id: 'type',
    label: 'Type',
    value: type,
    options: [
      { value: 'all', label: 'Type: All' },
      { value: 'person', label: 'Type: People' },
      { value: 'team', label: 'Type: Teams' },
    ],
  },
  {
    id: 'role',
    label: 'Role',
    value: role,
    options: [
      { value: 'all', label: 'Role: All' },
      ...roles.map((r) => ({ value: r, label: `Role: ${r}` })),
    ],
  },
]

export const accessEmpty = (tab: AccessTab): { title: string; description: string } =>
  tab === 'direct'
    ? {
        title: 'No people or teams have direct access to this repository',
        description: 'People and teams you add will appear here with their role.',
      }
    : {
        title: 'No people or teams have organization-based access to this repository',
        description:
          'Assigned people and teams appear here once an organization owner grants them access.',
      }
