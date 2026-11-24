export interface FilterListOption {
  value: string
  label: string
}

/** A select in the filter bar, such as a type or sort control. */
export interface FilterListControl {
  id: string
  label: string
  value: string
  options: FilterListOption[]
}
