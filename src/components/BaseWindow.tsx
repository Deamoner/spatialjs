// src/components/BaseWindow.tsx
import React, { useRef, useEffect } from 'react';
import { Vector3, Group, Vector2 } from 'three';
import { a } from '@react-spring/three';
import { useSpring } from '@react-spring/core';
import { Root, Container, Text, Image } from '@react-three/uikit';
import { useThree, useFrame } from '@react-three/fiber';
import { Card } from './card';
import { colors } from '../theme';
import { useWindowStore } from '../stores/windowStore';

interface BaseWindowProps {
  id: string;
  disableTitleBar?: boolean;
  disableIcon?: boolean;
  disableActionBtns?: boolean;
  disableBackground?: boolean;
}

export const Window: React.FC<BaseWindowProps> = ({
  id,
  disableTitleBar: propDisableTitleBar,
  disableIcon: propDisableIcon,
  disableActionBtns: propDisableActionBtns,
  disableBackground: propDisableBackground,
}) => {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();

  const {
    title,
    subtitle,
    icon,
    position,
    scale,
    isMinimized,
    isFocused,
    disableTitleBar: storeDisableTitleBar,
    disableIcon: storeDisableIcon,
    disableActionBtns: storeDisableActionBtns,
    disableBackground: storeDisableBackground,
    content,
    setPosition,
    setScale,
    minimize,
    maximize,
    focus,
    close,
    currentTileMode,
  } = useWindowStore((state) => ({
    ...state.windows[id],
    setPosition: state.setPosition,
    setScale: state.setScale,
    minimize: state.minimize,
    maximize: state.maximize,
    focus: state.focus,
    close: state.close,
    currentTileMode: state.currentTileMode,
  }));

  // Use prop values if provided, otherwise fall back to store values
  const disableTitleBar = propDisableTitleBar ?? storeDisableTitleBar;
  const disableIcon = propDisableIcon ?? storeDisableIcon;
  const disableActionBtns = propDisableActionBtns ?? storeDisableActionBtns;
  const disableBackground = propDisableBackground ?? storeDisableBackground;

  const { spring } = useSpring({
    spring: position.toArray(),
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const { spring: springScale } = useSpring({
    spring: scale.toArray(),
    config: { mass: 1, tension: 280, friction: 60 },
  });

  useEffect(() => {
    if (groupRef && groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  }, [camera.position]);

  useFrame(() => {
    if (groupRef && groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  const handleTitleBarClick = () => {
    if (currentTileMode === 'cockpit') {
      focus(id);
    }
  };

  return (
    <a.group ref={groupRef} position={spring} scale={springScale}>
      <Root>
        <Container flexDirection="column" alignItems="center" width="100%">
          <Card
            castShadow
            width="100%"
            height="100%"
            flexDirection="column"
            flexBasis={0}
            flexGrow={1}
            backgroundOpacity={disableBackground ? 0 : 0.5}
            borderOpacity={disableBackground ? 0 : 0.5}
            onSizeChange={(size: Vector2) => {
              useWindowStore.getState().updateWindowSize(id, size);
              useWindowStore.getState().recalculateTilePositions();
            }}
          >
            <Container flexDirection="column" height="100%" width="100%">
              <Container flexGrow={1} padding={20} width="100%" height="100%">
                {content}
              </Container>
            </Container>
          </Card>

          {!disableTitleBar && (
            <Card
              backgroundOpacity={0.5}
              position="absolute"
              top={-70}
              left="50%"
              transform="translateX(-80%)"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              paddingTop={20}
              padding={10}
              borderRadius={20}
              whiteSpace="nowrap"
              marginTop={10}
              onClick={handleTitleBarClick}
              style={{
                cursor: currentTileMode === 'cockpit' ? 'pointer' : 'default',
              }}
            >
              <Container
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
                padding="0 40px"
              >
                {!disableIcon && icon && (
                  <Image
                    src={icon}
                    width={30}
                    height={30}
                    borderRadius={15}
                    marginRight={10}
                  />
                )}
                {title && (
                  <Container flexDirection="column">
                    <Text fontSize={12} color={colors.text}>
                      {title}
                    </Text>
                    {subtitle && (
                      <Text fontSize={10} color={colors.text}>
                        {subtitle}
                      </Text>
                    )}
                  </Container>
                )}
              </Container>

              {!disableActionBtns && (
                <Container flexDirection="row" marginLeft={20}>
                  <Container
                    margin={2}
                    borderRadius={6}
                    width={12}
                    height={12}
                    backgroundColor="yellow"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      isMinimized ? maximize(id) : minimize(id);
                    }}
                  />
                  <Container
                    margin={2}
                    borderRadius={6}
                    width={12}
                    height={12}
                    backgroundColor={colors.highlight}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      focus(id);
                    }}
                  />
                  <Container
                    margin={2}
                    borderRadius={6}
                    width={12}
                    height={12}
                    backgroundColor="red"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      close(id);
                    }}
                  />
                </Container>
              )}
            </Card>
          )}
        </Container>
      </Root>
    </a.group>
  );
};
