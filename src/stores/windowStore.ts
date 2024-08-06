import create from 'zustand';
import { Vector2, Vector3 } from 'three';
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
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  disableTitleBar?: boolean;
  disableIcon?: boolean;
  disableActionBtns?: boolean;
  disableBackground?: boolean;
  disableAdjustSize?: boolean;
  opacity?: number; // Added opacity option
}

interface WindowStore {
  windows: Record<string, WindowInf>;
  addWindow: (
    window: Omit<
      WindowInf,
      'disableTitleBar' | 'disableIcon' | 'disableActionBtns'
    > & {
      disableTitleBar?: boolean;
      disableIcon?: boolean;
      disableActionBtns?: boolean;
    }
  ) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowInf>) => void;
  setPosition: (id: string, position: Vector3) => void;
  setScale: (id: string, scale: Vector3) => void;
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
  getPointInFrontOfCamera: (distance: number) => Vector3;
}

const createWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  camera: null,
  setCamera: (camera) => set({ camera }),
  addWindow: (window) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [window.id]: {
          ...window,
          disableTitleBar: window.disableTitleBar ?? false,
          disableIcon: window.disableIcon ?? false,
          disableActionBtns: window.disableActionBtns ?? false,
        },
      },
    })),
  removeWindow: (id) =>
    set((state) => {
      const { [id]: _, ...rest } = state.windows;
      return { windows: rest };
    }),
  updateWindow: (id, updates) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], ...updates },
      },
    })),
  setPosition: (id, position) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position },
      },
    })),
  setScale: (id, scale) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], scale },
      },
    })),
  minimize: (id) =>
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
    }),

  maximize: (id) =>
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
    }),

  focus: (id) =>
    set((state) => {
      const focusedWindow = state.windows[id];
      const originalPositions = { ...state.originalPositions };
      const originalScales = { ...state.originalScales };
      // Check if the window is already focused
      

      // Store original position and scale if not already stored
      if (!originalPositions[id]) {
        originalPositions[id] = focusedWindow.position.clone();
      }
      if (!originalScales[id]) {
        originalScales[id] = focusedWindow.scale.clone();
      }

      const newPosition = get().getPointInFrontOfCamera(3); // Get point 2 units in front of camera

      return {
        windows: Object.fromEntries(
          Object.entries(state.windows).map(([windowId, window]) => [
            windowId,
            {
              ...window,
              isFocused: windowId === id,
              position:
                windowId === id
                  ? newPosition
                  : originalPositions[windowId] || window.position,
              scale: windowId === id ? new Vector3(1, 1, 1) : window.scale,
            },
          ])
        ),
        originalPositions,
        originalScales,
      };
    }),
  unfocus: (id) =>
    set((state) => {
      const window = state.windows[id];
      if (!window) return state;
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...window,
            isFocused: false,
            position: state.originalPositions[id] || window.position,
            scale: state.originalScales[id] || window.scale,
          }
        },
      };
    }),
  close: (id) => 
    set((state) => {
      const { [id]: closedWindow, ...rest } = state.windows;
      const newState = { windows: rest };

      // Recalculate positions if we're in a tiled mode
      if (state.currentTileMode) {
        const remainingWindowIds = Object.keys(rest);
        const { newPositions, newScales } = calculateTilePositions(
          remainingWindowIds,
          state.currentTileMode,
          rest,
          state.camera!,
          true
        );

        newState.windows = Object.fromEntries(
          Object.entries(rest).map(([windowId, window]) => [
            windowId,
            {
              ...window,
              position: newPositions[windowId] || window.position,
              scale: newScales[windowId] || window.scale,
            },
          ])
        );
      }

      return newState;
    }),
  tileWindows: (mode, adjustScale = true) =>
    set((state) => {
      const windowIds = Object.keys(state.windows).filter(
        (id) => !state.windows[id].isFocused
      );
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
    }),
  resetWindowPositions: () =>
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
    })),
  originalPositions: {},
  originalScales: {},
  updateWindowSize: (id, size) =>
    set((state) => {
      const updatedWindows = {
        ...state.windows,
        [id]: { ...state.windows[id], size: size },
      };
      return { windows: updatedWindows };
    }),
  recalculateTilePositions: () =>
    set((state) => {
      const mode = state.currentTileMode || 'grid';
      const { newPositions, newScales } = calculateTilePositions(
        Object.keys(state.windows),
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
    }),
  currentTileMode: null,
  getPointInFrontOfCamera: (distance: number) => {
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
}));

export const useWindowStore = createWindowStore;