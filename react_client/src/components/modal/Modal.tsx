import React from "react";
import Portal from "../portal/Portal";
import "./Modal.scss";

interface IModalProps {
  head: string | React.ReactNode,
  body: React.ReactNode,
  foot: React.ReactNode,
}

const Modal: React.FC<IModalProps> = (props) => {
  return (
    <Portal
      className="modal-portal"
    >
      <div
        className="fade"
      >
      </div>

      <div className="modal">
        <div className="head">
          {props.head}
        </div>

        <div className="body">
          {props.body}
        </div>

        <div className="foot flex-row">
          {props.foot}
        </div>
      </div>
    </Portal>
  );
};

export default Modal;