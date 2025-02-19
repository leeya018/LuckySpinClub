const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-vercel-app-url.vercel.app"
        : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (roomId, username) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: new Map(),
        roundInProgress: false,
        countdownInProgress: false,
      });
    }
    const joinTime = Date.now();
    rooms
      .get(roomId)
      .users.set(socket.id, { username, number: null, joinTime });
    io.to(roomId).emit(
      "userJoined",
      Array.from(rooms.get(roomId).users.values())
    );
  });

  socket.on("chooseNumber", (roomId, number) => {
    const room = rooms.get(roomId);
    if (
      room &&
      room.users.has(socket.id) &&
      !room.roundInProgress &&
      !room.countdownInProgress
    ) {
      room.users.get(socket.id).number = number;
      io.to(roomId).emit("userChoseNumber", Array.from(room.users.values()));
      checkAllUsersChosen(roomId);
    }
  });

  socket.on("spinComplete", (roomId) => {
    console.log("spinComplete");
    const room = rooms.get(roomId);
    if (room) {
      room.roundInProgress = false;
      startCountdown(roomId);
    }
  });

  socket.on("disconnect", () => {
    rooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        if (room.users.size === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit("userLeft", Array.from(room.users.values()));
        }
      }
    });
  });
});

function spinWheel() {
  return Math.floor(Math.random() * 10) + 1;
}

function startCountdown(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    room.countdownInProgress = true;
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      io.to(roomId).emit("countdown", countdown);
      countdown--;
      if (countdown < 0) {
        clearInterval(countdownInterval);
        startNewRound(roomId);
      }
    }, 1000);
  }
}

function startNewRound(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    room.roundInProgress = false;
    room.countdownInProgress = false;
    room.users.forEach((user) => {
      user.number = null;
      user.joinTime = Date.now();
    });
    io.to(roomId).emit("startNewRound", Array.from(room.users.values()));
  }
}

function checkAllUsersChosen(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    const allChosen = Array.from(room.users.values()).every(
      (user) => user.number !== null
    );
    if (allChosen) {
      room.roundInProgress = true;
      const result = spinWheel();
      io.to(roomId).emit("allUsersChosen", result);
    }
  }
}

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
