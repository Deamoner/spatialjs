import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { useWindowStore } from '../../../../src/stores/windowStore'

export function Room() {
  const { nodes } = useGLTF('/level-react-draco.glb')
  const { camera } = useThree()
  const [position, setPosition] = useState([0, -0.45, 0])
  const { setPosition: setWindowPosition, setRotation: setWindowRotation, lastWindow } = useWindowStore();

  useEffect(() => {
    setPosition([camera.position.x, camera.position.y, camera.position.z])
  }, [camera])

  const handleClick = useCallback((event) => {
    event.stopPropagation()
    console.log(event);
    // Calculate surface normal at the click point
    const face = event.face
    const normal = face.normal.clone()
    normal.transformDirection(event.object.matrixWorld)

    // Calculate a point slightly in front of the clicked point along the surface normal
    const offsetDistance = 0.1 // Adjust this value as needed
    const offsetPoint = event.point.clone().add(normal.multiplyScalar(offsetDistance))

    // Calculate rotation to face outward from the surface
    const rotationMatrix = new THREE.Matrix4().lookAt(normal, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0))
    const rotation = new THREE.Euler().setFromRotationMatrix(rotationMatrix)

    console.log('Room clicked!', offsetPoint)
    if (lastWindow) {
      setWindowPosition(lastWindow, offsetPoint)
      setWindowRotation(lastWindow, rotation)
      useWindowStore.getState().updateWindow(lastWindow, { 
        disableTiling: true,
        position: offsetPoint,
        rotation: rotation
      });
    }
  }, [setWindowPosition, setWindowRotation, lastWindow])

  const handlePointerOver = useCallback(() => {
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'default'
  }, [])

  return (
    <mesh
      scale={4.5}
      geometry={nodes.Level.geometry}
      material={nodes.Level.material}
      position={[position[0] - 1.75, -position[1], -position[2]]}
      rotation={[Math.PI / 2, -Math.PI / 9, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  )
}