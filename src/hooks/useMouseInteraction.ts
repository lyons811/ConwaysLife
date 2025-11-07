import { useCallback, useRef } from 'react'
import type { Camera } from '../lib/canvas/Camera'

interface MouseInteractionCallbacks {
  onCellToggle: (x: number, y: number) => void
  onPan: (deltaX: number, deltaY: number) => void
}

interface MouseInteractionHandlers {
  handleMouseDown: (e: MouseEvent) => void
  handleMouseMove: (e: MouseEvent) => void
  handleMouseUp: (e: MouseEvent) => void
  handleMouseLeave: (e: MouseEvent) => void
  handleContextMenu: (e: MouseEvent) => void
}

/**
 * Custom hook for handling mouse interactions on the canvas.
 * Supports left-click drawing (toggle cells) and right-click panning.
 */
export function useMouseInteraction(
  camera: Camera,
  canvasWidth: number,
  canvasHeight: number,
  callbacks: MouseInteractionCallbacks,
): MouseInteractionHandlers {
  const { onCellToggle, onPan } = callbacks

  // Track drag state
  const isLeftDraggingRef = useRef(false)
  const isRightDraggingRef = useRef(false)
  const lastCellRef = useRef<{ x: number; y: number } | null>(null)
  const lastPanPosRef = useRef<{ x: number; y: number } | null>(null)

  /**
   * Convert screen coordinates to grid cell coordinates
   */
  const screenToGridCell = useCallback(
    (screenX: number, screenY: number) => {
      const world = camera.screenToWorld(screenX, screenY, canvasWidth, canvasHeight)
      return {
        x: Math.floor(world.x),
        y: Math.floor(world.y),
      }
    },
    [camera, canvasWidth, canvasHeight],
  )

  /**
   * Handle mouse down - start dragging
   */
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
      const screenX = e.clientX - rect.left
      const screenY = e.clientY - rect.top

      if (e.button === 0) {
        // Left click - start drawing
        isLeftDraggingRef.current = true
        const cell = screenToGridCell(screenX, screenY)
        lastCellRef.current = cell
        onCellToggle(cell.x, cell.y)
      } else if (e.button === 2) {
        // Right click - start panning
        isRightDraggingRef.current = true
        lastPanPosRef.current = { x: screenX, y: screenY }
      }
    },
    [screenToGridCell, onCellToggle],
  )

  /**
   * Handle mouse move - draw or pan
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
      const screenX = e.clientX - rect.left
      const screenY = e.clientY - rect.top

      if (isLeftDraggingRef.current) {
        // Drawing - toggle cells continuously
        const cell = screenToGridCell(screenX, screenY)

        // Only toggle if we've moved to a different cell
        if (
          !lastCellRef.current ||
          lastCellRef.current.x !== cell.x ||
          lastCellRef.current.y !== cell.y
        ) {
          lastCellRef.current = cell
          onCellToggle(cell.x, cell.y)
        }
      } else if (isRightDraggingRef.current && lastPanPosRef.current) {
        // Panning - calculate delta and pan camera
        const deltaX = screenX - lastPanPosRef.current.x
        const deltaY = screenY - lastPanPosRef.current.y

        lastPanPosRef.current = { x: screenX, y: screenY }
        onPan(deltaX, deltaY)
      }
    },
    [screenToGridCell, onCellToggle, onPan],
  )

  /**
   * Handle mouse up - stop dragging
   */
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (e.button === 0) {
      isLeftDraggingRef.current = false
      lastCellRef.current = null
    } else if (e.button === 2) {
      isRightDraggingRef.current = false
      lastPanPosRef.current = null
    }
  }, [])

  /**
   * Handle mouse leave - stop all dragging
   */
  const handleMouseLeave = useCallback(() => {
    isLeftDraggingRef.current = false
    isRightDraggingRef.current = false
    lastCellRef.current = null
    lastPanPosRef.current = null
  }, [])

  /**
   * Handle context menu - prevent right-click menu
   */
  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault()
  }, [])

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleContextMenu,
  }
}
