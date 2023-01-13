import express from "express";
import IController from "models/controllers/IController";
import RoomDb from "roomDb";
import * as SocketIO from "socket.io";
import { SocketClientManagement } from "socketio/SocketClientManagement";
import ApiError from "validation/ApiError";
import ErrorTypes from "validation/ErrorTypes";

export default function getRoomsController(socketManager: SocketClientManagement): IController {
  const controller = {
    baseRoute: "/rooms",
    router: express.Router(),
  };

  // Creates a new room.
  controller.router.post("", (_, res) => {
    const newRoom = RoomDb.Instance.createNewRoom(
      res.locals.username,
      res.locals.socketServer);

    res.status(201).json({
      roomCode: newRoom.getRoomCode(),
    });
  });

  // Check if a room exists.
  controller.router.get("/:roomCode", (req, res) => {
    const roomCode = req.params.roomCode?.toUpperCase();

    const room = RoomDb.Instance.getRoom(roomCode);

    if (!room) {
      throw new ApiError(`Room '${roomCode}' not found.`, ErrorTypes.NotFound);
    }

    res.status(200).json({
      roomCode: roomCode,
    });
  });

  // Set up the socket io functionality.
  socketManager.addMessageListener({
    messageType: "joinRoom",
    listener: (data: { roomCode?: string }, socket: SocketIO.Socket) => {
      if (!data.roomCode) {
        socket.emit("error",
          "No roomCode specified in data.");
        return;
      }

      const room = RoomDb.Instance.getRoom(data.roomCode);

      if (!room) {
        socket.emit("error", `Room ${data.roomCode} not found.`);
        return;
      } else {
        // Join the room.
        socket.join(`ROOM_${data.roomCode}`);

        room.onUserJoined(socket.id);
        room.emitSocketInfo(socket);
      }
    },
  });

  socketManager.addMessageListener({
    messageType: "leaveRoom",
    listener: (data: any, socket: SocketIO.Socket) => {
      if (!data.roomCode) {
        socket.emit("error",
          "No roomCode specified in data.");
        return;
      }

      const room = RoomDb.Instance.getRoom(data.roomCode);
      if (room) {
        room.onUserDisconnected(socket.id);
      }
      
      // Join stash's room.
      socket.leave(`ROOM_${data.roomCode}`);
    },
  });

  return controller;
}