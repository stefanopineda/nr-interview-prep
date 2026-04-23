"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface PhaseTimerProps {
  /** Duration in seconds */
  duration: number
  /** Whether the timer is actively counting down */
  running: boolean
  /** Called when timer reaches 0 */
  onExpire: () => void
  /** Called with remaining seconds on each tick */
  onTick?: (remaining: number) => void
  /** Pause timer (e.g. during connection loss) */
  paused?: boolean
}

export default function PhaseTimer({
  duration,
  running,
  onExpire,
  onTick,
  paused,
}: PhaseTimerProps) {
  const [remaining, setRemaining] = useState(duration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const expiredRef = useRef(false)

  // Reset when duration changes (new phase)
  useEffect(() => {
    setRemaining(duration)
    expiredRef.current = false
  }, [duration])

  const tick = useCallback(() => {
    setRemaining((prev) => {
      const next = prev - 1
      if (next <= 0 && !expiredRef.current) {
        expiredRef.current = true
        onExpire()
        return 0
      }
      onTick?.(next)
      return Math.max(0, next)
    })
  }, [onExpire, onTick])

  useEffect(() => {
    if (running && !paused && remaining > 0) {
      intervalRef.current = setInterval(tick, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, paused, remaining, tick])

  // Pause on tab hidden / offline
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const handleOffline = () => setOffline(true)
    const handleOnline = () => setOffline(false)

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  const effectivePaused = paused || offline

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  // Visual urgency
  let colorClass = "text-white"
  let bgClass = ""
  if (remaining <= 10) {
    colorClass = "text-red-400 animate-pulse"
    bgClass = "bg-red-500/10"
  } else if (remaining <= 30) {
    colorClass = "text-yellow-400"
    bgClass = "bg-yellow-500/5"
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${bgClass}`}>
      <div className={`font-mono text-2xl font-bold ${colorClass}`}>
        {timeStr}
      </div>
      {effectivePaused && (
        <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
          PAUSED
        </span>
      )}
      {offline && (
        <span className="text-xs text-orange-400">
          Comms dropped. Re-establishing connection...
        </span>
      )}
    </div>
  )
}
