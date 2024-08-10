import { DefaultProperties } from '@react-three/uikit'
import React, { ComponentPropsWithoutRef } from 'react'
import { Color, MeshPhongMaterial } from 'three'
import * as THREE from 'three'

export class GlassMaterial extends MeshPhongMaterial {
  constructor() {
    super({
      specular: '#555',
      shininess: 300,
      reflectivity: 0.75,
      side: THREE.DoubleSide,
      
    })
  }
}

function hsl(h: number, s: number, l: number) {
  return new Color().setHSL(h / 360, s / 100, l / 100, 'srgb')
}

export const colors = {
  foreground: hsl(0, 0, 100),
  background: hsl(0, 0, 0),
  card: hsl(0, 0, 53),
  cardBorder: hsl(0, 0, 65),
  cardForeground: hsl(0, 0, 100),
  accent: hsl(210, 100, 52),
  accentForeground: hsl(0, 0, 100),
  bad: hsl(0, 100, 52),
  highlight: hsl(100, 100, 52),
  mutedForeground: hsl(240, 3.8, 80),
  text: hsl(0, 0, 100),
  //
}

export function Defaults(props: ComponentPropsWithoutRef<typeof DefaultProperties>) {
  return (
    <DefaultProperties
      scrollbarColor={colors.background}
      scrollbarBorderRadius={4}
      scrollbarOpacity={0.3}
      color={colors.background}
      fontWeight="medium"
      {...props}
    />
  )
}
