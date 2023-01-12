import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socketIOClient, { Socket } from "socket.io-client";
import RoomApi from "../../api/RoomApi";
import settings from "../../settings";
import ISongInfoMessage from "../../socket/messages/from-server/ISongInfoMessage";
import { RequestorContext } from "../requestor/Requestor";
import SearchYoutubeModal from "../search-youtube-modal/SearchYoutubeModal";
import { ToasterContext } from "../toaster/Toaster";
import IPlaylistState from "./IPlaylistState";

const Room: React.FC = () => {
  const toaster = useContext(ToasterContext);
  const socketRef = useRef<Socket | null>(null);
  const { code } = useParams();
  const [playlistState, setPlaylistState] = useState<IPlaylistState>({
    nowPlaying: "",
    nextUp: "",
  });
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const requestor = useContext(RequestorContext);

  useEffect(() => {
    if (!code) {
      return;
    }

    const socketClient = socketIOClient(settings.socketEndpoint);
    socketRef.current = socketClient;

    socketClient.on("songInfo", (msg: ISongInfoMessage) => {
      setPlaylistState({
        nowPlaying: msg.now_playing || "NOTHING",
        nextUp: msg.next_up || "NOTHING",
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

  return (
    <>
      <h1>Room {code}</h1>
      <h3>Now Playing: {playlistState.nowPlaying}</h3>
      <h3>Next Up: {playlistState.nextUp}</h3>

      <button className="primary" onClick={() => setIsAddSongOpen(true)}>
        Suggest a song
      </button>

      {isAddSongOpen &&
        <SearchYoutubeModal
          onClose={() => setIsAddSongOpen(false)}
          onAddSong={onAddSong}
        />
      }
    </>
  );
};

export default Room;