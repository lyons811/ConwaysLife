import {   cellToKey, keyToCell } from './types'
import type {Cell, GridState} from './types';

/**
 * Grid class for managing the infinite sparse grid of Conway's Game of Life.
 * Uses a Set-based data structure to efficiently store only alive cells.
 */
export class Grid {
  private aliveCells: Set<string>

  constructor(initialCells?: Set<string>) {
    this.aliveCells = initialCells ? new Set(initialCells) : new Set()
  }

  /**
   * Toggle a cell's state (alive ↔ dead)
   */
  toggleCell(x: number, y: number): void {
    const key = cellToKey(x, y)
    if (this.aliveCells.has(key)) {
      this.aliveCells.delete(key)
    } else {
      this.aliveCells.add(key)
    }
  }

  /**
   * Add an alive cell at the specified coordinates
   */
  addCell(x: number, y: number): void {
    const key = cellToKey(x, y)
    this.aliveCells.add(key)
  }

  /**
   * Remove a cell (make it dead)
   */
  removeCell(x: number, y: number): void {
    const key = cellToKey(x, y)
    this.aliveCells.delete(key)
  }

  /**
   * Check if a cell is alive
   */
  hasCell(x: number, y: number): boolean {
    const key = cellToKey(x, y)
    return this.aliveCells.has(key)
  }

  /**
   * Clear all cells from the grid
   */
  clear(): void {
    this.aliveCells.clear()
  }

  /**
   * Get the Set of alive cells (for rendering and game logic)
   */
  getAliveCells(): Set<string> {
    return this.aliveCells
  }

  /**
   * Get the count of alive cells
   */
  getAliveCount(): number {
    return this.aliveCells.size
  }

  /**
   * Get the grid state (compatible with GridState type)
   */
  getState(): GridState {
    return {
      aliveCells: this.aliveCells,
    }
  }

  /**
   * Get all alive cells as an array of Cell objects
   */
  getCells(): Array<Cell> {
    return Array.from(this.aliveCells).map(keyToCell)
  }
}
