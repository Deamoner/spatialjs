import { Container, DefaultProperties } from '@react-three/uikit';
import React, { ComponentPropsWithoutRef } from 'react';
import { GlassMaterial, colors } from '../theme';

export function Card({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Container>) {
  return (
    <Container
      backgroundColor={
        props.backgroundColor ? props.backgroundColor : colors.card
      }
      backgroundOpacity={0.9}
      borderColor={props.borderColor ? props.borderColor : colors.cardBorder}
      borderOpacity={0.8}
      borderWidth={4}
      borderBend={0.3}
      panelMaterialClass={GlassMaterial}
      borderRadius={30}
      {...props}
    >
      <DefaultProperties color={colors.cardForeground}>
        {children}
      </DefaultProperties>
    </Container>
  );
}
