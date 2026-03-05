import { useCallback, useRef } from 'react'

interface MeasureContentOptions {
  fontSize?: string
  fontFamily?: string
  padding?: number
  maxWidth?: number
}

/**
 * Hook to measure text content width using Canvas API
 * Returns a function that measures text and returns the required width
 */
export const useMeasureContent = (options: MeasureContentOptions = {}) => {
  const {
    fontSize = '1rem',
    fontFamily = 'sans-serif',
    padding = 20, // 10px on each side for .dsg-input
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

      // Create canvas element if it doesn't exist
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas')
      }

      let context: CanvasRenderingContext2D | null = null
      try {
        context = canvasRef.current.getContext('2d')
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

      // Set font to match the input element
      // Convert rem to px (assuming 16px base)
      const fontSizePx = fontSize.includes('rem')
        ? parseFloat(fontSize) * 16
        : parseFloat(fontSize)
      context.font = `${fontSizePx}px ${fontFamily}`

      // Measure the text
      const metrics = context.measureText(textContent)
      const textWidth = metrics.width

      // Add padding and cap at maxWidth
      const totalWidth = Math.min(textWidth + padding, maxWidth)

      return totalWidth
    },
    [fontSize, fontFamily, padding, maxWidth]
  )
}
