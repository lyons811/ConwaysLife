'use client'

import { useCallback, useEffect, useState } from 'react'
import type { GridState } from '@/lib/game/types'
import { cellToKey, createEmptyGrid } from '@/lib/game/types'
import { useCanvas } from '@/hooks/useCanvas'
import { Camera } from '@/lib/canvas/Camera'
import { render } from '@/lib/canvas/renderer'

/**
 * Canvas component for rendering the Game of Life grid
 * Handles rendering, camera controls (zoom), and grid display
 */
export function Canvas() {
  const { canvasRef, width, height, context } = useCanvas()
  const [camera] = useState(() => new Camera(0, 0, 1.0))
  const [grid] = useState<GridState>(() => {
    // Create test grid with a few cells to verify rendering
    const testGrid = createEmptyGrid()
    testGrid.aliveCells.add(cellToKey(0, 0))
    testGrid.aliveCells.add(cellToKey(1, 0))
    testGrid.aliveCells.add(cellToKey(2, 0))
    testGrid.aliveCells.add(cellToKey(1, 1))
    testGrid.aliveCells.add(cellToKey(1, -1))
    return testGrid
  })

  // Render function
  const renderCanvas = useCallback(() => {
    if (!context || width === 0 || height === 0) return

    render(context, camera, grid, width, height)
  }, [context, camera, grid, width, height])

  // Re-render when canvas is ready or dimensions change
  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  // Handle mouse wheel zoom
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Zoom in/out based on wheel delta
      const delta = e.deltaY > 0 ? -1 : 1
      camera.applyZoom(delta, mouseX, mouseY, width, height)

      // Re-render after zoom
      renderCanvas()
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [camera, width, height, renderCanvas])

  return (
    <div className="flex-1 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  )
}
