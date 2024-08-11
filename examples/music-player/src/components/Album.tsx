import { Container, Text, Image } from '@react-three/uikit'
import { Album } from './Albums'
import { ComponentPropsWithoutRef } from 'react'
import { colors } from '../theme'
import { useThree, useLoader } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function AlbumArtwork({
  album,
  aspectRatio = 'portrait',
  width,
  height,
  ...props
}: {
  album: Album
  aspectRatio?: 'portrait' | 'square'
} & Omit<ComponentPropsWithoutRef<typeof Container>, 'aspectRatio'>) {

  return (
    <Container flexShrink={0} flexDirection="column" gap={12} {...props} padding={10}>
      <Image
        borderRadius={6}
        src={album.cover}
        width={width}
        height={height}
        objectFit="cover"
        aspectRatio={aspectRatio === 'portrait' ? 3 / 4 : 1}
      />
      <Container flexDirection="column" gap={4} justifyContent="center" alignItems="center">
        <Text fontWeight="medium" fontSize={8} lineHeight="100%">
          {album.name}
        </Text>
        <Text fontSize={8} lineHeight={16} color={colors.mutedForeground}>
          {album.artist}
        </Text>
      </Container>
    </Container>
  )
}