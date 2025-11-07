import { createFileRoute } from '@tanstack/react-router'
import { ControlPanel } from '@/components/game/ControlPanel'
import { Canvas } from '@/components/game/Canvas'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <ControlPanel />
      <Canvas />
    </div>
  )
}
