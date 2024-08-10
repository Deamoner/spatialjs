import create from 'zustand';
import { Vector2, Vector3, Euler } from 'three';
import { calculateTilePositions } from '../Utils/tileModes';
import { Camera } from '@react-three/fiber';

export interface WindowInf {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  position: Vector3;
  content: React.ReactNode;
  width: number;
  height: number;
  isMinimized: boolean;
  isFullscreen: boolean;
  scale: Vector3;
  isFocused?: boolean;
  isClosable?: boolean;
  isResizable?: boolean;
  isMovable?: boolean;
  lookAt?: Vector3;
  followCamera?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  disableTiling?: boolean;
  disableTitleBar?: boolean;
  disableIcon?: boolean;
  disableActionBtns?: boolean;
  disableBackground?: boolean;
  disableAdjustSize?: boolean;
  opacity?: number;
  rotation?: Euler;
}

interface WindowStore {
  windows: Record<string, WindowInf>;
  addWindow: (
    window: WindowInf
  ) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInf>) => void;
  setPosition: (id: string, position: Vector3) => void;
  setScale: (id: string, scale: Vector3) => void;
  setRotation: (id: string, rotation: Euler) => void;
  minimize: (id: string) => void;
  maximize: (id: string) => void;
  focus: (id: string) => void;
  unfocus: (id: string) => void;
  close: (id: string) => void;
  tileWindows: (
    mode: 'grid' | 'around' | 'cockpit',
    adjustScale?: boolean
  ) => void;
  resetWindowPositions: () => void;
  originalPositions: Record<string, Vector3>;
  originalScales: Record<string, Vector3>;
  updateWindowSize: (id: string, size: Vector2) => void;
  recalculateTilePositions: () => void;
  currentTileMode: 'grid' | 'around' | 'cockpit' | null;
  camera: Camera | null;
  setCamera: (camera: Camera) => void;
  resetWindowInfrontOfCamera: () => void;
  getPointInFrontOfCamera: (distance: number) => Vector3;
  debug: boolean;
  setDebug: (value: boolean) => void;
  lastWindow: string | undefined;
  setLastWindow: (id: string) => void;
}

const createWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  camera: null,
  setCamera: (camera) => set({ camera }),
  lastWindow: undefined,
  setLastWindow: (id) => set({ lastWindow: id }),
  resetWindowInfrontOfCamera: () => {
    if (get().debug) console.log('resetWindowInfrontOfCamera called');
    set((state) => ({
      windows: Object.fromEntries(
        Object.entries(state.windows).map(([id, window]) => [id, { ...window, position: get().getPointInFrontOfCamera(5) }])
      ),
    }));
    get().tileWindows('cockpit', false);
  },
  addWindow: (window) => {
    if (get().debug) console.log('addWindow called');
    if (!window.position || window.position.equals(new Vector3(0, 0, 0))) {
      window.position = get().getPointInFrontOfCamera(5);
    }
    console.log(window);
    set((state) => ({
      windows: {
        ...state.windows,
        [window.id]: {
          ...window,
          rotation: window.rotation || new Euler(),
        },
      },
    }));
    if(window.disableTiling !== true){
      console.log('onAdd Tile');
      setTimeout(() => {
        get().focus(window.id);
        setTimeout(() => {
          get().unfocus(window.id);
          get().tileWindows('grid', false);
          }, 1200);
        }, 300);
      }
      set((state) => ({
        lastWindow: window.id,
      }));
  },  
  removeWindow: (id) => {
    if (get().debug) console.log('removeWindow called');
    set((state) => {
      const { [id]: _, ...rest } = state.windows;
      return { windows: rest };
    });
  },
  updateWindow: (id, updates) => {
    if (get().debug) console.log('updateWindow called');
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], ...updates },
      },
    }));
  },
  setPosition: (id, position) => {
    if (get().debug) console.log('setPosition called');
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position },
      },
    }));
  },
  setScale: (id, scale) => {
    if (get().debug) console.log('setScale called');
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], scale },
      },
    }));
  },
  setRotation: (id, rotation) => {
    if (get().debug) console.log('setRotation called');
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], rotation },
      },
    }));
  },
  minimize: (id) => {
    if (get().debug) console.log('minimize called');
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;

      const originalPosition =
        state.originalPositions[id] || window.position.clone();
      let newScale = state.originalScales[id] || window.scale.clone();

      // Adjust scale based on current tile mode
      if (state.currentTileMode) {
        const { newScales } = calculateTilePositions(
          Object.keys(state.windows),
          state.currentTileMode,
          state.windows,
          state.camera!,
          true
        );
        newScale = newScales[id] || newScale;
      }

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...window,
            isMinimized: true,
            isFocused: false,
            position: originalPosition,
            scale: newScale,
          },
        },
        originalPositions: {
          ...state.originalPositions,
          [id]: originalPosition,
        },
        originalScales: {
          ...state.originalScales,
          [id]: state.originalScales[id] || window.scale.clone(),
        },
      };
    })
  },
  maximize: (id) => {
    if (get().debug) console.log('maximize called');
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...window,
            isMinimized: false,
          },
        },
      };
    })
  },
  focus: (id) => {
    if (get().debug) console.log('focus called');
    set((state) => {
      const focusedWindow = state.windows[id];
      if (!focusedWindow) return state;

      const originalPositions = { ...state.originalPositions };
      const originalScales = { ...state.originalScales };

      // Store original position and scale if not already stored
      if (!originalPositions[id]) {
        originalPositions[id] = focusedWindow.position.clone();
      }
      if (!originalScales[id]) {
        originalScales[id] = focusedWindow.scale.clone();
      }

      const newPosition = get().getPointInFrontOfCamera(3.5); // Get point 3.5 units in front of camera

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...focusedWindow,
            isFocused: true,
            position: newPosition,
            scale: new Vector3(1, 1, 1),
            rotation: new Euler(), // Reset rotation when focused
          },
        },
        originalPositions,
        originalScales,
      };
    })
  },
  unfocus: (id) => {
    if (get().debug) console.log('unfocus called');
    set((state) => {
      const window = state.windows[id];
      console.log(window)
      if (!window) return state;
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...window,
            isFocused: false,
            position: state.originalPositions[id] || window.position,
            scale: state.originalScales[id] || window.scale,
            rotation: window.rotation, // Keep original rotation when unfocused
          }
        },
      };
    })
  },
  close: (id) => {
    if (get().debug) console.log('close called');
    set((state) => {
      const { [id]: closedWindow, ...rest } = state.windows;
      const newState = { windows: rest };

      // Call the onClose callback if it exists
      if (closedWindow.onClose) {
        closedWindow.onClose();
      }

      // Call the tileWindows function if we're in a tiled mode
      if (state.currentTileMode) {
        setTimeout(() => {
          get().tileWindows(state.currentTileMode, true);
        }, 0);
      }

      return newState;
    });
  },
  tileWindows: (mode, adjustScale = true) => {
    if (get().debug) console.log('tileWindows called');
    set((state) => {
      const windowIds = Object.keys(state.windows).filter(
        (id) => !state.windows[id].isFocused && state.windows[id].disableTiling !== true
      );
      console.log(windowIds);
      const { newPositions, newScales } = calculateTilePositions(
        windowIds,
        mode,
        state.windows,
        state.camera!,
        adjustScale
      );
      const originalPositions = { ...state.originalPositions };
      const originalScales = { ...state.originalScales };

      windowIds.forEach((id) => {
        if (!originalPositions[id]) {
          originalPositions[id] = state.windows[id].position.clone();
        }
        if (!originalScales[id]) {
          originalScales[id] = state.windows[id].scale.clone();
        }
      });

      return {
        windows: Object.fromEntries(
          Object.entries(state.windows).map(([id, window]) => [
            id,
            {
              ...window,
              position: newPositions[id] || window.position,
              scale: adjustScale ? newScales[id] || window.scale : window.scale,
            },
          ])
        ),
        originalPositions,
        originalScales,
        currentTileMode: mode,
      };
    })
  },
  resetWindowPositions: () => {
    if (get().debug) console.log('resetWindowPositions called');
    set((state) => ({
      windows: Object.fromEntries(
        Object.entries(state.windows).map(([id, window]) => [
          id,
          {
            ...window,
            position: state.originalPositions[id] || window.position,
            scale: state.originalScales[id] || window.scale,
          },
        ])
      ),
      originalPositions: {},
      originalScales: {},
      currentTileMode: null,
    }))
  },
  originalPositions: {},
  originalScales: {},
  updateWindowSize: (id, size) => {
    if (get().debug) console.log('updateWindowSize called');
    set((state) => {
      const updatedWindows = {
        ...state.windows,
        [id]: { ...state.windows[id], size: size },
      };
      return { windows: updatedWindows };
    })
  },
  recalculateTilePositions: () => {
    if (get().debug) console.log('recalculateTilePositions called');
    set((state) => {
      const mode = state.currentTileMode || 'grid';
      const windowIds = Object.keys(state.windows).filter(
        (id) => !state.windows[id].isFocused && state.windows[id].disableTiling !== true
      );  
      const { newPositions, newScales } = calculateTilePositions(
        windowIds,
        mode,
        state.windows,
        state.camera!,
        true
      );
      return {
        windows: Object.fromEntries(
          Object.entries(state.windows).map(([id, window]) => [
            id,
            { ...window, position: newPositions[id], scale: newScales[id] },
          ])
        ),
      };
    })
  },
  currentTileMode: null,
  getPointInFrontOfCamera: (distance: number) => {
    if (get().debug) console.log('getPointInFrontOfCamera called');
    const state = get();
    if (!state.camera) {
      console.warn('Camera is not set');
      return new Vector3();
    }

    const cameraDirection = new Vector3();
    state.camera.getWorldDirection(cameraDirection);
    return state.camera.position
      .clone()
      .add(cameraDirection.multiplyScalar(distance));
  },
  debug: true,
  setDebug: (value: boolean) => set({ debug: value }),
}));

export const useWindowStore = createWindowStore;