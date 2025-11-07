import { Grid } from './Grid'

/**
 * GameEngine for Conway's Game of Life
 * Implements the classic rules with efficient sparse grid algorithm
 */
export class GameEngine {
  /**
   * Compute the next generation based on Conway's rules:
   * - Any live cell with 2-3 neighbors survives
   * - Any dead cell with exactly 3 neighbors becomes alive
   * - All other cells die or stay dead
   *
   * Uses smart boundary optimization: only checks alive cells and their neighbors
   */
  static computeNextGeneration(grid: Grid): Grid {
    const candidates = this.getCandidateCells(grid)
    const nextGrid = new Grid()

    // Apply Conway's rules to each candidate cell
    for (const cellKey of candidates) {
      const [x, y] = cellKey.split(',').map(Number)
      const neighborCount = this.countNeighbors(grid, x, y)
      const isAlive = grid.hasCell(x, y)

      // Conway's rules
      if (isAlive && (neighborCount === 2 || neighborCount === 3)) {
        // Survival: live cell with 2-3 neighbors
        nextGrid.addCell(x, y)
      } else if (!isAlive && neighborCount === 3) {
        // Birth: dead cell with exactly 3 neighbors
        nextGrid.addCell(x, y)
      }
      // Death: all other cases (cell stays dead or dies)
    }

    return nextGrid
  }

  /**
   * Get all candidate cells that could potentially change state
   * (alive cells + all their neighbors)
   */
  private static getCandidateCells(grid: Grid): Set<string> {
    const candidates = new Set<string>()
    const aliveCells = grid.getAliveCells()

    for (const cellKey of aliveCells) {
      const [x, y] = cellKey.split(',').map(Number)

      // Add the cell itself
      candidates.add(cellKey)

      // Add all 8 neighbors
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue // Skip the cell itself
          const neighborKey = `${x + dx},${y + dy}`
          candidates.add(neighborKey)
        }
      }
    }

    return candidates
  }

  /**
   * Count the number of alive neighbors for a given cell
   * Checks all 8 adjacent cells (Moore neighborhood)
   */
  private static countNeighbors(grid: Grid, x: number, y: number): number {
    let count = 0

    // Check all 8 directions
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue // Skip the cell itself

        if (grid.hasCell(x + dx, y + dy)) {
          count++
        }
      }
    }

    return count
  }
}
