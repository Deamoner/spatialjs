import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Vector3 } from 'three';
import { WindowInf, useWindowStore } from '../stores/windowStore';
import { Window } from '../components/BaseWindow';

interface CreateWindowOptions
  extends Partial<Omit<WindowInf, 'content'>> {}

export function createWindow(
  content: React.ReactNode,
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
    title: '',
    content,
    width: 300,
    height: 200,
    isMinimized: false,
    isFullscreen: false,
    scale: new Vector3(1, 1, 1),
    isFocused: false,
    opacity: 0.9, 
    followCamera: true,
  };

  const windowConfig: Partial<WindowInf> = {
    ...defaultWindow,
    ...options,
  };

  windowStore.addWindow(windowConfig as WindowInf);
  console.log(`Created new window with title "${windowConfig.title}"`);

  return windowConfig as WindowInf;
}

interface CreateWindowComponentProps extends CreateWindowOptions {
  content: React.ReactNode;
}

export function createWindowComponent({
  content,
  ...options
}: CreateWindowComponentProps): React.ReactElement {
  const windowConfig = createWindow(content, options);
  return <Window key={windowConfig.id} id={windowConfig.id} />;
}
