import create from "zustand";
import { Vector2, Vector3, Euler } from "three";
import { calculateTilePositions } from "../Utils/tileModes";
import { Camera } from "@react-three/fiber";

export interface WindowInf {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string | React.ComponentType<any>;
  position: Vector3;
  component: React.ComponentType<any>;
  props: any;
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
  selectable?: boolean;
  disableInitialFocus?: boolean;
  disableTiling?: boolean;
  disableTitleBar?: boolean;
  disableIcon?: boolean;
  disableActionBtns?: boolean;
  disableBackground?: boolean;
  disableAdjustSize?: boolean;
  opacity?: number;
  rotation?: Euler | undefined;
  originalSettings?: {
    position?: Vector3;
    scale?: Vector3;
    rotation?: Euler;
    followCamera?: boolean;
  };
}

export interface WindowStore {
  windows: Record<string, WindowInf>;
  defaultTileDistance: number;
  defaultFocusDistance: number;
  addWindow: (
    window: Omit<WindowInf, "component" | "props"> & {
      component: React.ComponentType<any>;
      props?: any;
    }
  ) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInf>) => void;
  updateWindowProps: (id: string, props: any) => void;
  setPosition: (id: string, position: Vector3) => void;
  setScale: (id: string, scale: Vector3) => void;
  setRotation: (id: string, rotation: Euler) => void;
  minimize: (id: string) => void;
  maximize: (id: string) => void;
  focus: (id: string) => void;
  unfocus: (id: string) => void;
  close: (id: string) => void;
  tileWindows: (
    mode: "grid" | "around" | "cockpit",
    adjustScale?: boolean
  ) => void;
  resetWindowPositions: () => void;
  updateWindowSize: (id: string, size: Vector2) => void;
  recalculateTilePositions: () => void;
  currentTileMode: "grid" | "around" | "cockpit" | null;
  camera: Camera | null;
  setCamera: (camera: Camera) => void;
  resetWindowInfrontOfCamera: () => void;
  getPointInFrontOfCamera: (distance: number) => Vector3;
  debug: boolean;
  setDebug: (value: boolean) => void;
  selectedWindow: string | undefined;
  setSelectedWindow: (id: string | undefined) => void;
}

const createWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  defaultTileDistance: 3,
  defaultFocusDistance: 2.5,
  camera: null,
  setCamera: (camera) => set({ camera }),
  selectedWindow: undefined,
  setSelectedWindow: (id) => set({ selectedWindow: id }),
  resetWindowInfrontOfCamera: () => {
    if (get().debug) console.log("resetWindowInfrontOfCamera called");
    set((state) => ({
      windows: Object.fromEntries(
        Object.entries(state.windows).map(([id, window]) => [
          id,
          { ...window, position: get().getPointInFrontOfCamera(5) },
        ])
      ),
    }));
    get().tileWindows("cockpit", false);
  },
  addWindow: (window) => {
    if (get().debug) console.log("addWindow called");
    if (!window.position || window.position.equals(new Vector3(0, 0, 0))) {
      window.position = get().getPointInFrontOfCamera(
        get().defaultTileDistance
      );
    }
    set((state) => ({
      windows: {
        ...state.windows,
        [window.id]: {
          ...window,
          component: window.component,
          props: window.props || {},
        },
      },
    }));
    if (window.selectable) {
      get().setSelectedWindow(window.id);
    }

    if (window.disableTiling !== true) {
      setTimeout(() => {
        get().focus(window.id);
        setTimeout(() => {
          get().unfocus(window.id);
          get().tileWindows("grid", false);
        }, 1200);
      }, 300);
    }
  },
  removeWindow: (id) => {
    if (get().debug) console.log("removeWindow called");
    set((state) => {
      const { [id]: _, ...rest } = state.windows;
      return { windows: rest };
    });
  },
  updateWindow: (id, updates) => {
    if (get().debug) console.log("updateWindow called");
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], ...updates },
      },
    }));
  },
  updateWindowProps: (id, props) => {
    if (get().debug) console.log("updateWindowProps called");
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          props: { ...state.windows[id].props, ...props },
        },
      },
    }));
  },
  setPosition: (id, position) => {
    if (get().debug) console.log("setPosition called");
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position },
      },
    }));
  },
  setScale: (id, scale) => {
    if (get().debug) console.log("setScale called");
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], scale },
      },
    }));
  },
  setRotation: (id, rotation) => {
    if (get().debug) console.log("setRotation called");
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], rotation },
      },
    }));
  },
  minimize: (id) => {
    if (get().debug) console.log("minimize called");
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;

      // Adjust scale based on current tile mode
      if (state.currentTileMode) {
        const { newScales } = calculateTilePositions(
          Object.keys(state.windows),
          state.currentTileMode,
          state.windows,
          state.camera!,
          true
        );
      }

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...window,
            isMinimized: true,
            isFocused: false,
            ...window.originalSettings,
            originalSettings: undefined,
          },
        },
      };
    });
  },
  maximize: (id) => {
    if (get().debug) console.log("maximize called");
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;

      const originalSettings = {
        ...window.originalSettings,
        position: window.position ? window.position.clone() : undefined,
        scale: window.scale ? window.scale.clone() : undefined,
        rotation: window.rotation ? window.rotation.clone() : undefined,
        followCamera: window.followCamera,
      };

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...window,
            isMinimized: false,
            originalSettings,
          },
        },
      };
    });
  },
  focus: (id) => {
    if (get().debug) console.log("focus called");
    set((state) => {
      const focusedWindow = state.windows[id];
      if (!focusedWindow) return state;

      const originalSettings = {
        ...focusedWindow.originalSettings,
        position: focusedWindow.position.clone(),
        scale: focusedWindow.scale.clone(),
        rotation: focusedWindow.rotation.clone(),
        followCamera: focusedWindow.followCamera,
      };

      const newPosition = get().getPointInFrontOfCamera(
        get().defaultFocusDistance
      );
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...focusedWindow,
            isFocused: true,
            position: newPosition,
            scale: new Vector3(1, 1, 1),
            rotation: new Euler(0, 0, 0),
            followCamera: true,
            originalSettings,
          },
        },
      };
    });
  },
  unfocus: (id) => {
    if (get().debug) console.log("unfocus called");
    set((state) => {
      const window = state.windows[id];
      console.log(window);
      if (!window) return state;
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...window,
            isFocused: false,
            ...window.originalSettings,
          },
        },
      };
    });
  },
  close: (id) => {
    if (get().debug) console.log("close called");
    set((state) => {
      const { [id]: closedWindow, ...rest } = state.windows;
      const newState = { windows: rest };

      if (closedWindow.onClose) {
        closedWindow.onClose();
      }

      if (state.currentTileMode) {
        setTimeout(() => {
          get().tileWindows(state.currentTileMode!, true);
        }, 0);
      }

      return newState;
    });
  },
  tileWindows: (mode, adjustScale = true) => {
    if (get().debug) console.log("tileWindows called");
    set((state) => {
      const windowIds = Object.keys(state.windows).filter(
        (id) =>
          !state.windows[id].isFocused &&
          state.windows[id].disableTiling !== true
      );
      const windowChanges = calculateTilePositions(
        windowIds,
        mode,
        state.windows,
        state.camera!,
        true
      );

      return {
        windows: {
          ...state.windows,
          ...windowChanges,
        },
        currentTileMode: mode,
      };
    });
  },
  resetWindowPositions: () => {
    if (get().debug) console.log("resetWindowPositions called");
    set((state) => ({
      windows: Object.fromEntries(
        Object.entries(state.windows).map(([id, window]) => [
          id,
          {
            ...window,
            ...window.originalSettings,
          },
        ])
      ),
      currentTileMode: null,
    }));
  },
  updateWindowSize: (id, size) => {
    if (get().debug) console.log("updateWindowSize called");
    set((state) => {
      const currentWindow = state.windows[id];
      if (!currentWindow) return state;
      if (
        currentWindow.width &&
        currentWindow.height &&
        currentWindow.width === size.x &&
        currentWindow.height === size.y
      ) {
        return state; // No change, return the current state
      }
      const updatedWindows = {
        ...state.windows,
        [id]: { ...state.windows[id], width: size.x, height: size.y },
      };
      return { windows: updatedWindows };
    });
  },
  recalculateTilePositions: () => {
    if (get().debug) console.log("recalculateTilePositions called");
    set((state) => {
      const mode = state.currentTileMode || "grid";
      const windowIds = Object.keys(state.windows).filter(
        (id) =>
          !state.windows[id].isFocused &&
          state.windows[id].disableTiling !== true
      );
      const windowChanges = calculateTilePositions(
        windowIds,
        mode,
        state.windows,
        state.camera!,
        true
      );

      return {
        windows: {
          ...state.windows,
          ...windowChanges,
        },
      };
    });
  },
  currentTileMode: null,
  getPointInFrontOfCamera: (distance: number) => {
    if (get().debug) console.log("getPointInFrontOfCamera called");
    const state = get();
    if (!state.camera) {
      console.warn("Camera is not set");
      return new Vector3();
    }

    const cameraDirection = new Vector3();
    state.camera.getWorldDirection(cameraDirection);
    return state.camera.position
      .clone()
      .add(cameraDirection.multiplyScalar(distance));
  },
  debug: false,
  setDebug: (value: boolean) => set({ debug: value }),
}));

export const useWindowStore = createWindowStore;
