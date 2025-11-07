'use client'

import { useCallback, useEffect, useState } from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useMouseInteraction } from '@/hooks/useMouseInteraction'
import { Camera } from '@/lib/canvas/Camera'
import { Grid } from '@/lib/game/Grid'
import { GameEngine } from '@/lib/game/GameEngine'
import { render } from '@/lib/canvas/renderer'

interface CanvasProps {
  isRunning: boolean
  speed: number
  clearTrigger: number
}

/**
 * Canvas component for rendering the Game of Life grid
 * Handles rendering, camera controls (zoom), simulation, and grid display
 */
export function Canvas({ isRunning, speed, clearTrigger }: CanvasProps) {
  const { canvasRef, width, height, context } = useCanvas()
  const [camera] = useState(() => new Camera(0, 0, 1.0))
  const [grid, setGrid] = useState(() => {
    // Create test grid with a few cells to verify rendering
    const testGrid = new Grid()
    testGrid.addCell(0, 0)
    testGrid.addCell(1, 0)
    testGrid.addCell(2, 0)
    testGrid.addCell(1, 1)
    testGrid.addCell(1, -1)
    return testGrid
  })
  const [_generation, setGeneration] = useState(0)

  // Render function
  const renderCanvas = useCallback(() => {
    if (!context || width === 0 || height === 0) return

    render(context, camera, grid.getState(), width, height)
  }, [context, camera, grid, width, height])

  // Handle simulation step (compute next generation)
  const handleStep = useCallback(() => {
    setGrid((currentGrid) => {
      const nextGrid = GameEngine.computeNextGeneration(currentGrid)
      return nextGrid
    })
    setGeneration((gen) => gen + 1)
  }, [])

  // Game loop - runs when isRunning is true
  useGameLoop(handleStep, speed, isRunning)

  // Handle clear trigger - clear grid and reset generation when clearTrigger changes
  useEffect(() => {
    if (clearTrigger > 0) {
      setGrid(new Grid())
      setGeneration(0)
    }
  }, [clearTrigger])

  // Handle cell toggle (left-click drawing)
  const handleCellToggle = useCallback(
    (x: number, y: number) => {
      grid.toggleCell(x, y)
      renderCanvas()
    },
    [grid, renderCanvas],
  )

  // Handle viewport panning (right-click drag)
  const handlePan = useCallback(
    (deltaX: number, deltaY: number) => {
      camera.pan(deltaX, deltaY)
      renderCanvas()
    },
    [camera, renderCanvas],
  )

  // Mouse interaction handlers
  const mouseHandlers = useMouseInteraction(camera, width, height, {
    onCellToggle: handleCellToggle,
    onPan: handlePan,
  })

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

  // Handle mouse interactions (drawing and panning)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, handleContextMenu } =
      mouseHandlers

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('contextmenu', handleContextMenu)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [mouseHandlers])

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
