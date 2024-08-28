import { Camera, Vector3, Quaternion, Euler } from "three";
import { WindowInf } from "../stores/windowStore";

export function calculateTilePositions(
  windowIds: string[],
  mode: "grid" | "around" | "cockpit",
  windows: Record<string, WindowInf>,
  camera: Camera,
  adjustScale: boolean
): Record<string, WindowInf> {
  let newWindows: Record<string, WindowInf> = {};
  const count = windowIds.length;

  // Helper function to rotate a position based on camera orientation
  const rotatePosition = (position: Vector3): Vector3 => {
    const cameraQuaternion = new Quaternion().setFromEuler(
      new Euler(camera.rotation.x, camera.rotation.y, camera.rotation.z)
    );
    return position.applyQuaternion(cameraQuaternion).add(camera.position);
  };

  if (mode === "grid") {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const baseZ = -3; // Base distance from the camera
    const spacing = 2; // Spacing between windows

    windowIds.forEach((id, index) => {
      const window = windows[id];
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = (col - (cols - 1) / 2) * spacing;
      const y = ((rows - 1) / 2 - row) * spacing;
      const z = baseZ - Math.abs(x) * 0.1 - Math.abs(y) * 0.1; // Curve the grid slightly
      newWindows[id] = {
        ...windows[id],
        position: rotatePosition(new Vector3(x, y, z)),
        scale: adjustScale ? new Vector3(1.5, 1, 1) : windows[id].scale,
      };
    });
  } else if (mode === "around") {
    const radius = 5;
    const verticalOffset = 1; // Offset to raise windows slightly
    windowIds.forEach((id, index) => {
      const angle = (index / count) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const y = verticalOffset;
      const z = -Math.cos(angle) * radius;
      newWindows[id] = {
        ...windows[id],
        position: rotatePosition(new Vector3(x, y, z)),
        scale: adjustScale ? new Vector3(1, 1, 1) : windows[id].scale,
      };
    });
  } else if (mode === "cockpit") {
    newWindows = cockpit(windowIds, windows, camera, adjustScale);
  }

  return newWindows;
}

function cockpit(
  windowIds: string[],
  windows: Record<string, WindowInf>,
  camera: Camera,
  adjustScale: boolean
): Record<string, WindowInf> {
  const newWindows: Record<string, WindowInf> = {};
  // @ts-ignore
  const fov = camera.fov * (Math.PI / 180);
  // @ts-ignore
  const aspectRatio = camera.aspect;
  const baseDistance = 5; // Brought even closer
  const maxWidth = 2 * Math.tan(fov / 2) * baseDistance;
  const maxHeight = maxWidth / aspectRatio;

  const maxCols = Math.ceil(Math.sqrt(windowIds.length));
  const rows = Math.ceil(windowIds.length / maxCols);

  windowIds.forEach((id, index) => {
    const window = windows[id];
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);

    // Calculate scale to fit all windows
    // const scaleFactorWidth = maxWidth / (window.width * maxCols);
    // const scaleFactorHeight = maxHeight / (window.height * rows);
    // const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight, 1) * 0.9; // 10% margin

    newWindows[id] = {
      ...windows[id],
      position: camera.position.clone(),
      scale: new Vector3(1, 1, 1),
    };
  });

  return newWindows;
}
