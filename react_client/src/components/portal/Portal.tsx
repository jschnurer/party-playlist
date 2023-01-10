import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface IPortalProps {
  className?: string,
  children?: React.ReactNode,
}

const Portal: React.FC<IPortalProps> = ({
  className,
  children,
}) => {
  const [div, setDiv] = useState<HTMLDivElement | undefined>(undefined);
  const portalRoot = useContext(PortalContext);

  useEffect(() => {
    const div = document.createElement("div");
    if (className) {
      div.setAttribute("class", className);
    }
    setDiv(div);
  }, [className]);

  useEffect(() => {
    if (div) {
      portalRoot?.appendChild(div);
    }

    return () => {
      if (div) {
        portalRoot?.removeChild(div);
      }
    }
  }, [div, portalRoot]);

  if (div) {
    return ReactDOM.createPortal(children, div);
  } else {
    return null;
  }
};

const PortalContext = React.createContext<HTMLDivElement | null>(null);

export default Portal;
export { PortalContext };
