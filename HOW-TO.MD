# SpatialJS: How to Use

SpatialJS is a powerful library for creating and managing 3D windows in a spatial environment using React and Three.js. This guide will walk you through the basic usage of SpatialJS to create and manage windows in your 3D space.

## Table of Contents

1. [Installation](#installation)
2. [Creating Your First Window](#creating-your-first-window)
3. [Managing Single Windows](#managing-single-windows)
4. [Working with Multiple Windows](#working-with-multiple-windows)

## Installation

First, install SpatialJS and its peer dependencies:

```bash
npm install @spatialjs/core react @react-three/fiber three
```

## Creating Your First Window

To create your first window, import the `Window` component from `spatialjs/react` and use it to render your window.

```jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/uikit';
import { Window } from '@spatialjs/core';
function App() {
  return (
    <Canvas>
      <Window
        title="My First Window"
        position={[0, 0, -5]}
        width={2}
        height={1.5}
      >
        <Text>Hello, SpatialJS!</Text>
      </Window>
    </Canvas>
  );
}
export default App;
```

In this example, we're creating a single window with a title, position, and dimensions. The `WindowManager` component is responsible for managing all windows in the scene.

## Managing Single Windows

You can create and manage windows directly via props in JSX. Here's an example of how to create a window with more advanced properties:

```jsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Window, WindowManager } from '@spatialjs/core';
import { Text } from '@react-three/uikit';
function App() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Canvas>
      <WindowManager>
        <Window
          title="Advanced Window"
          position={[0, 0, -5]}
          width={3}
          height={2}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onMinimize={() => console.log('Window minimized')}
          onMaximize={() => console.log('Window maximized')}
        >
          <Text>
            This window has more advanced properties and event handlers.
          </Text>
        </Window>
      </WindowManager>
    </Canvas>
  );
}
export default App;
```

This example demonstrates how to use various window properties and event handlers to create a more interactive window.

## Working with Multiple Windows

SpatialJS allows you to create and manage multiple windows in your 3D space. You can also use different tiling methods to organize your windows. Here's an example of how to work with multiple windows:

```jsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Window, WindowManager, useTileWindows } from 'spatialjs';
function App() {
  const [windows, setWindows] = useState([
    { id: 1, title: 'Window 1', content: 'Content 1' },
    { id: 2, title: 'Window 2', content: 'Content 2' },
    { id: 3, title: 'Window 3', content: 'Content 3' },
  ]);
  const { addWindow, tileWindows, resetWindowPositions } = useWindowStore(
    (state) => ({
      addWindow: state.addWindow,
      tileWindows: state.tileWindows,
      resetWindowPositions: state.resetWindowPositions,
    })
  );

  const addRandomWindow = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const isImageWindow = Math.random() > 0.5;
    const width = Math.floor(Math.random() * (400 - 200 + 1) + 200);
    const height = Math.floor(Math.random() * (300 - 150 + 1) + 150);

    addWindow({
      id,
      title: isImageWindow ? `Image Window ${id}` : `Text Window ${id}`,
      position: new Vector3(Math.random() * 8 - 4, Math.random() * 8 - 4, -5),
      scale: new Vector3(1, 1, 1),
      content: isImageWindow ? <ImageWindow /> : <TextWindow id={id} />,
      width,
      height,
      isMinimized: false,
      isFullscreen: false,
      isFocused: false,
    });
  };

  React.useEffect(() => {
    // Add 20 random windows
    for (let i = 0; i < 200; i++) {
      addRandomWindow();
    }
  }, []);

  return (
    <Canvas>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
      <Background />
      <WindowManager />
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}
export default App;
```
