import { useEffect, useRef } from 'react'

/**
 * Custom hook for running the Game of Life simulation loop
 * Uses requestAnimationFrame for smooth performance and delta time accumulation
 * for consistent generation timing regardless of frame rate
 */
export function useGameLoop(onStep: () => void, speed: number, isRunning: boolean) {
  const animationFrameRef = useRef<number | null>(null)
  const lastStepTimeRef = useRef<number>(0)
  const accumulatedTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!isRunning) {
      // Cancel animation frame if simulation is stopped
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      // Reset timing when stopped
      lastStepTimeRef.current = 0
      accumulatedTimeRef.current = 0
      return
    }

    // Calculate step interval in milliseconds based on speed (generations per second)
    const stepInterval = 1000 / speed

    // Game loop using requestAnimationFrame
    const loop = (currentTime: number) => {
      // Initialize lastStepTime on first frame
      if (lastStepTimeRef.current === 0) {
        lastStepTimeRef.current = currentTime
      }

      // Calculate delta time since last frame
      const deltaTime = currentTime - lastStepTimeRef.current
      lastStepTimeRef.current = currentTime

      // Accumulate time
      accumulatedTimeRef.current += deltaTime

      // Execute step(s) if enough time has accumulated
      while (accumulatedTimeRef.current >= stepInterval) {
        onStep()
        accumulatedTimeRef.current -= stepInterval
      }

      // Continue loop
      animationFrameRef.current = requestAnimationFrame(loop)
    }

    // Start the loop
    animationFrameRef.current = requestAnimationFrame(loop)

    // Cleanup on unmount or when dependencies change
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [onStep, speed, isRunning])
}
