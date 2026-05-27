import { describe, expect, it, vi } from 'vitest'

import type { SignUpSheetData, SlotData } from '../../types'
import {
  appendParticipant,
  clampedRemaining,
  filledCount,
  findSlot,
  isSlotFull,
  isUserInSlot,
  remainingSpots,
  removeParticipantById,
  updateSlot
} from '../helpers'

function makeSlot(overrides: Partial<SlotData> = {}): SlotData {
  return {
    id: 'slot-1',
    label: 'Test slot',
    capacity: 3,
    participants: [],
    ...overrides
  }
}

describe('filledCount', () => {
  it('returns 0 for an empty participants list', () => {
    expect(filledCount(makeSlot())).toBe(0)
  })

  it('defaults quantity to 1 when omitted', () => {
    const slot = makeSlot({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ]
    })
    expect(filledCount(slot)).toBe(2)
  })

  it('sums explicit quantities', () => {
    const slot = makeSlot({
      participants: [
        { id: 'a', name: 'A', quantity: 2 },
        { id: 'b', name: 'B', quantity: 3 }
      ]
    })
    expect(filledCount(slot)).toBe(5)
  })
})

describe('remainingSpots', () => {
  it('returns capacity when no participants', () => {
    expect(remainingSpots(makeSlot({ capacity: 5 }))).toBe(5)
  })

  it('subtracts quantity-aware filled count', () => {
    const slot = makeSlot({
      capacity: 5,
      participants: [{ id: 'a', name: 'A', quantity: 2 }]
    })
    expect(remainingSpots(slot)).toBe(3)
  })

  it('returns negative when over capacity (unclamped)', () => {
    const slot = makeSlot({
      capacity: 1,
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ]
    })
    expect(remainingSpots(slot)).toBe(-1)
  })
})

describe('clampedRemaining', () => {
  it('returns the same value as remainingSpots when consistent', () => {
    const slot = makeSlot({
      capacity: 3,
      participants: [{ id: 'a', name: 'A' }]
    })
    expect(clampedRemaining(slot)).toBe(2)
  })

  it('clamps to 0 when over capacity', () => {
    const slot = makeSlot({
      capacity: 1,
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ]
    })
    expect(clampedRemaining(slot)).toBe(0)
  })

  it('logs a console.error in dev when over capacity', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const slot = makeSlot({
      id: 'over',
      label: 'Over',
      capacity: 1,
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ]
    })
    clampedRemaining(slot)
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain('over')
    expect(spy.mock.calls[0][0]).toContain('Over')
  })

  it('does not log when capacity is consistent', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    clampedRemaining(makeSlot({ capacity: 3 }))
    expect(spy).not.toHaveBeenCalled()
  })
})

describe('isSlotFull', () => {
  it('returns false when there is room', () => {
    expect(
      isSlotFull(
        makeSlot({
          capacity: 2,
          participants: [{ id: 'a', name: 'A' }]
        })
      )
    ).toBe(false)
  })

  it('returns true when filled equals capacity', () => {
    expect(
      isSlotFull(
        makeSlot({
          capacity: 1,
          participants: [{ id: 'a', name: 'A' }]
        })
      )
    ).toBe(true)
  })

  it('returns true when over capacity', () => {
    expect(
      isSlotFull(
        makeSlot({
          capacity: 1,
          participants: [
            { id: 'a', name: 'A' },
            { id: 'b', name: 'B' }
          ]
        })
      )
    ).toBe(true)
  })

  it('respects quantity-aware filled count', () => {
    expect(
      isSlotFull(
        makeSlot({
          capacity: 2,
          participants: [{ id: 'a', name: 'A', quantity: 2 }]
        })
      )
    ).toBe(true)
  })
})

describe('isUserInSlot', () => {
  it('returns true when user id matches a participant', () => {
    const slot = makeSlot({
      participants: [{ id: 'me', name: 'Me' }]
    })
    expect(isUserInSlot(slot, 'me')).toBe(true)
  })

  it('returns false when no match', () => {
    const slot = makeSlot({
      participants: [{ id: 'someone-else', name: 'Else' }]
    })
    expect(isUserInSlot(slot, 'me')).toBe(false)
  })
})

describe('findSlot / updateSlot for sort-by-date sheets', () => {
  const sheet: SignUpSheetData = {
    type: 'sort-by-date',
    title: 'S',
    slotGroups: [
      {
        id: 'g1',
        label: 'G1',
        slots: [makeSlot({ id: 's1' }), makeSlot({ id: 's2' })]
      },
      {
        id: 'g2',
        label: 'G2',
        slots: [makeSlot({ id: 's3' })]
      }
    ]
  }

  it('finds a slot across groups', () => {
    expect(findSlot(sheet, 's3')?.id).toBe('s3')
  })

  it('returns undefined for an unknown id', () => {
    expect(findSlot(sheet, 'missing')).toBeUndefined()
  })

  it('updates only the matched slot and preserves other groups', () => {
    const next = updateSlot(sheet, 's1', s =>
      appendParticipant(s, { id: 'p1', name: 'P1' })
    )
    if (next.type !== 'sort-by-date') throw new Error('type widened')
    expect(next.slotGroups[0].slots[0].participants).toHaveLength(1)
    expect(next.slotGroups[0].slots[1].participants).toHaveLength(0)
    expect(next.slotGroups[1].slots[0].participants).toHaveLength(0)
  })
})

describe('findSlot / updateSlot for slots-only sheets', () => {
  const sheet: SignUpSheetData = {
    type: 'slots-only',
    title: 'S',
    slots: [makeSlot({ id: 's1' }), makeSlot({ id: 's2' })]
  }

  it('finds a slot in the flat list', () => {
    expect(findSlot(sheet, 's2')?.id).toBe('s2')
  })

  it('updates only the matched slot', () => {
    const next = updateSlot(sheet, 's2', s =>
      appendParticipant(s, { id: 'p1', name: 'P1' })
    )
    if (next.type !== 'slots-only') throw new Error('type widened')
    expect(next.slots[0].participants).toHaveLength(0)
    expect(next.slots[1].participants).toHaveLength(1)
  })
})

describe('appendParticipant / removeParticipantById', () => {
  it('appends a participant immutably', () => {
    const slot = makeSlot({
      participants: [{ id: 'a', name: 'A' }]
    })
    const next = appendParticipant(slot, { id: 'b', name: 'B' })
    expect(next.participants.map(p => p.id)).toEqual(['a', 'b'])
    expect(slot.participants).toHaveLength(1)
  })

  it('removes a participant by id immutably', () => {
    const slot = makeSlot({
      participants: [
        { id: 'a', name: 'A' },
        { id: 'b', name: 'B' }
      ]
    })
    const next = removeParticipantById(slot, 'a')
    expect(next.participants.map(p => p.id)).toEqual(['b'])
    expect(slot.participants).toHaveLength(2)
  })

  it('no-ops when removing an absent id', () => {
    const slot = makeSlot({
      participants: [{ id: 'a', name: 'A' }]
    })
    const next = removeParticipantById(slot, 'missing')
    expect(next.participants).toHaveLength(1)
  })
})
