interface StatsProps {
  generation?: number
  aliveCount?: number
}

/**
 * Stats display component showing generation count and alive cells.
 * Props will be wired up in Phase 5 when game state is lifted to parent.
 */
export function Stats({ generation = 0, aliveCount = 0 }: StatsProps) {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          Generation
        </span>
        <span className="text-foreground font-mono font-semibold">{generation}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          Alive Cells
        </span>
        <span className="text-foreground font-mono font-semibold">{aliveCount}</span>
      </div>
    </div>
  )
}
