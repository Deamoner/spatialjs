import React, { useRef, useEffect, useState, useCallback } from "react";
import { Group, Vector2 } from "three";
import { a } from "@react-spring/three";
import { useSpring } from "@react-spring/core";
import { Root, Container, Text, Image } from "@react-three/uikit";
import { Card } from "./card";
import { colors } from "../theme";
import { useWindowStore } from "../stores/windowStore";
import { debounce } from "lodash";

interface BaseWindowProps {
  id: string;
  WindowComponent: React.ComponentType<any>;
  windowProps: any;
  disableTitleBar?: boolean;
  disableIcon?: boolean;
  disableActionBtns?: boolean;
  disableBackground?: boolean;
}

export const Window: React.FC<BaseWindowProps> = ({
  id,
  WindowComponent,
  windowProps,
  disableTitleBar: propDisableTitleBar,
  disableIcon: propDisableIcon,
  disableActionBtns: propDisableActionBtns,
  disableBackground: propDisableBackground,
}) => {
  const groupRef = useRef<Group>(null);
  const [selected, setSelected] = useState(false);

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
    setPosition,
    setScale,
    setRotation,
    minimize,
    maximize,
    focus,
    close,
    currentTileMode,
    opacity,
    followCamera,
    rotation,
    selectedWindow,
    setSelectedWindow,
  } = useWindowStore((state) => ({
    ...state.windows[id],
    setPosition: state.setPosition,
    setScale: state.setScale,
    setRotation: state.setRotation,
    minimize: state.minimize,
    maximize: state.maximize,
    focus: state.focus,
    close: state.close,
    currentTileMode: state.currentTileMode,
    selectedWindow: state.selectedWindow,
    setSelectedWindow: state.setSelectedWindow,
  }));

  // Use prop values if provided, otherwise fall back to store values
  const disableTitleBar = propDisableTitleBar ?? storeDisableTitleBar;
  const disableIcon = propDisableIcon ?? storeDisableIcon;
  const disableActionBtns = propDisableActionBtns ?? storeDisableActionBtns;
  const disableBackground = propDisableBackground ?? storeDisableBackground;

  // Use effect to update selected state when lastWindow changes
  useEffect(() => {
    setSelected(selectedWindow === id);
  }, [selectedWindow, id]);

  const { spring } = useSpring({
    spring: position.toArray(),
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const { spring: springScale } = useSpring({
    spring: scale.toArray(),
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const { spring: springRotation } = useSpring({
    spring: [rotation.x, rotation.y, rotation.z],
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const handleTitleBarClick = (e: any) => {
    e.stopPropagation();
    if (currentTileMode === "cockpit") {
      focus(id);
    }
    setSelected(!selected);
    setSelectedWindow(selected ? undefined : id);
  };

  const MemoizedWindowComponent = React.useMemo(() => {
    return <WindowComponent {...windowProps} />;
  }, [WindowComponent, ...Object.values(windowProps)]);

  const debouncedUpdateWindowSize = useCallback(
    debounce((size: Vector2) => {
      useWindowStore.getState().updateWindowSize(id, size);
    }, 200),
    [id]
  );

  return (
    <a.group
      ref={groupRef}
      position={spring}
      scale={springScale}
      rotation={springRotation as any}
    >
      <Root>
        <Container flexDirection="column" alignItems="center" width="100%">
          <Card
            castShadow
            width="100%"
            height="100%"
            flexDirection="column"
            flexBasis={0}
            flexGrow={1}
            backgroundOpacity={disableBackground ? 0 : opacity}
            borderOpacity={disableBackground ? 0 : opacity}
            onSizeChange={debouncedUpdateWindowSize}
          >
            <Container flexDirection="column" height="100%" width="100%">
              <Container flexGrow={1} padding={20} width="100%" height="100%">
                {MemoizedWindowComponent}
              </Container>
            </Container>
          </Card>

          {!disableTitleBar && (
            <Card
              backgroundOpacity={0.5}
              position="absolute"
              top={-70}
              transform="translateX(-80%)"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              paddingTop={20}
              padding={10}
              borderRadius={20}
              whiteSpace="nowrap"
              marginTop={10}
              backgroundColor={selected ? "green" : undefined}
              onClick={handleTitleBarClick}
              style={{
                cursor: currentTileMode === "cockpit" ? "pointer" : "default",
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
                  <Container flexDirection="column" paddingRight={10}>
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
                <Container flexDirection="row">
                  {isFocused && (
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
                  )}

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
