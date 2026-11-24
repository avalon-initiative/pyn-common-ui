/** Props shared by `PynTextField` and `PynTextArea`. */
export interface TextFieldProps {
  label: string
  /** Keeps the label for assistive technology only. */
  hideLabel?: boolean
  /** Muted text under the control. */
  help?: string
  /** Shown under the control in red; marks the control invalid. */
  error?: string
  /** Most characters; shows a counter unless `counter` is false. */
  maxlength?: number
  counter?: boolean
  disabled?: boolean
  required?: boolean
  /** Adds "(optional)" after the label. */
  optional?: boolean
  placeholder?: string
  autocomplete?: string
  name?: string
  /** Monospace text, for names and ids. */
  mono?: boolean
  /** The control's id; generated when omitted. */
  id?: string
}
