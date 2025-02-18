"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useAnimationControls } from "framer-motion";
import io, { type Socket } from "socket.io-client";

// Custom easing function for realistic spin
const spinEasing = (t: number) => {
  // Start fast, then gradually slow down
  return 1 - Math.pow(1 - t, 4);
};

interface User {
  username: string;
  number: number | null;
  joinTime: number;
}

interface SpinnerProps {
  username: string;
  roomId: string;
}

export default function Spinner({ username, roomId }: SpinnerProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const controls = useAnimationControls();

  const segments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
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
  ];

  useEffect(() => {
    const newSocket = io(
      process.env.NODE_ENV === "production"
        ? "https://your-vercel-app-url.vercel.app"
        : "http://localhost:3001"
    );
    setSocket(newSocket);

    newSocket.emit("joinRoom", roomId, username);

    newSocket.on("userJoined", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
      initializeTimers(updatedUsers);
    });

    newSocket.on("userLeft", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
      initializeTimers(updatedUsers);
    });

    newSocket.on("userChoseNumber", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    newSocket.on("allUsersChosen", (spinResult: number) => {
      handleSpin(spinResult);
    });

    newSocket.on("startNewRound", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
      setSelectedNumber(null);
      setResult(null);
      initializeTimers(updatedUsers);
    });

    newSocket.on("autoSelectedNumber", (number: number) => {
      setSelectedNumber(number);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, username]);

  const initializeTimers = (updatedUsers: User[]) => {
    const newTimers: { [key: string]: number } = {};
    updatedUsers.forEach((user) => {
      newTimers[user.username] = 10;
    });
    setTimers(newTimers);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers: { [key: string]: number } = {};
        let allTimersExpired = true;

        users.forEach((user) => {
          if (user.number === null) {
            const timeLeft = Math.max(
              0,
              10 - Math.floor((Date.now() - user.joinTime) / 1000)
            );
            newTimers[user.username] = timeLeft;
            if (timeLeft > 0) allTimersExpired = false;
          } else {
            newTimers[user.username] = 0;
          }
        });

        if (allTimersExpired) {
          clearInterval(interval);
        }

        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [users]);

  const handleNumberSelection = (number: number) => {
    if (isSpinning || selectedNumber !== null) return;
    setSelectedNumber(number);
    socket?.emit("chooseNumber", roomId, number);
  };

  const handleSpin = useCallback(
    (spinResult: number) => {
      setIsSpinning(true);
      setResult(null);

      const spinRotations = 5;
      const segmentRotation = (spinResult - 1) * 36;
      const newRotation = spinRotations * 360 + segmentRotation + 18; // +18 to point to the center

      controls
        .start({
          rotate: newRotation,
          transition: {
            duration: 5,
            ease: spinEasing,
          },
        })
        .then(() => {
          setIsSpinning(false);
          setResult(spinResult);
          setSelectedNumber(null);
          socket?.emit("roundComplete", roomId);
        });
    },
    [controls, socket, roomId]
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-teal-500 py-8 gap-4">
      <div className="w-full px-8 flex justify-between items-center">
        <div>
          <div className="text-white text-2xl font-bold">
            Welcome, {username}!
          </div>
          <div className="text-white text-xl">Room: {roomId}</div>
        </div>
      </div>
      <div className="text-white text-xl">Spinner Game</div>

      <div className="relative w-64 h-64">
        {/* Spinner Wheel */}
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          animate={controls}
          initial={{ rotate: 0 }}
        >
          {segments.map((number, index) => {
            const angle = index * 36; // 360 / 10 = 36 degrees per segment
            const startAngle = angle * (Math.PI / 180);
            const endAngle = (index + 1) * 36 * (Math.PI / 180);

            const x1 = 50 + 50 * Math.cos(startAngle);
            const y1 = 50 + 50 * Math.sin(startAngle);
            const x2 = 50 + 50 * Math.cos(endAngle);
            const y2 = 50 + 50 * Math.sin(endAngle);

            const pathData = `
              M 50 50
              L ${x1} ${y1}
              A 50 50 0 0 1 ${x2} ${y2}
              Z
            `;

            // Calculate text position - ensure it's in the center of the segment
            const textAngle = (angle + 18) * (Math.PI / 180); // 18 is half of 36 degrees
            const textX = 50 + 35 * Math.cos(textAngle);
            const textY = 50 + 35 * Math.sin(textAngle);

            return (
              <g key={number}>
                <path
                  d={pathData}
                  className={`${colors[index]} transition-colors`}
                  stroke="white"
                  strokeWidth="0.5"
                />
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
            );
          })}
        </motion.svg>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Yellow Triangle Pointer */}
      <div
        className="w-0 h-0 -mt-5 mb-5"
        style={{
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "40px solid #fbbf24",
        }}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberSelection(number)}
              disabled={
                isSpinning || selectedNumber !== null || timers[username] === 0
              }
              className={`w-10 h-10 rounded-full ${
                selectedNumber === number
                  ? "bg-teal-700 text-white"
                  : "bg-white text-teal-700"
              } font-bold text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isSpinning || selectedNumber !== null || timers[username] === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-teal-100"
              }`}
            >
              {number}
            </button>
          ))}
        </div>

        {isSpinning && (
          <div className="text-white text-xl font-bold animate-pulse">
            Spinning...
          </div>
        )}

        {result !== null && !isSpinning && (
          <div className="mt-4 text-white text-xl font-bold">
            {selectedNumber !== null
              ? result === selectedNumber
                ? "You won!"
                : "Try again!"
              : "Spin result:"}{" "}
            {result}
          </div>
        )}

        <div className="mt-4">
          <h2 className="text-white text-xl font-bold mb-2">
            Players in Room:
          </h2>
          <ul className="text-white">
            {users.map((user, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {user.username}{" "}
                  {user.number !== null ? "(Ready)" : "(Not Ready)"}
                </span>
                <span className="ml-4 bg-teal-700 text-white px-2 py-1 rounded-full">
                  {timers[user.username] ?? 0}s
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
