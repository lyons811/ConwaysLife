export function Stats() {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          Generation
        </span>
        <span className="text-foreground font-mono font-semibold">0</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          Alive Cells
        </span>
        <span className="text-foreground font-mono font-semibold">0</span>
      </div>
    </div>
  )
}
