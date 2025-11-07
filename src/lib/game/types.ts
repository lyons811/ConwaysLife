/**
 * Represents a cell position in the grid
 */
export interface Cell {
  x: number
  y: number
}

/**
 * Camera/viewport state for rendering
 */
export interface CameraState {
  x: number // Camera center X position in world coordinates
  y: number // Camera center Y position in world coordinates
  zoom: number // Zoom level (1.0 = normal, >1 = zoomed in, <1 = zoomed out)
}

/**
 * Grid state containing all alive cells
 */
export interface GridState {
  aliveCells: Set<string> // Set of stringified cell coordinates "x,y"
}

/**
 * Convert a cell to a string key for Set/Map storage
 */
export function cellToKey(cell: Cell): string
export function cellToKey(x: number, y: number): string
export function cellToKey(cellOrX: Cell | number, y?: number): string {
  if (typeof cellOrX === 'number' && typeof y === 'number') {
    return `${cellOrX},${y}`
  }
  const cell = cellOrX as Cell
  return `${cell.x},${cell.y}`
}

/**
 * Convert a string key back to a Cell
 */
export function keyToCell(key: string): Cell {
  const [x, y] = key.split(',').map(Number)
  return { x, y }
}

/**
 * Create an empty grid state
 */
export function createEmptyGrid(): GridState {
  return {
    aliveCells: new Set(),
  }
}
