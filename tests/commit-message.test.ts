import { describe, expect, it } from 'vitest'
import { commitBody, commitSubject } from '../src/utils/commit-message'

describe('commit subject and body', () => {
  it('takes a single line as the subject with no body', () => {
    expect(commitSubject('only\n')).toBe('only')
    expect(commitBody('only\n')).toBe('')
    expect(commitSubject('only')).toBe('only')
  })

  it('joins a multi-line first paragraph on single spaces', () => {
    expect(commitSubject('one\ntwo\nthree\n')).toBe('one two three')
    expect(commitBody('one\ntwo\nthree\n')).toBe('')
  })

  it('splits subject and body at the blank line', () => {
    expect(commitSubject('subject\n\nbody line\nmore\n')).toBe('subject')
    expect(commitBody('subject\n\nbody line\nmore\n')).toBe('body line\nmore\n')
  })

  it('skips several blank lines before the subject and before the body', () => {
    const m = '\n\none\ntwo  \n\n\n\nbody\nmore\n'
    expect(commitSubject(m)).toBe('one two')
    expect(commitBody(m)).toBe('body\nmore\n')
  })

  it('treats whitespace-only lines as blank and trims line ends in the subject', () => {
    const m = 'one  \t\ntwo   \n \t \nbody\n'
    expect(commitSubject(m)).toBe('one two')
    expect(commitBody(m)).toBe('body\n')
  })

  it('returns empty strings for an empty or blank message', () => {
    for (const m of ['', '\n', '  \n\t\n  ']) {
      expect(commitSubject(m)).toBe('')
      expect(commitBody(m)).toBe('')
    }
  })

  it('handles a CRLF message without leaking carriage returns into the subject', () => {
    expect(commitSubject('one\r\ntwo\r\n\r\nbody\r\n')).toBe('one two')
  })
})
