import React, { useState } from "react";
import TextInput from "../inputs/TextInput";
import Modal from "../modal/Modal";

interface IJoinRoomModalProps {
  onClose(): void,
}

const JoinRoomModal: React.FC<IJoinRoomModalProps> = ({
  onClose,
}) => {
  const [roomCode, setRoomCode] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const onSubmit = () => {
    if (!userName.trim()
      || !roomCode.trim()) {
      alert("You're missing something important...");
      return;
    }
  };

  return (
    <Modal
      initialMaxWidth={300}
      allowDrag
      allowResize
      head="Join Party Room"
      body={
        <form className="flex-col join-room-form" onSubmit={onSubmit}>
          <TextInput
            label="Room Code"
            isRequired
            value={roomCode}
            onChange={val => setRoomCode(val)}
            placeholder="Room code..."
            hint="The code of the room to join. Ask the host for this!"
          />

          <TextInput
            label="Your Name"
            isRequired
            value={userName}
            onChange={val => setUserName(val)}
            placeholder="Your name..."
            hint="The name you'd like to be known as while in the party room. When your songs play, this will be the name shown to everyone else in the room."
          />
        </form>
      }
      foot={
        <>
          <button onClick={onClose}>cancel</button>
          <button onClick={onSubmit} className="primary">Okay!</button>
        </>
      }
    />
  );
};

export default JoinRoomModal;