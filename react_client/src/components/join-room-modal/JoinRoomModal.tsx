import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomApi from "../../api/RoomApi";
import TextInput from "../inputs/TextInput";
import Modal from "../modal/Modal";
import { RequestorContext } from "../requestor/Requestor";
import { ToasterContext } from "../toaster/Toaster";

interface IJoinRoomModalProps {
  onClose(): void,
}

const JoinRoomModal: React.FC<IJoinRoomModalProps> = ({
  onClose,
}) => {
  const requestor = useContext(RequestorContext);
  const formRef = useRef<HTMLFormElement>(null);
  const [roomCode, setRoomCode] = useState<string>("");
  const toaster = useContext(ToasterContext);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roomCode.trim()) {
      toaster?.showToast({
        message: "What room do you want to join?",
        type: "error",
      });
      return;
    }

    const existence = await requestor?.trackRequest(RoomApi.checkRoomExists(roomCode.trim()));

    if (existence?.exists) {
      navigate(`/room/${existence.roomCode}`);
    }
  };

  return (
    <Modal
      initialMaxWidth={300}
      allowDrag
      allowResize
      head="Join Party Room"
      body={
        <form
          className="flex-col join-room-form"
          onSubmit={onSubmit}
          ref={formRef}
        >
          <TextInput
            label="Room Code"
            isRequired
            value={roomCode}
            onChange={val => setRoomCode(val)}
            placeholder="Room code..."
            hint="The code of the room to join. Ask the host for this!"
            maxLength={5}
            autoFocus={true}
          />
        </form>
      }
      foot={
        <>
          <button onClick={onClose}>cancel</button>
          <button
            onClick={() => formRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))}
            className="primary"
          >
            Okay!
          </button>
        </>
      }
    />
  );
};

export default JoinRoomModal;