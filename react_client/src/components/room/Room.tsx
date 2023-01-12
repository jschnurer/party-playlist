import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [playlistState, setPlaylistState] = useState<IPlaylistState>({
    roomOwner: "",
  });
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const requestor = useContext(RequestorContext);
  const nameContext = useContext(NameContext);
  const username = nameContext?.username || "";

  useEffect(() => {
    if (!code) {
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
    });

    socketClient.on("error", (msg) => {
      toaster?.showToast({
        message: msg,
        type: "error",
      });
    });

    socketClient.emit("message", {
      type: "joinRoom",
      roomCode: code,
    });

    return () => {
      socketClient.emit("message", {
        type: "leaveRoom",
        roomCode: code,
      });
      socketClient.disconnect();
    };
  }, [code]);

  const onAddSong = async (title: string, id: string) => {
    await requestor?.trackRequest(RoomApi.addVideo(code || "", {
      youtubeVideoId: id,
      youtubeVideoTitle: title,
    }));
  };

  const getRoomTitle = () => {
    return `${playlistState.roomOwner}${playlistState.roomOwner.toLowerCase().endsWith('s')
      ? "'"
      : "'s"
      } Room (${code})`;
  }

  const onPlayNextSongClick = () => {
    
  };

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
        <div className="youtube-embed">
          {playlistState.nowPlaying?.youtubeVideoId !== undefined &&
            <iframe
              width="853"
              height="480"
              src={`https://www.youtube.com/embed/${playlistState.nowPlaying?.youtubeVideoId}?origin=${window.location.origin}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
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