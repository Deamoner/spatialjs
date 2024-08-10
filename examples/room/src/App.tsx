import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { WindowManager } from '../../../src/components/WindowManager';
import { createWindow } from '../../../src/Utils/createWindow';
import { OrbitControls, Environment } from '@react-three/drei';
import { XR, createXRStore, useXRPlanes, useXRMeshes } from '@react-three/xr'
import { Room } from './components/Room';
import * as THREE from 'three';
import MusicPlayer from './components/MusicPlayer';
import { useWindowStore } from '../../../src/stores/windowStore';

const store = createXRStore();

function CameraSetup() {
  const { camera } = useThree();
  const [hasLooked, setHasLooked] = useState(false);

  useFrame(() => {
    
    if (!hasLooked) {
      console.log('look at');
      camera.lookAt(-2.277328282883502, 3.4900737569082216, -6.3410601854324335);
      setHasLooked(true);
    }
  });
  return null;
}

const App: React.FC = () => {
  const windowStore = useWindowStore();


  useEffect(() => {
    
    createWindow(<MusicPlayer />, {
      id: 'music-chooser',
      title: 'Music Chooser',
      width: 400,
      height: 400,
      disableBackground: true,
      followCamera: false,
      disableTiling: true,
      position: new THREE.Vector3(-2.277328282883502, 3.4900737569082216, -6.3410601854324335),
    });
    
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [-3, 0.5, 0], rotation: new THREE.Euler(-0.12698932461142853, 0.5458307802768984, 0.06618362225811597)}} >
      <CameraSetup />
        <OrbitControls
          enableZoom={true}
          
          rotateSpeed={0.75}
          
        />
        <XR store={store}>
          <Environment preset="sunset" background={true} />
          <WindowManager />
          <Room />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
        </XR>
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <button onClick={() => store.enterAR()}>Enter AR</button>
        <button onClick={() => console.log(windowStore.camera)}>Get Camera Info</button>
      </div>
    </div>
  );
};

export default App;