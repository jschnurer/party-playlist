import React, { useCallback, useEffect, useRef, useState } from "react";
import useWindowSize, { smallScreenMaxWidth } from "../../utilities/useWindowSize";
import Portal from "../portal/Portal";
import "./Modal.scss";

interface IModalProps {
  /** The node to render at the top of the modal. */
  head: string | React.ReactNode,
  /** The node to render in the scrolling body area of the modal. */
  body: React.ReactNode,
  /** The node to render at the bottom of the modal. */
  foot: React.ReactNode,
  /** The initial max width of the modal before the user resizes it (if applicable). */
  initialMaxWidth?: number,
  /** Allows the modal to be resized by the user by clicking and dragging the bottom right corner of the modal. */
  allowResize?: boolean,
  /** Allows the modal to be moved around the screen by clicking and dragging anywhere in the header. */
  allowDrag?: boolean,
}

interface IChangeVector {
  x: number,
  y: number,
  isActive: boolean,
}

const Modal: React.FC<IModalProps> = (props) => {
  const winSize = useWindowSize();
  const winHeight = winSize.height || 0;
  const winWidth = winSize.width || 0;

  const [dragVector, setDragVector] = useState<IChangeVector>({ x: 0, y: 0, isActive: false, });
  const [resizeVector, setResizeVector] = useState<IChangeVector>({ x: 0, y: 0, isActive: false, });
  const [initialModalSize, setInitialModalSize] = useState<IChangeVector>({ x: 0, y: 0, isActive: false });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.style.position = "relative";
      modalRef.current.style.top = "initial";
      modalRef.current.style.left = "initial";
      modalRef.current.style.width = "initial";
      modalRef.current.style.height = "initial";
    }
  }, [winHeight, winWidth, modalRef]);

  const onDragMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // If modal is fullscreen, disallow.
    if (winWidth <= smallScreenMaxWidth
      || !modalRef.current) {
      return;
    }

    modalRef.current.classList.add("no-text-select");

    setDragVector({
      x: e.screenX - modalRef.current.getBoundingClientRect().left,
      y: e.screenY - modalRef.current.getBoundingClientRect().top,
      isActive: true,
    });
  }, [setDragVector, winWidth, modalRef]);

  const onResizeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // If modal is fullscreen, disallow.
    if (winWidth <= smallScreenMaxWidth
      || !modalRef.current) {
      return;
    }

    setResizeVector({
      x: e.pageX,
      y: e.pageY,
      isActive: true,
    });

    modalRef.current.className += " no-text-select";

    setInitialModalSize({
      x: modalRef.current.getBoundingClientRect().width,
      y: modalRef.current.getBoundingClientRect().height,
      isActive: false,
    });
  }, [setResizeVector, winWidth, modalRef, setInitialModalSize]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) {
      return;
    }

    if (dragVector.isActive) {
      modalRef.current.style.left = e.screenX - dragVector.x + "px";
      modalRef.current.style.top = e.screenY - dragVector.y + "px";
      modalRef.current.style.position = "fixed";
    } else if (resizeVector.isActive) {
      const rect = modalRef.current.getBoundingClientRect();

      modalRef.current.style.maxWidth = "initial";
      modalRef.current.style.top = rect.top + "px";
      modalRef.current.style.left = rect.left + "px";
      modalRef.current.style.width = initialModalSize.x + (e.pageX - resizeVector.x) + "px";
      modalRef.current.style.height = initialModalSize.y + (e.pageY - resizeVector.y) + "px";
      modalRef.current.style.position = "fixed";
    }
  }, [dragVector, resizeVector, modalRef, initialModalSize]);

  const onMouseUp = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.className = modalRef.current.className.replace(" no-text-select", "");
    }

    setDragVector({
      x: 0,
      y: 0,
      isActive: false,
    });
    setResizeVector({
      x: 0,
      y: 0,
      isActive: false,
    });
  }, [setDragVector, setResizeVector, modalRef]);

  const getOptionalMouseEvent = (mouseEvent: (e: React.MouseEvent<HTMLDivElement>) => void) => {
    if (props.allowDrag
      || props.allowResize) {
      return mouseEvent;
    }
  };

  return (
    <Portal
      className="modal-portal"
    >
      <div
        className="fade"
        onMouseMove={getOptionalMouseEvent(onMouseMove)}
        onMouseUp={getOptionalMouseEvent(onMouseUp)}
      ></div>

      <div
        className="modal"
        ref={modalRef}
        onMouseMove={getOptionalMouseEvent(onMouseMove)}
        onMouseUp={getOptionalMouseEvent(onMouseUp)}
        style={props.initialMaxWidth
          ? { maxWidth: props.initialMaxWidth }
          : undefined
        }
      >
        <div
          className={`head ${props.allowDrag ? "draggable" : ""}`}
          onMouseDown={props.allowDrag
            ? onDragMouseDown
            : undefined
          }
          onMouseMove={getOptionalMouseEvent(onMouseMove)}
          onMouseUp={getOptionalMouseEvent(onMouseUp)}
        >
          {props.head}
        </div>

        <div className="body">
          {props.body}
        </div>

        <div className={`foot flex-row ${props.allowResize ? "corner-padding" : ""}`}>
          {props.foot}

          {props.allowResize &&
            <div
              className="corner-grip"
              draggable={false}
              onMouseDown={props.allowResize
                ? onResizeMouseDown
                : undefined
              }
              onMouseMove={getOptionalMouseEvent(onMouseMove)}
              onMouseUp={getOptionalMouseEvent(onMouseUp)}
            >
              ∴
            </div>
          }
        </div>
      </div>
    </Portal>
  );
};

export default Modal;