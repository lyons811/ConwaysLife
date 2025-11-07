import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ControlPanel } from '@/components/game/ControlPanel'
import { Canvas } from '@/components/game/Canvas'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(30)
  const [clearTrigger, setClearTrigger] = useState(0)

  const handleToggleRunning = () => {
    setIsRunning((prev) => !prev)
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
  }

  const handleClear = () => {
    // Stop simulation and trigger clear
    setIsRunning(false)
    setClearTrigger((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ControlPanel
        isRunning={isRunning}
        speed={speed}
        onToggleRunning={handleToggleRunning}
        onSpeedChange={handleSpeedChange}
        onClear={handleClear}
      />
      <Canvas isRunning={isRunning} speed={speed} clearTrigger={clearTrigger} />
    </div>
  )
}
