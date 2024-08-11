import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { WindowManager } from '../../src/components/WindowManager';
import { createWindow } from '../../src/Utils/createWindow';
import { Text, Image, Container } from '@react-three/uikit';
import { OrbitControls, Environment } from '@react-three/drei';
import { TabBarWithText } from './components/main';

const TextWindow: React.FC<{ id: string }> = ({ id }) => (
  <Container>
    <Text>This is a text window with ID: {id}</Text>
  </Container>
);

const ImageWindow: React.FC = () => (
  <Container width="100%" height="100%">
    <Image
      src="https://techlead.agency/api/ai/images/66a6cff8fa664a0ed1553a62"
      width={100}
      height={100}
      objectFit="cover"
    />
  </Container>
);

const TransparentWindow: React.FC = () => (
  <Container width="100%" height="100%" padding={20}>
    <Text fontSize={20} color="white">
      This is a transparent window
    </Text>
  </Container>
);

const App: React.FC = () => {
  const addRandomWindow = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const isImageWindow = Math.random() > 0.5;

    const windowConfig = createWindow(
      isImageWindow ? <ImageWindow /> : <TextWindow id={id} />
    );
  };

  const addTransparentWindow = () => {
    createWindow(<TransparentWindow />, { disableBackground: true });
  };

  React.useEffect(() => {
    createWindow(<TabBarWithText />, {
      disableBackground: true,
      title: 'Main',
      disableTitleBar: true,
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
        <Suspense fallback={null}>
          <Environment preset="forest" background={true} />
        </Suspense>
        <WindowManager />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <button onClick={addRandomWindow}>Add Window</button>
        {/* <button onClick={() => tileWindows('grid')}>Tile Grid</button>
          <button onClick={() => tileWindows('around')}>Tile Around</button>
          <button onClick={() => tileWindows('cockpit')}>Tile Cockpit</button>
          <button onClick={resetWindowPositions}>Reset Positions</button> */}
        <button onClick={addTransparentWindow}>Add Transparent Window</button>
      </div>
    </div>
  );
};

export default App;
