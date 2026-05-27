import { describe, expect, it } from 'vitest'

import { format } from '../format'

describe('format', () => {
  it('substitutes a single named placeholder', () => {
    expect(format('All times in {timeZone}', { timeZone: 'EDT' })).toBe(
      'All times in EDT'
    )
  })

  it('substitutes multiple placeholders in one template', () => {
    expect(
      format('{filled} of {total} spots filled', {
        filled: 3,
        total: 10
      })
    ).toBe('3 of 10 spots filled')
  })

  it('coerces numeric values to strings', () => {
    expect(format('{count} slots remaining', { count: 4 })).toBe(
      '4 slots remaining'
    )
  })

  it('leaves the placeholder visible when a key is missing', () => {
    expect(format('All times in {timeZone}', {})).toBe(
      'All times in {timeZone}'
    )
  })

  it('substitutes provided keys and leaves missing keys visible', () => {
    expect(
      format('Signed up for {slotLabel}. {remaining}', {
        slotLabel: 'Saturday'
      })
    ).toBe('Signed up for Saturday. {remaining}')
  })

  it('returns the template unchanged when there are no placeholders', () => {
    expect(format('Plain text, no placeholders', { foo: 'bar' })).toBe(
      'Plain text, no placeholders'
    )
  })

  it('returns an empty string for an empty template', () => {
    expect(format('', { foo: 'bar' })).toBe('')
  })

  it('preserves special characters in substituted values', () => {
    expect(format('Hello {name}', { name: 'Ada & Lovelace <3' })).toBe(
      'Hello Ada & Lovelace <3'
    )
  })

  it('handles a placeholder that appears multiple times by substituting each occurrence', () => {
    expect(format('{name} says: hi, {name}!', { name: 'Bo' })).toBe(
      'Bo says: hi, Bo!'
    )
  })

  it('does not treat bare braces with non-word content as placeholders', () => {
    expect(format('Use {} braces { } here', { foo: 'bar' })).toBe(
      'Use {} braces { } here'
    )
  })
})
