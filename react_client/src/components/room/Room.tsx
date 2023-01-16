import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import YouTube, { YouTubePlayer } from "react-youtube";
import socketIOClient, { Socket } from "socket.io-client";
import RoomApi from "../../api/RoomApi";
import nextButtonIcon from "../../media/icons/next-button.svg";
import soundOffIcon from "../../media/icons/sound-off.svg";
import soundOnIcon from "../../media/icons/sound-on.svg";
import settings from "../../settings";
import IParticipantInfoMessage from "../../socket/messages/from-server/IParticipantInfoMessage";
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
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(false);
  const isUserOwner = playlistState.roomOwner.toLowerCase() === username.toLowerCase();
  const [participants, setParticipants] = useState<string[]>([]);

  const onPlayNextSongClick = useCallback(async () => {
    await requestor?.trackRequest(RoomApi.playNext(roomCode));
  }, [roomCode, requestor]);

  useEffect(() => {
    const client = settings.socketEndpoint.indexOf("localhost") > -1
      ? socketIOClient(settings.socketEndpoint, { auth: { name: username, } })
      : socketIOClient("/", { path: settings.socketEndpoint + "/socket.io/", auth: { name: username, } });
    socketRef.current = client;

    socketRef.current.on("songInfo", (msg: ISongInfoMessage) => {
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

    socketRef.current.on("participantInfo", (msg: IParticipantInfoMessage) => {
      setParticipants(Array.from(new Set(msg.participants)));
    });

    socketRef.current.on("error", (msg) => {
      toaster?.showToast({
        message: msg,
        type: "error",
      });
    });

    socketRef.current.emit("message", {
      type: "joinRoom",
      roomCode,
    });

    const closeEvent = () => {
      socketRef.current?.emit("message", {
        type: "leaveRoom",
        roomCode,
      });
      socketRef.current?.disconnect();
    };

    window.addEventListener("beforeunload", closeEvent);

    return () => {
      window.removeEventListener("beforeunload", closeEvent);
      closeEvent();
    };
  }, []);

  const onAddSong = async (title: string, id: string) => {
    await requestor?.trackRequest(RoomApi.addVideo(roomCode, {
      youtubeVideoId: id,
      youtubeVideoTitle: title,
    }));

    toaster?.showToast({
      message: `Suggested ${title}!`,
      type: "success",
    });
  };

  const getRoomTitle = () => {
    return `${playlistState.roomOwner}${playlistState.roomOwner.toLowerCase().endsWith('s')
      ? "'"
      : "'s"
      } Room - ${roomCode}`;
  };

  return (
    <div className="flex-row">
      <div className="flex-col playlist">

        <h1 className="room-title">
          {getRoomTitle()}
        </h1>

        <div className="flex-col-narrow">
          <h3 className="song-title">Now Playing: {decodeHtml(playlistState.nowPlaying?.title || "") || "--"}</h3>
          {playlistState.nowPlaying &&
            <h4 className="song-contributor">Contributed by: {playlistState.nowPlaying.contributor}</h4>
          }
        </div>

        <div className="youtube-embed flex-col">
          {isVideoPlayerVisible &&
            <>
              {playlistState.nowPlaying?.youtubeVideoId !== undefined
                ? (
                  <>
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
                      }}
                      onEnd={() => {
                        if (isUserOwner) {
                          onPlayNextSongClick();
                        }
                      }}
                    />

                    {isUserOwner
                      ? <span>(You are the owner of the room. The playlist will advance to the next song after it finishes playing on this device.)</span>
                      : <span>(You are not the owner of the room. The playlist will advance to the next song after it finishes playing on the owner's device.)</span>
                    }
                  </>
                ) : <span>(Video will be shown when a song starts playing.)</span>
              }
            </>
          }

          <div className="flex-row">
            {isUserOwner &&
              <button
                onClick={onPlayNextSongClick}
                disabled={playlistState.nextUp === undefined}
              >
                <img src={nextButtonIcon} alt="" /> Play next song
              </button>
            }

            <button
              onClick={() => setIsVideoPlayerVisible(isVisible => !isVisible)}
            >
              <img src={isVideoPlayerVisible ? soundOffIcon : soundOnIcon} alt="" /> {isVideoPlayerVisible ? "Hide" : "Show"} video player
            </button>
          </div>
        </div>

        <div className="flex-col-narrow">
          <h3 className="song-title">Next Up: {decodeHtml(playlistState.nextUp?.title || "") || "--"}</h3>
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

      <div className="participants flex-col">
        <h5>Partiers</h5>
        <div className="participant-list flex-col-narrow">
          {participants.map(name =>
            <Participant
              key={name}
              name={name}
              isOwner={name.toLowerCase() === playlistState.roomOwner.toLowerCase()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;

function decodeHtml(html: string) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function Participant({ name, isOwner }: {
  name: string,
  isOwner: boolean,
}) {
  return (
    <span
      className={isOwner ? "owner" : ""}
      title={isOwner ? `${name} (Room Owner)` : name}
    >
      {name}
    </span>
  );
}