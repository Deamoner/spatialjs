import React from 'react';
import { Container, Text } from '@react-three/uikit';
import { colors } from '../theme';

interface SimpleWindowProps {
  title: string;
  content: string;
}

const SimpleWindow: React.FC<SimpleWindowProps> = ({ title, content }) => {
  return (
    <Container width={300} height={200} backgroundColor={colors.background} borderRadius={10}>
      <Container flexDirection="column" padding={20}>
        <Text fontSize={18} color={colors.text} marginBottom={10}>
          {title}
        </Text>
        <Text fontSize={14} color={colors.mutedForeground}>
          {content}
        </Text>
      </Container>
    </Container>
  );
};

export default SimpleWindow;
