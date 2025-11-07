import type { CameraState } from '../game/types'

export const CELL_SIZE = 15 // Base cell size in pixels
const MIN_ZOOM = 0.5
const MAX_ZOOM = 4.0

/**
 * Camera class for viewport transformations
 * Handles coordinate conversion between world space (grid) and screen space (canvas)
 */
export class Camera {
  private state: CameraState

  constructor(x = 0, y = 0, zoom = 1.0) {
    this.state = {
      x,
      y,
      zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)),
    }
  }

  /**
   * Get current camera state
   */
  getState(): CameraState {
    return { ...this.state }
  }

  /**
   * Convert world coordinates (grid) to screen coordinates (canvas pixels)
   */
  worldToScreen(
    worldX: number,
    worldY: number,
    canvasWidth: number,
    canvasHeight: number,
  ): { x: number; y: number } {
    const scaledCellSize = CELL_SIZE * this.state.zoom

    // Calculate offset from camera center
    const offsetX = worldX - this.state.x
    const offsetY = worldY - this.state.y

    // Convert to screen space (canvas center is 0,0 in camera space)
    const screenX = canvasWidth / 2 + offsetX * scaledCellSize
    const screenY = canvasHeight / 2 + offsetY * scaledCellSize

    return { x: screenX, y: screenY }
  }

  /**
   * Convert screen coordinates (canvas pixels) to world coordinates (grid)
   */
  screenToWorld(
    screenX: number,
    screenY: number,
    canvasWidth: number,
    canvasHeight: number,
  ): { x: number; y: number } {
    const scaledCellSize = CELL_SIZE * this.state.zoom

    // Calculate offset from canvas center
    const offsetX = screenX - canvasWidth / 2
    const offsetY = screenY - canvasHeight / 2

    // Convert to world space
    const worldX = this.state.x + offsetX / scaledCellSize
    const worldY = this.state.y + offsetY / scaledCellSize

    return { x: worldX, y: worldY }
  }

  /**
   * Pan the camera by delta pixels in screen space
   */
  pan(deltaX: number, deltaY: number): void {
    const scaledCellSize = CELL_SIZE * this.state.zoom

    // Convert screen space delta to world space
    this.state.x -= deltaX / scaledCellSize
    this.state.y -= deltaY / scaledCellSize
  }

  /**
   * Zoom in/out around a specific screen point
   * @param delta - Positive to zoom in, negative to zoom out
   * @param centerX - Screen X coordinate to zoom around
   * @param centerY - Screen Y coordinate to zoom around
   * @param canvasWidth - Canvas width
   * @param canvasHeight - Canvas height
   */
  applyZoom(
    delta: number,
    centerX: number,
    centerY: number,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const oldZoom = this.state.zoom

    // Calculate new zoom level
    const zoomFactor = 1 + delta * 0.1
    const newZoom = Math.max(
      MIN_ZOOM,
      Math.min(MAX_ZOOM, this.state.zoom * zoomFactor),
    )

    // If zoom didn't change (hit limits), do nothing
    if (newZoom === oldZoom) {
      return
    }

    // Get world position before zoom
    const worldPos = this.screenToWorld(
      centerX,
      centerY,
      canvasWidth,
      canvasHeight,
    )

    // Apply zoom
    this.state.zoom = newZoom

    // Get world position after zoom (with same screen coordinates)
    const newWorldPos = this.screenToWorld(
      centerX,
      centerY,
      canvasWidth,
      canvasHeight,
    )

    // Adjust camera position to keep the world position under cursor
    this.state.x += worldPos.x - newWorldPos.x
    this.state.y += worldPos.y - newWorldPos.y
  }

  /**
   * Set camera position
   */
  setPosition(x: number, y: number): void {
    this.state.x = x
    this.state.y = y
  }

  /**
   * Get current zoom level
   */
  getZoom(): number {
    return this.state.zoom
  }

  /**
   * Get scaled cell size (accounting for zoom)
   */
  getScaledCellSize(): number {
    return CELL_SIZE * this.state.zoom
  }
}
