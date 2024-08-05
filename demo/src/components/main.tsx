import { Container, Text } from '@react-three/uikit';
import {
  PowerCircle,
  PanelsTopLeft,
  AppWindow,
  Palette,
  School,
} from '@react-three/uikit-lucide';
import { TabBar, TabBarItem } from './apfel/tab-bar';
import { Input } from './apfel/input';
import React from 'react';
import { Card } from '../../../src/components/card';
import { createWindow } from '../../../src/Utils/createWindow';
import WindowManagement from './WindowManagement';

export const TabBarWithText: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState();

  const [windowLayoutCreated, setWindowLayoutCreated] = React.useState(false);

  const renderContent = () => {
    switch (selectedTab) {
      case '1':
        return <Basics />;
      case '2':
        if (!windowLayoutCreated) {
          createWindow(<WindowLayout />, { title: 'Window Layout' });
          setWindowLayoutCreated(true);
        }
        return null;
      case '3':
        createWindow(<WindowManagement />, { title: 'Window Management' });
        return null;
      case '4':
        return <Text>Label 4 Content</Text>;
      case '5':
        return <Text>Label 5 Content</Text>;
      default:
        return null;
    }
  };

  const Basics: React.FC = () => {
    return (
      <Container flexDirection="column" alignItems="flex-start" padding={20}>
        <Text fontSize={24} marginBottom={20}>
          Creating Your First Window
        </Text>
        <Text marginBottom={10}>
          To create a window using SpatialJS, follow these steps:
        </Text>
        <Text marginBottom={10}>1. Import the necessary components:</Text>
        <Card padding={10} marginBottom={10}>
          <Text fontSize={12}>
            import &#123;WindowManager, createWindow&#125; from '@spatialjs/core';
          </Text>
        </Card>
        <Text marginBottom={10}>2. Create a new window component:</Text>
        <Card padding={10} marginBottom={10}>
          <Text fontSize={12}>
            {`const MyFirstWindow = () => (
      <Text>Hello, SpatialJS!</Text>
  );
  createWindow(<MyFirstWindow />, { title: 'My First Window' });`}
          </Text>
        </Card>
        <Text marginBottom={10}>
          3. Use the WindowManager in your main component:
        </Text>
        <Card padding={10} marginBottom={10}>
          <Text fontSize={12}>
            {`function App() {
    return (
      <Canvas>
        <WindowManager />
      </Canvas>
    );
  }`}
          </Text>
        </Card>
        <Text marginBottom={20}>
          This creates a basic window in your 3D space using SpatialJS!
        </Text>
        <Container
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Card onClick={() => addRandomWindow()} padding={10} margin={10}>
            <Text>Try it</Text>
          </Card>
          <Card onClick={() => setSelectedTab('2')} padding={10} margin={10}>
            <Text>Next</Text>
          </Card>
        </Container>
      </Container>
    );
  };

  const addRandomWindow = () => {
    return createWindow(<Text>Hello, SpatialJS!</Text>, {
      title: 'Random Window',
    });
  };

  const WindowLayout = () => {
    const [inputValue, setInputValue] = React.useState(
      JSON.stringify(
        {
          title: 'Custom Window',
          disableBackground: true,
          disableActionBtns: false,
          disableTitleBar: false,
        },
        null,
        2
      )
    );

    const addCustomWindow = () => {
      try {
        console.log(inputValue);
        const options = JSON.parse(inputValue);
        createWindow(<Text>Window Options Example</Text>, options);
      } catch (error) {
        console.error('Invalid JSON:', error);
        // Optionally, you can show an error message to the user
      }
    };

    return (
      <Container flexDirection="column" alignItems="flex-start" width="100%">
        <Text marginBottom={10}>
          Window Options in SpatialJS allows for flexible customization:
        </Text>
        <Text marginBottom={10}>1. Create a window with custom options:</Text>
        <Card padding={10} marginBottom={10}>
          <Text fontSize={12}>
            {`const customWindow = createWindow(
  <Text>Custom Window Content</Text>,
  {
    title: "Custom Window",
    disableBackground: true,
    disableActionBtns: true,
    disableTitleBar: true
  }
);`}
          </Text>
        </Card>
        <Text marginBottom={10}>
          2. Use UIKit elements for interactive content:
        </Text>
        <Card padding={10} marginBottom={10}>
          <Text fontSize={12}>
            {`const InteractiveWindow = () => {
  const [count, setCount] = useState(0);
  return (
    <Container>
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </Container>
  );
};

createWindow(<InteractiveWindow />, { title: "Interactive Window" });`}
          </Text>
        </Card>
        <Text marginBottom={20}>
          This demonstrates how to create custom windows and use interactive
          UIKit elements!
        </Text>
        <Input
          type="text"
          placeholder="Enter your text"
          multiline={true}
          height={100}
          value={inputValue}
          onValueChange={(e) => setInputValue(e)}
        />
        <Container
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Card onClick={() => addCustomWindow()} padding={10} margin={10}>
            <Text>Try it</Text>
          </Card>
          <Card onClick={() => setSelectedTab('3')} padding={10} margin={10}>
            <Text>Next</Text>
          </Card>
        </Container>
      </Container>
    );
  };

  return (
    <>
      <TabBar value={selectedTab} onValueChange={setSelectedTab}>
        <TabBarItem value="1" icon={<PowerCircle />}>
          <Text>Basics</Text>
        </TabBarItem>
        <TabBarItem value="2" icon={<PanelsTopLeft />}>
          <Text>Window Options</Text>
        </TabBarItem>
        <TabBarItem value="3" icon={<AppWindow />}>
          <Text>Window Management</Text>
        </TabBarItem>
        <TabBarItem value="4" icon={<Palette />}>
          <Text>Theming</Text>
        </TabBarItem>
        <TabBarItem value="5" icon={<School />}>
          <Text>Join</Text>
        </TabBarItem>
      </TabBar>
      {selectedTab && !!renderContent() && <Card>{renderContent()}</Card>}
    </>
  );
};
