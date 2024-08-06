import { Camera, Vector3, Quaternion, Euler } from 'three';
import { WindowInf } from '../stores/windowStore';

export function calculateTilePositions(
  windowIds: string[],
  mode: 'grid' | 'around' | 'cockpit',
  windows: Record<string, WindowInf>,
  camera: Camera,
  adjustScale: boolean
): {
  newPositions: Record<string, Vector3>;
  newScales: Record<string, Vector3>;
} {
  let newPositions: Record<string, Vector3> = {};
  let newScales: Record<string, Vector3> = {};
  const count = windowIds.length;

  // Helper function to rotate a position based on camera orientation
  const rotatePosition = (position: Vector3): Vector3 => {
    const cameraQuaternion = new Quaternion().setFromEuler(
      new Euler(camera.rotation.x, camera.rotation.y, camera.rotation.z)
    );
    return position.applyQuaternion(cameraQuaternion).add(camera.position);
  };

  if (mode === 'grid') {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const baseZ = -4; // Base distance from the camera
    const spacing = 2; // Spacing between windows

    windowIds.forEach((id, index) => {
      
      const window = windows[id];
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = ((col - (cols - 1) / 2) * spacing) ;
      const y = ((rows - 1) / 2 - row) * spacing;
      const z = baseZ - Math.abs(x) * 0.1 - Math.abs(y) * 0.1; // Curve the grid slightly
      newPositions[id] = rotatePosition(new Vector3(x, y, z));

      if (adjustScale) {
        const targetSize = new Vector3(1.5, 1, 1); // Adjust this to your desired uniform size
        newScales[id] = targetSize.clone();
      }
    });
  } else if (mode === 'around') {
    const radius = 5;
    const verticalOffset = 1; // Offset to raise windows slightly
    windowIds.forEach((id, index) => {
      const angle = (index / count) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const y = verticalOffset;
      const z = -Math.cos(angle) * radius;
      newPositions[id] = rotatePosition(new Vector3(x, y, z));

      if (adjustScale) {
        // Optionally adjust scale for 'around' mode
        const targetSize = new Vector3(1, 1, 1); // Adjust as needed
        newScales[id] = targetSize.clone();
      }
    });
  } else if (mode === 'cockpit') {
    ({ newPositions, newScales } = cockpit(windowIds, windows, camera, adjustScale));
  }

  return { newPositions, newScales };
}

function cockpit(
  windowIds: string[],
  windows: Record<string, WindowInf>,
  camera: Camera,
  adjustScale: boolean
): { newPositions: Record<string, Vector3>; newScales: Record<string, Vector3> } {
  const newPositions: Record<string, Vector3> = {};
  const newScales: Record<string, Vector3> = {};
  // @ts-ignore
  const fov = camera.fov * (Math.PI / 180);
  // @ts-ignore
  const aspectRatio = camera.aspect;
  const baseDistance = 2; // Brought even closer
  const maxWidth = 2 * Math.tan(fov / 2) * baseDistance;
  const maxHeight = maxWidth / aspectRatio;

  const maxCols = Math.ceil(Math.sqrt(windowIds.length));
  const rows = Math.ceil(windowIds.length / maxCols);

  windowIds.forEach((id, index) => {
    const window = windows[id];
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);

    // Calculate scale to fit all windows
    const scaleFactorWidth = maxWidth / (window.width * maxCols);
    const scaleFactorHeight = maxHeight / (window.height * rows);
    const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight, 1) * 0.9; // 10% margin

    newScales[id] = new Vector3(scaleFactor, scaleFactor, scaleFactor);

    const scaledWidth = window.width * scaleFactor;
    const scaledHeight = window.height * scaleFactor;

    // Calculate position
    const x = (col - (maxCols - 1) / 2) * scaledWidth * 1.1;
    const y = ((rows - 1) / 2 - row) * scaledHeight * 1.1;
    const z = -baseDistance - Math.abs(x) * 0.05 - Math.abs(y) * 0.05; // Slight curve

    const position = new Vector3(x, y, z);
    position.applyEuler(camera.rotation);
    newPositions[id] = camera.position.clone().add(position);
  });

  return { newPositions, newScales };
}

