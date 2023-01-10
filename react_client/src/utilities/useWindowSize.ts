import { useEffect, useState } from "react";

// These measurements are also in QoFVariables.scss.
// Please ensure that they always match.
export const largeScreenMaxWidth = 1024;
export const mediumScreenMaxWidth = 800;
export const smallScreenMaxWidth = 500;
export const tinyScreenMaxWidth = 400;

export interface IWindowSize {
  width: number | undefined,
  height: number | undefined,
}

export default function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<IWindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}