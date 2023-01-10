import express, { Request } from "express";
import IController from "models/controllers/IController";
import RoomDb from "roomDb";
import ApiError from "validation/ApiError";
import ErrorTypes from "validation/ErrorTypes";

export default function getSongsController(): IController {
  const controller = {
    baseRoute: "/rooms",
    router: express.Router(),
  };

  // Add a song to the playlist
  controller.router.post("/:roomCode/songs", (req: Request, res) => {
    const roomCode = req.params.roomCode?.toUpperCase();
    const room = RoomDb.Instance.getRoom(roomCode);

    if (!room) {
      throw new ApiError(`Room '${roomCode}' not found.`, ErrorTypes.NotFound);
    }

    const videoId = req.body?.youtubeVideoId?.toString().trim();
    const videoTitle = req.body?.youtubeVideoTitle?.toString().trim();

    if (!videoId) {
      throw new ApiError("youtubeVideoId is a required body property.", ErrorTypes.BadRequest);
    }

    if (!videoTitle) {
      throw new ApiError("youtubeVideoTitle is a required body property.", ErrorTypes.BadRequest);
    }

    // Add the song to the room. The room will handle informing everyone.
    room.addSong({
      addedTimestamp: new Date(),
      contributor: res.locals.username,
      wasPlayed: false,
      youtubeVideoId: videoId,
      title: videoTitle,
    });

    res.status(200).json({
      nowPlaying: room.getCurrentSong(),
      nextUp: room.getNextSong(),
    });
  });

  // Used by the owner to skip to the next song (or when current song finishes).
  controller.router.post("/:roomCode/songs/playNext", (req, res) => {
    const roomCode = req.params.roomCode?.toUpperCase();
    const room = RoomDb.Instance.getRoom(roomCode);

    if (!room) {
      throw new ApiError(`Room '${roomCode}' not found.`, ErrorTypes.NotFound);
    }

    if (res.locals.username !== room.getOwner()) {
      throw new ApiError(`Only the owner of the room can skip to the next song.`, ErrorTypes.Forbidden);
    }

    const nextSong = room.playNextSong();

    res.status(200).json({
      nowPlaying: nextSong,
      nextUp: room.getNextSong(),
    });
  });

  return controller;
}