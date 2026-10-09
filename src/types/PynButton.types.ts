export type PynButtonVariant = 'primary' | 'secondary' | 'danger'

export interface PynButtonProps {
  label: string
  variant?: PynButtonVariant
  disabled?: boolean
}
