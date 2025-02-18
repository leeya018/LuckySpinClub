"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { debounce } from "lodash"

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
]

const SpinnerGame = () => {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [result, setResult] = useState<number | null>(null)

  const spinWheel = useCallback(
    debounce(() => {
      const spinDuration = 10000 // 10 seconds
      const spinRotations = Math.floor(Math.random() * 5) + 10 // 10-14 full rotations
      const targetRotation = spinRotations * 360 + Math.floor(Math.random() * 360)

      setSpinning(true)
      setRotation(targetRotation)

      setTimeout(() => {
        setSpinning(false)
        const winningNumber = 10 - Math.floor(((targetRotation % 360) / 360) * 10)
        setResult(winningNumber)
      }, spinDuration)
    }, 200),
    [],
  )

  const handleSpin = () => {
    if (selectedNumber !== null && !spinning) {
      setResult(null)
      spinWheel()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Spinner Game</h1>
      <div className="relative w-64 h-64 mb-8">
        <motion.div
          className="w-full h-full rounded-full overflow-hidden"
          style={{ originX: "50%", originY: "50%" }}
          animate={{ rotate: rotation }}
          transition={{ duration: 10, ease: "easeInOut" }}
        >
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className={`absolute w-full h-full ${colors[index]}`}
              style={{
                clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((index * 36 * Math.PI) / 180)}% ${
                  50 + 50 * Math.sin((index * 36 * Math.PI) / 180)
                }%, ${50 + 50 * Math.cos(((index + 1) * 36 * Math.PI) / 180)}% ${
                  50 + 50 * Math.sin(((index + 1) * 36 * Math.PI) / 180)
                }%)`,
              }}
            >
              <span
                className="absolute text-white font-bold"
                style={{
                  left: `${50 + 40 * Math.cos(((index + 0.5) * 36 * Math.PI) / 180)}%`,
                  top: `${50 + 40 * Math.sin(((index + 0.5) * 36 * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {10 - index}
              </span>
            </div>
          ))}
        </motion.div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-black"></div>
      </div>
      <div className="mb-4">
        <label htmlFor="number-select" className="mr-2">
          Select a number (1-10):
        </label>
        <select
          id="number-select"
          className="border rounded p-1"
          value={selectedNumber || ""}
          onChange={(e) => setSelectedNumber(Number(e.target.value))}
          disabled={spinning}
        >
          <option value="">Choose a number</option>
          {[...Array(10)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        onClick={handleSpin}
        disabled={selectedNumber === null || spinning}
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {result !== null && (
        <div className="mt-4 text-xl font-bold">
          {result === selectedNumber ? "You won!" : "Try again!"} The result is: {result}
        </div>
      )}
    </div>
  )
}

export default SpinnerGame

