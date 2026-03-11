import { renderHook } from '@testing-library/react'
import { test, expect, describe, vi } from 'vitest'
import { useMeasureContent } from './useMeasureContent'

describe('useMeasureContent', () => {
  describe('empty / falsy input', () => {
    test('returns 0 for null', () => {
      const { result } = renderHook(() => useMeasureContent())
      expect(result.current(null)).toBe(0)
    })

    test('returns 0 for undefined', () => {
      const { result } = renderHook(() => useMeasureContent())
      expect(result.current(undefined)).toBe(0)
    })

    test('returns 0 for empty string', () => {
      const { result } = renderHook(() => useMeasureContent())
      expect(result.current('')).toBe(0)
    })
  })

  describe('basic measurement (jsdom fallback path)', () => {
    test('returns positive number for non-empty string', () => {
      const { result } = renderHook(() => useMeasureContent())
      expect(result.current('Hello')).toBeGreaterThan(0)
    })

    test('longer strings produce larger widths', () => {
      const { result } = renderHook(() => useMeasureContent())
      const short = result.current('Hi')
      const long = result.current('This is a much longer string')
      expect(long).toBeGreaterThan(short)
    })

    test('numbers are coerced to string before measuring', () => {
      const { result } = renderHook(() => useMeasureContent())
      expect(result.current(12345)).toBe(result.current('12345'))
    })

    test('width is at least the padding amount', () => {
      const { result } = renderHook(() => useMeasureContent({ padding: 20 }))
      expect(result.current('A')).toBeGreaterThanOrEqual(20)
    })

    test('result never exceeds maxWidth', () => {
      const maxWidth = 100
      const { result } = renderHook(() => useMeasureContent({ maxWidth }))
      const veryLong = 'A'.repeat(1000)
      expect(result.current(veryLong)).toBeLessThanOrEqual(maxWidth)
    })
  })

  describe('options', () => {
    test('larger padding produces larger result (delta equals padding difference)', () => {
      // totalWidth = min(textWidth + padding, maxWidth)
      // When maxWidth is not hit: w2 - w1 = padding2 - padding1 exactly
      const { result: r1 } = renderHook(() => useMeasureContent({ padding: 10 }))
      const { result: r2 } = renderHook(() => useMeasureContent({ padding: 40 }))
      expect(r2.current('Test') - r1.current('Test')).toBe(30)
    })

    test('custom maxWidth is enforced', () => {
      const { result } = renderHook(() => useMeasureContent({ maxWidth: 200 }))
      expect(result.current('A'.repeat(1000))).toBeLessThanOrEqual(200)
    })
  })

  describe('fontString option (canvas code path)', () => {
    function mockCanvas(ctx: object) {
      const original = document.createElement.bind(document)
      return vi.spyOn(document, 'createElement').mockImplementation((tag, ...args) => {
        if (tag === 'canvas') return { getContext: vi.fn().mockReturnValue(ctx) } as unknown as HTMLCanvasElement
        return original(tag, ...args)
      })
    }

    test('fontString is applied to canvas context font property', () => {
      const ctx = { font: '', measureText: vi.fn().mockReturnValue({ width: 50 }) }
      const spy = mockCanvas(ctx)

      const { result } = renderHook(() => useMeasureContent({ fontString: '14px Roboto' }))
      result.current('test')

      expect(ctx.font).toBe('14px Roboto')
      spy.mockRestore()
    })

    test('canvas context font is left unchanged when fontString is not provided', () => {
      const ctx = { font: 'initial-font', measureText: vi.fn().mockReturnValue({ width: 50 }) }
      const spy = mockCanvas(ctx)

      const { result } = renderHook(() => useMeasureContent())
      result.current('test')

      expect(ctx.font).toBe('initial-font')
      spy.mockRestore()
    })

    test('canvas measurement result is used when canvas is available', () => {
      const canvasTextWidth = 80
      const padding = 20
      const ctx = { font: '', measureText: vi.fn().mockReturnValue({ width: canvasTextWidth }) }
      const spy = mockCanvas(ctx)

      const { result } = renderHook(() => useMeasureContent({ padding }))
      expect(result.current('test')).toBe(canvasTextWidth + padding)
      spy.mockRestore()
    })

    test('falls back to character estimation when canvas getContext returns null', () => {
      const spy = mockCanvas(null as unknown as object)

      const { result } = renderHook(() => useMeasureContent({ padding: 20 }))
      // Fallback: length * 8 + padding. 'test' = 4 chars → 4*8+20 = 52
      expect(result.current('test')).toBe(52)
      spy.mockRestore()
    })
  })

  describe('edge cases', () => {
    test('handles newline and tab characters', () => {
      const { result } = renderHook(() => useMeasureContent())
      expect(result.current('Hello\nWorld')).toBeGreaterThan(0)
      expect(result.current('Tab\there')).toBeGreaterThan(0)
    })

    test('handles unicode and emoji', () => {
      const { result } = renderHook(() => useMeasureContent())
      expect(result.current('😀😃😄')).toBeGreaterThan(0)
      expect(result.current('你好世界')).toBeGreaterThan(0)
    })

    test('very long strings are capped at maxWidth', () => {
      const { result } = renderHook(() => useMeasureContent())
      expect(result.current('A'.repeat(10000))).toBeLessThanOrEqual(400)
    })
  })
})
