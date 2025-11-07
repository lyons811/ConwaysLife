import { useEffect, useRef, useState } from 'react'

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  width: number
  height: number
  context: CanvasRenderingContext2D | null
}

/**
 * Hook for canvas setup and resize handling
 * Manages canvas element, tracks dimensions, and provides 2D context
 */
export function useCanvas(): UseCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get 2D rendering context
    const ctx = canvas.getContext('2d')
    setContext(ctx)

    // Set up ResizeObserver to handle container resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect

        // Update canvas dimensions
        setWidth(newWidth)
        setHeight(newHeight)

        // Set canvas internal resolution to match display size
        canvas.width = newWidth
        canvas.height = newHeight
      }
    })

    // Start observing the canvas
    resizeObserver.observe(canvas)

    // Initial size setup
    const rect = canvas.getBoundingClientRect()
    setWidth(rect.width)
    setHeight(rect.height)
    canvas.width = rect.width
    canvas.height = rect.height

    // Cleanup
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return {
    canvasRef,
    width,
    height,
    context,
  }
}
