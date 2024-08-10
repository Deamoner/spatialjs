import React, { useEffect } from 'react';
import { Window } from './BaseWindow';
import { useWindowStore } from '../stores/windowStore';
import { useThree } from '@react-three/fiber';

interface WindowManagerProps {
  children?: React.ReactNode;
}

export const WindowManager: React.FC<WindowManagerProps> = () => {
  const windows = useWindowStore((state) => state.windows);
  const setCamera = useWindowStore((state) => state.setCamera);
  const resetWindowInfrontOfCamera = useWindowStore((state) => state.resetWindowInfrontOfCamera);

  const three = useThree((state) => ({ camera: state.camera }));

  useEffect(() => {
    if (three && three.camera) {
      setCamera(three.camera);
    }
  }, [three, setCamera]);

  // When XR camera is set, set the camera in the store
  useEffect(() => {
    setCamera(three.camera);
    //resetWindowInfrontOfCamera();
  }, [three.camera]);

  return (
    <>
      {Object.entries(windows).map(([id, window]) => (
        <Window key={id} id={id} />
      ))}
    </>
  );
};
