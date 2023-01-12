import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomApi from "../../api/RoomApi";
import JoinRoomModal from "../join-room-modal/JoinRoomModal";
import { RequestorContext } from "../requestor/Requestor";

const Home: React.FC = () => {
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
  const requestor = useContext(RequestorContext);
  const navigate = useNavigate();

  const createRoom = async () => {
    const newRoomCode = await requestor?.trackRequest(RoomApi.createRoom());

    if (!newRoomCode) {
      return;
    }

    navigate(`/room/${newRoomCode}`);
  };

  return (
    <div className="flex-col" style={{ textAlign: "center", alignItems: "center" }}>
      <h1>Time to party!</h1>

      <div className="flex-col">
        <button onClick={() => createRoom()}>create room</button>
        <button className="primary" onClick={() => setIsJoinRoomOpen(true)}>join room</button>
      </div>

      {isJoinRoomOpen &&
        <JoinRoomModal
          onClose={() => setIsJoinRoomOpen(false)}
        />
      }
    </div>
  );
};

export default Home;