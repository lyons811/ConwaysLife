'use client'

import { useState } from 'react'
import { Pause, Play, Trash2 } from 'lucide-react'
import { Stats } from './Stats'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export function ControlPanel() {
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState([30])

  return (
    <div className="w-full border-b bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant="default"
            size="default"
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="size-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="size-4" />
                Start
              </>
            )}
          </Button>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center gap-3 min-w-[280px]">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Speed:
            </span>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={1}
              max={60}
              step={1}
              className="w-40"
            />
            <span className="text-sm font-mono font-semibold w-12 text-right">
              {speed[0]} <span className="text-muted-foreground">gen/s</span>
            </span>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <Select disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">Coming in Phase 5</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="destructive" size="default" className="gap-2">
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>

        <Stats />
      </div>
    </div>
  )
}
