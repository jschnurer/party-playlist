import React, { useContext } from "react";
import { ToasterContext } from "../Toaster";
import IToast from "./IToast";
import "./Toast.scss";

interface IToastProps {
  toast: IToast,
}

const Toast: React.FC<IToastProps> = ({
  toast,
}: IToastProps) => {
  const toaster = useContext(ToasterContext);

  const onClickToast = () => toaster?.removeToast(toast);

  return (
    <div className={`toast ${toast.type}`} onClick={onClickToast}>
      {toast.message}
    </div>
  );
};

export default Toast;