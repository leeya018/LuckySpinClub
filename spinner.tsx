"use client"

import { useState, useCallback } from "react"
import { motion, useAnimationControls } from "framer-motion"

// Custom easing function for realistic spin
const spinEasing = (t: number) => {
  // Start fast, then gradually slow down
  return 1 - Math.pow(1 - t, 4)
}

export default function Spinner() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const controls = useAnimationControls()

  const segments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const colors = [
    "fill-teal-900",
    "fill-teal-800",
    "fill-teal-700",
    "fill-teal-600",
    "fill-teal-500",
    "fill-teal-400",
    "fill-teal-300",
    "fill-teal-200",
    "fill-teal-100",
    "fill-teal-50",
  ]

  const handleSpin = useCallback(() => {
    if (isSpinning) return

    setIsSpinning(true)
    setResult(null)

    // Choose a random segment (1-10)
    const targetSegment = Math.floor(Math.random() * 10) + 1

    // Calculate exact rotation needed to land on the center of the chosen segment
    const extraSpins = 5 * 360 // 5 full rotations
    const segmentRotation = (targetSegment - 1) * 36 // 360 / 10 = 36 degrees per segment
    const newRotation = extraSpins + segmentRotation

    controls
      .start({
        rotate: newRotation,
        transition: {
          duration: 5,
          ease: spinEasing,
        },
      })
      .then(() => {
        setIsSpinning(false)
        setResult(targetSegment)
      })
  }, [isSpinning, controls])

  return (
    <div className="flex flex-col items-center min-h-screen bg-teal-500 py-8 gap-4">
      <div className="text-white text-2xl font-bold">Spinner Game</div>

      <div className="relative w-64 h-64 flex-1">
        {/* Spinner Wheel */}
        <motion.svg viewBox="0 0 100 100" className="w-full h-full" animate={controls}>
          {segments.map((number, index) => {
            const angle = index * 36 // 360 / 10 = 36 degrees per segment
            const startAngle = angle * (Math.PI / 180)
            const endAngle = (index + 1) * 36 * (Math.PI / 180)

            const x1 = 50 + 50 * Math.cos(startAngle)
            const y1 = 50 + 50 * Math.sin(startAngle)
            const x2 = 50 + 50 * Math.cos(endAngle)
            const y2 = 50 + 50 * Math.sin(endAngle)

            const pathData = `
              M 50 50
              L ${x1} ${y1}
              A 50 50 0 0 1 ${x2} ${y2}
              Z
            `

            // Calculate text position
            const textAngle = (angle + 18) * (Math.PI / 180) // 36 / 2 = 18 (center of segment)
            const textX = 50 + 35 * Math.cos(textAngle)
            const textY = 50 + 35 * Math.sin(textAngle)

            return (
              <g key={number}>
                <path d={pathData} className={`${colors[index]} transition-colors`} stroke="white" strokeWidth="0.5" />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="10"
                  transform={`rotate(${angle + 18}, ${textX}, ${textY})`}
                >
                  {number}
                </text>
              </g>
            )
          })}
        </motion.svg>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Yellow Triangle Pointer - Now below the wheel and pointing up */}
      <div
        className="w-0 h-0 mt-4"
        style={{
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "40px solid #fbbf24",
        }}
      />

      <div className="flex flex-col items-center">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`px-6 py-2 bg-teal-700 text-white rounded-full transition-colors
            ${isSpinning ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-800"}`}
        >
          {isSpinning ? "Spinning..." : "Spin"}
        </button>

        {result && !isSpinning && <div className="mt-4 text-white text-xl font-bold">Landed on: {result}</div>}
      </div>
    </div>
  )
}

