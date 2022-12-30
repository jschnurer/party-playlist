import { getUserInfoFromRequest } from "authentication/authentication";
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
    const user = getUserInfoFromRequest(req);

    console.log(req.params);

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
      contributedByUUId: user.uuid,
      contributorHandle: user.name,
      wasPlayed: false,
      youtubeVideoId: videoId,
      title: videoTitle,
    });

    res.sendStatus(200);
  });

  // Used by the owner to skip to the next song (or when current song finishes).
  controller.router.post("/:roomCode/songs/playNext", (req, res) => {
    const user = getUserInfoFromRequest(req);
    const roomCode = req.params.roomCode?.toUpperCase();
    const room = RoomDb.Instance.getRoom(roomCode);

    if (!room) {
      throw new ApiError(`Room '${roomCode}' not found.`, ErrorTypes.NotFound);
    }

    if (user.uuid !== room.getOwnerUUId()) {
      throw new ApiError(`Only the owner of the room can skip to the next song.`, ErrorTypes.Forbidden);
    }

    const nextSong = room.playNextSong();

    res.status(200).json({
      nowPlaying: nextSong,
    });
  });

  return controller;
}