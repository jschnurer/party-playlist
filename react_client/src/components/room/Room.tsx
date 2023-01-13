import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import YouTube, { YouTubePlayer } from "react-youtube";
import socketIOClient, { Socket } from "socket.io-client";
import RoomApi from "../../api/RoomApi";
import settings from "../../settings";
import ISongInfoMessage from "../../socket/messages/from-server/ISongInfoMessage";
import { NameContext } from "../name-input/NameValidator";
import { RequestorContext } from "../requestor/Requestor";
import SearchYoutubeModal from "../search-youtube-modal/SearchYoutubeModal";
import { ToasterContext } from "../toaster/Toaster";
import IPlaylistState from "./IPlaylistState";
import "./Room.scss";

const Room: React.FC = () => {
  const toaster = useContext(ToasterContext);
  const socketRef = useRef<Socket | null>(null);
  const { code } = useParams();
  const roomCode = code || "";
  const [playlistState, setPlaylistState] = useState<IPlaylistState>({
    roomOwner: "",
  });
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const requestor = useContext(RequestorContext);
  const nameContext = useContext(NameContext);
  const username = nameContext?.username || "";
  const youtubePlayer = useRef<YouTubePlayer>(null);

  const onPlayNextSongClick = useCallback(async () => {
    await requestor?.trackRequest(RoomApi.playNext(roomCode));
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode
      || !toaster) {
      return;
    }

    const socketClient = socketIOClient(settings.socketEndpoint);
    socketRef.current = socketClient;

    socketClient.on("songInfo", (msg: ISongInfoMessage) => {
      setPlaylistState({
        nowPlaying: msg.nowPlaying,
        nextUp: msg.nextUp,
        roomOwner: msg.roomOwner || "???",
      });

      if (msg.nowPlaying
        && msg.nowPlaying.youtubeVideoId !== youtubePlayer.current?.getVideoData().video_id) {
        youtubePlayer.current?.loadVideoById(msg.nowPlaying.youtubeVideoId);
      } else if (youtubePlayer.current?.getPlayerState() === 0
        && msg.nextUp) {
        onPlayNextSongClick();
      }
    });

    socketClient.on("error", (msg) => {
      toaster?.showToast({
        message: msg,
        type: "error",
      });
    });

    socketClient.emit("message", {
      type: "joinRoom",
      roomCode,
    });

    return () => {
      socketClient.emit("message", {
        type: "leaveRoom",
        roomCode,
      });
      socketClient.disconnect();
      console.log("disconnect socket");
    };
  }, [roomCode, onPlayNextSongClick]);

  const onAddSong = async (title: string, id: string) => {
    await requestor?.trackRequest(RoomApi.addVideo(roomCode, {
      youtubeVideoId: id,
      youtubeVideoTitle: title,
    }));
  };

  const getRoomTitle = () => {
    return `${playlistState.roomOwner}${playlistState.roomOwner.toLowerCase().endsWith('s')
      ? "'"
      : "'s"
      } Room - ${roomCode}`;
  }

  return (
    <div className="flex-col">

      <h1 className="room-title">
        {getRoomTitle()}
      </h1>

      <div className="flex-col-narrow">
        <h3 className="song-title">Now Playing: {playlistState.nowPlaying?.title || "--"}</h3>
        {playlistState.nowPlaying &&
          <h4 className="song-contributor">Contributed by: {playlistState.nowPlaying.contributor}</h4>
        }
      </div>

      {username === playlistState.roomOwner &&
        <div className="youtube-embed flex-col">
          {playlistState.nowPlaying?.youtubeVideoId !== undefined &&
            <YouTube
              iframeClassName="youtube-iframe"
              videoId={playlistState.nowPlaying.youtubeVideoId}
              opts={{
                height: 390,
                width: 640,
                playerVars: {
                  autoplay: 1,
                },
              }}
              onReady={event => {
                youtubePlayer.current = event.target;
                (window as any).player = event.target;
              }}
              onEnd={() => {
                onPlayNextSongClick();
              }}
            />
          }

          <div className="flex-row">
            <button
              onClick={onPlayNextSongClick}
              disabled={playlistState.nextUp === undefined}
            >
              Play next song
            </button>
          </div>
        </div>
      }

      <div className="flex-col-narrow">
        <h3 className="song-title">Next Up: {playlistState.nextUp?.title || "--"}</h3>
        {playlistState.nextUp &&
          <h4 className="song-contributor">Contributed by: {playlistState.nextUp.contributor}</h4>
        }
      </div>

      <button className="primary" onClick={() => setIsAddSongOpen(true)}>
        Suggest a song
      </button>

      {isAddSongOpen &&
        <SearchYoutubeModal
          onClose={() => setIsAddSongOpen(false)}
          onAddSong={onAddSong}
        />
      }
    </div>
  );
};

export default Room;