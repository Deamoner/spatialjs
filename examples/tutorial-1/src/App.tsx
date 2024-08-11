import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { WindowManager } from '../../../src/components/WindowManager';
import { createWindow } from '../../../src/Utils/createWindow';
import { OrbitControls, Environment } from '@react-three/drei';
import MusicPlayer from './components/MusicPlayer';
import SimpleWindow from './components/SimpleWindow';

const App: React.FC = () => {
  useEffect(() => {
    createWindow(<SimpleWindow title="Hello World" content="This is a simple window" />, {
      title: 'Music Player',
      width: 400,
      height: 400,
      disableBackground: true,
    });
  }, []);
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        <Environment preset="sunset" background={true} />
        <WindowManager />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
      </Canvas>
    </div>
  );
};

export default App;
