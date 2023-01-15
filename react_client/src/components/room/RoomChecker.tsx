import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomApi from "../../api/RoomApi";
import { RequestorContext } from "../requestor/Requestor";
import Room from "./Room";

const RoomChecker: React.FC = () => {
  const [doesRoomExist, setDoesRoomExist] = useState<boolean | undefined>(undefined);
  const { code } = useParams();
  const requestor = useContext(RequestorContext);
  const navigate = useNavigate();

  const checkRoomCode = async (abortSignal: AbortSignal) => {
    const req = requestor?.trackRequest(RoomApi.checkRoomExists(code || "", abortSignal));
    req
      ?.then(() => setDoesRoomExist(true))
      .catch(() => setDoesRoomExist(false))
  };

  useEffect(() => {
    if (!code) {
      navigate("/");
      return;
    }

    const controller = new AbortController();

    checkRoomCode(controller.signal);

    return () => {
      controller.abort();
    };
  }, [code]);

  if (doesRoomExist === undefined) {
    return null;
  }

  if (doesRoomExist) {
    return <Room />;
  } else {
    navigate("/");
    return null;
  }
};

export default RoomChecker;