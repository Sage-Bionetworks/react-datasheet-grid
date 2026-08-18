import { test, expect, describe } from 'vitest'
import { clampMaxSize } from './textColumn'

describe('clampMaxSize', () => {
  test('grows up to the configured max when there is plenty of viewport room', () => {
    // cell is 100px wide at x=140 in a 1280px-wide viewport — lots of room.
    expect(clampMaxSize(100, 140, 480, 1280, 8)).toBe(480)
  })

  test('shrinks below the configured max when the viewport is tight, but stays above the cell size', () => {
    // Only ~200px of room between the cell and the edge of a narrow window.
    expect(clampMaxSize(100, 500, 480, 700, 8)).toBe(192)
  })

  test('never exceeds the viewport ceiling even when that is smaller than the cell itself', () => {
    // A grid wider than the demo's can have a cell whose own resting width
    // already leaves less room than the cell occupies (e.g. a column near
    // the right edge). The viewport constraint must win regardless.
    const cellSize = 100
    const cellPosition = 650
    const viewportSize = 700
    const margin = 8
    const result = clampMaxSize(cellSize, cellPosition, 480, viewportSize, margin)

    expect(result).toBeLessThan(cellSize)
    expect(cellPosition + result).toBeLessThanOrEqual(viewportSize - margin)
  })

  test('floors at 0 (never negative — an invalid CSS value) if there is no room at all', () => {
    expect(clampMaxSize(100, 700, 480, 700, 8)).toBe(0)
  })
})
