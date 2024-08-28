import React, { useEffect, useCallback } from "react";
import { Window } from "./BaseWindow";
import { useWindowStore } from "../stores/windowStore";
import { useFrame, useThree } from "@react-three/fiber";

interface WindowManagerProps {
  children?: React.ReactNode;
}

export const WindowManager: React.FC<WindowManagerProps> = () => {
  const { camera, gl } = useThree();
  const windows = useWindowStore((state) => state.windows);
  const setCamera = useWindowStore((state) => state.setCamera);
  const recalculateTilePositions = useWindowStore(
    (state) => state.recalculateTilePositions
  );
  const debug = useWindowStore((state) => state.debug);

  const three = useThree((state) => ({ camera: state.camera }));

  useEffect(() => {
    if (three && three.camera) {
      setCamera(three.camera);
    }
  }, [three, setCamera]);

  // When XR camera is set, set the camera in the store
  let readNextFrame = false;
  useEffect(() => {
    readNextFrame = true;
  }, [camera]);
  useFrame(() => {
    if (!readNextFrame) return;
    if (debug) console.log("camera update");
    setCamera(camera);
    recalculateTilePositions();
    readNextFrame = false;
  });

  return (
    <>
      {Object.entries(windows).map(([id, window]) => (
        <Window
          key={id}
          id={id}
          WindowComponent={window.component}
          windowProps={window.props}
        />
      ))}
    </>
  );
};
