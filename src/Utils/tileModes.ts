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
  const newPositions: Record<string, Vector3> = {};
  const newScales: Record<string, Vector3> = {};
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
    const baseZ = -5; // Base distance from the camera
    const spacing = 2; // Spacing between windows

    windowIds.forEach((id, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = (col - (cols - 1) / 2) * spacing;
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
    const sphereRadius = 3; // Base radius of the sphere around the user
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

    // Calculate total area of all windows
    const totalArea = windowIds.reduce(
      (sum, id) => sum + windows[id].width * windows[id].height,
      0
    );
    const averageArea = totalArea / count;

    // Calculate a uniform scale factor to fit all windows within a certain view
    const scaleFactor = Math.sqrt(averageArea / totalArea);

    // Define viewable angles (e.g., 120 degrees horizontally and 90 degrees vertically)
    const horizontalFOV = (Math.PI * 5) / 9; // 100 degrees
    const verticalFOV = (Math.PI * 7) / 18; // 70 degrees

    windowIds.forEach((id, index) => {
      const window = windows[id];
      const windowArea = window.width * window.height;
      const sizeRatio = Math.sqrt(windowArea / averageArea) * scaleFactor;

      // Calculate the position within the viewable angles
      const theta =
        (index % Math.ceil(Math.sqrt(count))) *
          (horizontalFOV / Math.ceil(Math.sqrt(count))) -
        horizontalFOV / 2;
      const phi =
        Math.floor(index / Math.ceil(Math.sqrt(count))) *
          (verticalFOV / Math.ceil(Math.sqrt(count))) -
        verticalFOV / 2;

      const x = Math.sin(theta) * Math.cos(phi) * sphereRadius;
      const y = Math.sin(phi) * sphereRadius;
      const z = -Math.cos(theta) * Math.cos(phi) * sphereRadius;

      newPositions[id] = rotatePosition(new Vector3(x, y, z));

      if (adjustScale) {
        newScales[id] = new Vector3(sizeRatio, sizeRatio, sizeRatio);
      }
    });
  }

  // Adjust positions to prevent overlapping
  const minDistance = 1; // Minimum distance between window centers
  for (let i = 0; i < windowIds.length; i++) {
    for (let j = i + 1; j < windowIds.length; j++) {
      const pos1 = newPositions[windowIds[i]];
      const pos2 = newPositions[windowIds[j]];
      const distance = pos1.distanceTo(pos2);
      if (distance < minDistance) {
        const midpoint = pos1.clone().add(pos2).multiplyScalar(0.5);
        const direction1 = pos1.clone().sub(midpoint).normalize();
        const direction2 = pos2.clone().sub(midpoint).normalize();
        const adjustment = (minDistance - distance) / 2;
        pos1.add(direction1.multiplyScalar(adjustment));
        pos2.add(direction2.multiplyScalar(adjustment));
      }
    }
  }

  return { newPositions, newScales };
}
