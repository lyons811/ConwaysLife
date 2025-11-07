import { keyToCell } from '../game/types'
import type { Camera } from './Camera'
import type { GridState } from '../game/types'

/**
 * Get a theme color from CSS variables with fallback
 */
function getColor(variableName: string, fallback: string): string {
  try {
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)
    const value = computedStyle.getPropertyValue(variableName).trim()

    if (!value) return fallback

    // If it's already in oklch format, use it directly
    if (value.includes('oklch')) return value

    // Otherwise wrap it in oklch()
    return `oklch(${value})`
  } catch {
    return fallback
  }
}

/**
 * Clear the canvas with background color
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const bgColor = getColor('--background', '#0a0a0a')
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)
}

/**
 * Draw grid lines
 * Only draws visible grid lines based on camera viewport
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  width: number,
  height: number,
): void {
  // Get visible world bounds
  const topLeft = camera.screenToWorld(0, 0, width, height)
  const bottomRight = camera.screenToWorld(width, height, width, height)

  const startX = Math.floor(topLeft.x)
  const startY = Math.floor(topLeft.y)
  const endX = Math.ceil(bottomRight.x)
  const endY = Math.ceil(bottomRight.y)

  const borderColor = getColor('--border', '#333')
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 1

  ctx.beginPath()

  // Draw vertical lines
  for (let x = startX; x <= endX; x++) {
    const screenPos = camera.worldToScreen(x, 0, width, height)
    ctx.moveTo(screenPos.x, 0)
    ctx.lineTo(screenPos.x, height)
  }

  // Draw horizontal lines
  for (let y = startY; y <= endY; y++) {
    const screenPos = camera.worldToScreen(0, y, width, height)
    ctx.moveTo(0, screenPos.y)
    ctx.lineTo(width, screenPos.y)
  }

  ctx.stroke()
}

/**
 * Draw alive cells
 * Only draws cells that are visible in the viewport
 */
export function drawCells(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  grid: GridState,
  width: number,
  height: number,
): void {
  const cellSize = camera.getScaledCellSize()

  // Get visible world bounds
  const topLeft = camera.screenToWorld(0, 0, width, height)
  const bottomRight = camera.screenToWorld(width, height, width, height)

  const startX = Math.floor(topLeft.x)
  const startY = Math.floor(topLeft.y)
  const endX = Math.ceil(bottomRight.x)
  const endY = Math.ceil(bottomRight.y)

  const primaryColor = getColor('--primary', '#ffffff')
  ctx.fillStyle = primaryColor

  // Draw each alive cell if it's in the visible area
  for (const cellKey of grid.aliveCells) {
    const cell = keyToCell(cellKey)

    // Skip if cell is outside visible bounds
    if (cell.x < startX || cell.x > endX || cell.y < startY || cell.y > endY) {
      continue
    }

    // Get screen position for cell
    const screenPos = camera.worldToScreen(cell.x, cell.y, width, height)

    // Draw filled rectangle for alive cell
    ctx.fillRect(screenPos.x, screenPos.y, cellSize, cellSize)
  }
}

/**
 * Complete render pass: clear, draw grid, draw cells
 */
export function render(
  ctx: CanvasRenderingContext2D,
  camera: Camera,
  grid: GridState,
  width: number,
  height: number,
): void {
  clearCanvas(ctx, width, height)
  drawGrid(ctx, camera, width, height)
  drawCells(ctx, camera, grid, width, height)
}
