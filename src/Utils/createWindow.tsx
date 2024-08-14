import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Euler, Vector3 } from "three";
import { WindowInf, useWindowStore } from "../stores/windowStore";
import { Window } from "../components/BaseWindow";

interface CreateWindowOptions extends Partial<Omit<WindowInf, "content">> {}

export function createWindow(
  component: React.ComponentType<any>,
  options: CreateWindowOptions = {}
): WindowInf {
  const windowStore = useWindowStore.getState();
  const existingWindow = Object.values(windowStore.windows).find(
    (window) => window.id === options.id
  );

  if (existingWindow) {
    console.log(
      `Window with title "${options.title}" already exists. Returning existing window.`
    );
    return existingWindow;
  }

  const windowId = uuidv4();
  const defaultWindow: Partial<WindowInf> = {
    id: windowId,
    position: new Vector3(0, 0, 0),
    title: "",
    width: 300,
    height: 200,
    component: component,
    isMinimized: false,
    isFullscreen: false,
    scale: new Vector3(1, 1, 1),
    rotation: new Euler(),
    isFocused: false,
    opacity: 0.9,
    followCamera: true,
  };

  const windowConfig: Partial<WindowInf> = {
    ...defaultWindow,
    ...options,
  };

  windowStore.addWindow(windowConfig as WindowInf);
  // console.log(`Created new window with title "${windowConfig.title}"`);

  return windowConfig as WindowInf;
}

interface CreateWindowComponentProps extends CreateWindowOptions {
  component: React.ComponentType<any>;
}

export function createWindowComponent({
  component,
  ...options
}: CreateWindowComponentProps): React.ReactElement {
  const windowConfig = createWindow(component, options);
  return (
    <Window
      key={windowConfig.id}
      id={windowConfig.id}
      WindowComponent={component}
      windowProps={options.props}
    />
  );
}
