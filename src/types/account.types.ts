/** Which profile fields others may see; mirrors the server's `ProfileVisibility`. A missing flag is visible. */
export interface ProfileVisibility {
  avatar?: boolean
  bio?: boolean
  company?: boolean
  display_name?: boolean
  links?: boolean
  location?: boolean
  starred?: boolean
}

/** The editable profile text; mirrors the server's `UpdateProfileRequest`. */
export interface ProfileValues {
  display_name?: string | null
  bio?: string | null
  location?: string | null
  company?: string | null
  links?: string[]
  visibility?: ProfileVisibility
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
