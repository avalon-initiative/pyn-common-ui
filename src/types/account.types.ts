/** The editable profile text; mirrors the server's `UpdateProfileRequest`. */
export interface ProfileValues {
  display_name?: string | null
  bio?: string | null
  location?: string | null
  company?: string | null
  links?: string[]
}

/** One address an account holds; mirrors the server's `AccountEmail`. */
export interface AccountEmail {
  address: string
  verified: boolean
  primary: boolean
  added_at: string
  verified_at?: string | null
}

export interface RenameForm {
  username: string
  /** Absent for an account with no password. */
  password?: string
}
