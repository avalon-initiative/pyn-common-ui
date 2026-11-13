const parts = (v: string) => v.replace(/^v/, '').split('.')

// Versions differ in major or minor; an unset or unparsable side never counts as a mismatch.
export function versionMismatch(web: string, server: string): boolean {
  if (!web || !server) return false
  const [wa, wb] = parts(web)
  const [sa, sb] = parts(server)
  return wa !== sa || wb !== sb
}
