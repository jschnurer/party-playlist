import React, { useState } from "react";
import JoinRoomModal from "../join-room-modal/JoinRoomModal";

const Home: React.FC = () => {
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);

  return (
    <div className="flex-col" style={{ textAlign: "center", alignItems: "center" }}>
      <h1>Time to party!</h1>

      <p>
        If you already have a room code, click JOIN ROOM and use it!
        Otherwise, you can start your own party room using JOIN ROOM and share your room code with others!
      </p>

      <div className="flex-col">
        <button >create room</button>
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