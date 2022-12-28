import express from "express";
import asyncHandler from "express-async-handler";
import IController from "models/controllers/IController";
import Playlist from "models/playlist/Playlist";
import * as SocketIO from "socket.io";
import { SocketClientManagement } from "socketio/SocketClientManagement";

export default function getPlaylistsController(socketManager: SocketClientManagement): IController {
  const controller = {
    baseRoute: "/playlists",
    router: express.Router(),
  };

  let rooms: { [name: string]: Playlist };

  const doesRoomExist = (roomCode: string | undefined) => Object.keys(rooms).some(x => x === roomCode?.toUpperCase());
  const getRoomCode = (req: any) => req.params.roomCode?.toUpperCase();

  // Checks if a room currently exists or not.
  controller.router.get("/:roomCode", (req, res) => {
    const roomCode = getRoomCode(req);

    if (!doesRoomExist(roomCode)) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(200);
  });

  // Creates a new room.
  controller.router.post("", (req, res) => {
    // Generate new 5-digit codes until a unique one is created.
    let roomCode = generateNewRoomCode(5);
    while (Object.keys(rooms).indexOf(roomCode) > -1) {
      roomCode = generateNewRoomCode(5);
    }

    rooms[roomCode] = new Playlist(roomCode);
  });

  // Add a song to the playlist
  controller.router.post("/:roomCode/songs", asyncHandler(async (req, res) => {
    const roomCode = getRoomCode(req);
    const room = rooms[roomCode];

    if (!room) {
      res.sendStatus(404);
      return;
    }

    if (!req.body) {
      res.status(400).send("A body is required and must contain 'youtubeVideoId'.");
      return;
    }

    const videoId = req.body.youtubeVideoId?.toString().trim();

    if (!videoId) {
      res.status(400).send("'youtubeVideoId' is a required body property.");
      return;
    }

    // TODO: Get the current user's contributor UUID and Handle from the 
    // request header (somehow).

    room.addSong({
      addedTimestamp: new Date(),
      contributedByUUId: "",
      contributorHandle: "Guest",
      wasPlayed: false,
      youtubeVideoId: req.params.youtubeVideoId,
    });

    // Whenever a song is added, let everyone know what the next song will be.
    tellRoomAboutNextSong(room,
      res.locals.socketServer);
  }));

  function tellRoomAboutNextSong(room: Playlist,
    socketServer: SocketClientManagement) {
    const nextSong = room.getNextSong();

    socketEmit(socketServer,
      room.getRoomCode(),
      "next_up",
      { youtubeVideoId: nextSong?.youtubeVideoId });
  }

  // Set up the socket io functionality.
  socketManager.addMessageListener({
    messageType: "joinRoom",
    listener: (data: any, socket: SocketIO.Socket) => {
      if (!data.roomCode) {
        socket.emit("error",
          "No roomCode specified in data.");
        return;
      }

      // Join stash's room.
      socket.join(`ROOM_${data._id}`);
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

      // Join stash's room.
      socket.leave(`ROOM_${data.roomCode}`);
    },
  });

  return controller;
}

function socketEmit(socketServer: SocketClientManagement,
  roomCode: string,
  event: string,
  data: any,) {
  socketServer
    .io
    .to(`ROOM_${roomCode}`)
    .emit(event, {
      data,
    });
}

function generateNewRoomCode(length: number) {
  return Array(length).fill('x').join('').replace(/x/g, () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
  }).toUpperCase();
}