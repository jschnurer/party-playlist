import React, { useState } from "react";
import TextInput from "../inputs/TextInput";
import Modal from "../modal/Modal";
import "./JoinRoomModal.scoped.scss";

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
      head="Join Party Room"
      body={
        <form className="join-room-form flex-col">
          <TextInput
            label="Room Code"
            isRequired
            onChange={val => setRoomCode(val)}
            placeholder="Room code..."
            hint="The code of the room to join. Ask the host for this!"
            value={roomCode}
          />

          <TextInput
            label="Your Name"
            isRequired
            onChange={val => setUserName(val)}
            placeholder="Your name..."
            hint="The name you'd like to be known as while in the party room. When your songs play, this will be the name shown to everyone else in the room."
            value={userName}
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