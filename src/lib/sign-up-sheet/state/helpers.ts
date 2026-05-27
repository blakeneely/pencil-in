import type { Participant } from '../../primitives/types'
import type { SignUpSheetData, SlotData } from '../types'

export function filledCount(slot: SlotData): number {
  return slot.participants.reduce((sum, p) => sum + (p.quantity ?? 1), 0)
}

export function remainingSpots(slot: SlotData): number {
  return slot.capacity - filledCount(slot)
}

export function clampedRemaining(slot: SlotData): number {
  const remaining = remainingSpots(slot)
  if (remaining < 0 && import.meta.env.DEV) {
    console.error(
      `[sign-up-sheet] Slot "${slot.id}" (${slot.label}) is over capacity: ` +
        `sum(quantity)=${String(filledCount(slot))} > capacity=${String(slot.capacity)}.`
    )
  }
  return Math.max(0, remaining)
}

export function isSlotFull(slot: SlotData): boolean {
  return remainingSpots(slot) <= 0
}

export function isUserInSlot(slot: SlotData, userId: string): boolean {
  return slot.participants.some(p => p.id === userId)
}

export function findSlot(
  data: SignUpSheetData,
  slotId: string
): SlotData | undefined {
  switch (data.type) {
    case 'sort-by-date':
      for (const group of data.slotGroups) {
        const found = group.slots.find(s => s.id === slotId)
        if (found) return found
      }
      return undefined
    case 'slots-only':
      return data.slots.find(s => s.id === slotId)
  }
}

export function getAllSlots(data: SignUpSheetData): readonly SlotData[] {
  switch (data.type) {
    case 'sort-by-date':
      return data.slotGroups.flatMap(g => g.slots)
    case 'slots-only':
      return data.slots
  }
}

export function updateSlot(
  data: SignUpSheetData,
  slotId: string,
  updater: (slot: SlotData) => SlotData
): SignUpSheetData {
  switch (data.type) {
    case 'sort-by-date':
      return {
        ...data,
        slotGroups: data.slotGroups.map(group => ({
          ...group,
          slots: group.slots.map(slot =>
            slot.id === slotId ? updater(slot) : slot
          )
        }))
      }
    case 'slots-only':
      return {
        ...data,
        slots: data.slots.map(slot =>
          slot.id === slotId ? updater(slot) : slot
        )
      }
  }
}

export function appendParticipant(
  slot: SlotData,
  participant: Participant
): SlotData {
  return { ...slot, participants: [...slot.participants, participant] }
}

export function removeParticipantById(
  slot: SlotData,
  participantId: string
): SlotData {
  return {
    ...slot,
    participants: slot.participants.filter(p => p.id !== participantId)
  }
}
