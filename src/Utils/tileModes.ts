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
    const baseDistance = 3; // Base distance from the camera
    const windowSpacing = 0.5; // Fixed spacing between windows
    const maxHorizontalWindows = 5; // Maximum number of windows in a row

    const cameraDirection = camera.getWorldDirection(new Vector3());
    const cameraRight = new Vector3().crossVectors(cameraDirection, camera.up).normalize();
    const cameraUp = new Vector3().crossVectors(cameraRight, cameraDirection).normalize();

    windowIds.forEach((id, index) => {
      let x, y, z;

      if (index === 0) {
        // Place the first window directly in front of the camera
        x = 0;
        y = 0;
        z = -baseDistance;
      } else {
        const row = Math.floor(index / maxHorizontalWindows);
        const col = index % maxHorizontalWindows;

        x = (col - Math.floor(maxHorizontalWindows / 2)) * windowSpacing;
        y = -row * windowSpacing;
        z = -baseDistance - row * windowSpacing * 0.5; // Slight curve
      }

      const position = new Vector3(x, y, z);
      position.applyAxisAngle(cameraUp, camera.rotation.y);
      position.applyAxisAngle(cameraRight, -camera.rotation.x);
      newPositions[id] = camera.position.clone().add(position);

      if (adjustScale) {
        const targetSize = 100; // Adjust this value to change the size of windows
        const scaleX = targetSize / windows[id].width;
        const scaleY = targetSize / windows[id].height;
        const uniformScale = Math.min(scaleX, scaleY);
        newScales[id] = new Vector3(scaleX, scaleY, uniformScale);
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
