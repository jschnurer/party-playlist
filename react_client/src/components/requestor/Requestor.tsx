import React, { useContext } from "react";
import Portal from "../portal/Portal";
import Spinner from "../spinner/Spinner";
import IRequestorState from "./IRequestorState";
import "./Requestor.scss";

const Requestor: React.FC = () => {
  const state = useContext(RequestorContext);

  if (!state?.ongoingRequests.length) {
    return null;
  }

  return (
    <Portal>
      <div className="requestor">
        <div className="fade"></div>
        <Spinner />
      </div>
    </Portal>
  );
};

const RequestorContext = React.createContext<IRequestorState | null>(null);

export default Requestor;
export { RequestorContext };