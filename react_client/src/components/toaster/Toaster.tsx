import React, { useContext } from "react";
import Portal from "../portal/Portal";
import IToasterState from "./IToasterState";
import Toast from "./toast/Toast";
import "./Toaster.scss";

const Toaster: React.FC = () => {
  const state = useContext(ToasterContext);

  if (!state?.toasts.length) {
    return null;
  }

  return (
    <Portal>
      <div className="toaster">
        {state.toasts.map((t, ix) =>
          <Toast
            toast={t}
            key={(t.timestamp || ix).toString() + "|" + t.message}
          />
        )}
      </div>
    </Portal>
  );
};

const ToasterContext = React.createContext<IToasterState | null>(null);

export default Toaster;
export { ToasterContext };