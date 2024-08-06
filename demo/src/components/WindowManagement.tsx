import React from 'react';
import { useWindowStore } from '../../../src/stores/windowStore';
import { Vector3 } from 'three';
import { Container, Text } from '@react-three/uikit';
import { Card } from '../../../src/components/card';
import { X, ArrowUp, Maximize2, Minimize2 } from '@react-three/uikit-lucide';;

const WindowManagement: React.FC = () => {
  // 1. Initiating useWindowStore
  const {
    windows,
    removeWindow,
    setScale,
    tileWindows,
    resetWindowPositions,
    focus,
  } = useWindowStore();

  return (
    <Container flexDirection="column" alignItems="flex-start" padding={20}>
      <Text fontSize={24} marginBottom={20}>Window Management Examples</Text>

      {/* Updated: Active Windows with management buttons */}
      <Text fontSize={18} marginBottom={10}>Active Windows:</Text>
      <Container flexDirection="column" width="100%" marginBottom={20} height={300} overflow="scroll">
        {Object.entries(windows).map(([id, window]) => (
          <Container key={id} flexDirection="row" alignItems="center" marginBottom={5} height={50}>
            <Text flexGrow={1}>{window.title ? window.title : window.id}</Text>
            <Card onClick={() => removeWindow(id)} padding={5} margin={2}>
              <X />
            </Card>
            <Card onClick={() => focus(id)} padding={5} margin={2}>
              <ArrowUp />
            </Card>
            <Card onClick={() => setScale(id, new Vector3(1.2, 1.2, 1.2))} padding={5} margin={2}>
              <Maximize2  />
            </Card>
            <Card onClick={() => setScale(id, new Vector3(0.8, 0.8, 0.8))} padding={5} margin={2}>
              <Minimize2 />
            </Card>
          </Container>
        ))}
      </Container>

      {/* 3. Window Management Actions */}
      <Text fontSize={18} marginBottom={10}>Window Management Actions:</Text>
      <Container flexDirection="row" flexWrap="wrap" width={500}>
        {/* Tiling windows */}
        <Card onClick={() => tileWindows('grid', true)} padding={10} margin={5}>
          <Text>Tile Windows (Grid)</Text>
        </Card>
        <Card onClick={() => tileWindows('around', true)} padding={10} margin={5}>
          <Text>Tile Windows (Around)</Text>
        </Card>
        <Card onClick={() => tileWindows('cockpit', false)} padding={10} margin={5}>
          <Text>Tile Windows (Cockpit)</Text>
        </Card>

        {/* Resetting window positions */}
        <Card onClick={resetWindowPositions} padding={10} margin={5}>
          <Text>Reset Window Positions</Text>
        </Card>
      </Container>
    </Container>
  );
};

export default WindowManagement;