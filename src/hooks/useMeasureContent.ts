import { useCallback, useRef } from 'react'

interface MeasureContentOptions {
  fontString?: string
  padding?: number
  maxWidth?: number
}

/**
 * Hook to measure text content width using Canvas API.
 * Returns a function that measures text and returns the required width.
 *
 * @param fontString - CSS font shorthand (e.g. "16px Arial") read from the
 *   actual rendered input element via getComputedStyle. When omitted the
 *   canvas context's default font is used, which may be inaccurate.
 */
export const useMeasureContent = (options: MeasureContentOptions = {}) => {
  const {
    fontString,
    padding = 20, // 10px on each side matching .dsg-input padding
    maxWidth = 400,
  } = options

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  return useCallback(
    (text: string | number | null | undefined): number => {
      // Return 0 for empty content
      if (text === null || text === undefined || text === '') {
        return 0
      }

      const textContent = String(text)

      // Create canvas element if it doesn't exist (skip in SSR environments)
      if (!canvasRef.current && typeof document !== 'undefined') {
        canvasRef.current = document.createElement('canvas')
      }

      let context: CanvasRenderingContext2D | null = null
      try {
        context = canvasRef.current?.getContext('2d') ?? null
      } catch (error) {
        // Canvas not supported (e.g., jsdom in tests)
        context = null
      }

      if (!context) {
        // Fallback for environments without canvas support (e.g., jsdom in tests)
        // Use a rough estimation: ~8px per character
        const estimatedWidth = textContent.length * 8 + padding
        return Math.min(estimatedWidth, maxWidth)
      }

      // Apply the computed font from the real DOM element when available so
      // measurements match what the user actually sees.
      if (fontString) {
        context.font = fontString
      }

      // Measure the text
      const metrics = context.measureText(textContent)
      const textWidth = metrics.width

      // Add padding and cap at maxWidth
      const totalWidth = Math.min(textWidth + padding, maxWidth)

      return totalWidth
    },
    [fontString, padding, maxWidth]
  )
}
