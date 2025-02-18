"use client"

import { useState } from "react"
import Spinner from "./spinner"
import Login from "./login"

export default function Home() {
  const [username, setUsername] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)

  const handleLogin = (name: string, room: string) => {
    setUsername(name)
    setRoomId(room)
  }

  if (!username || !roomId) {
    return <Login onLogin={handleLogin} />
  }

  return <Spinner username={username} roomId={roomId} />
}

