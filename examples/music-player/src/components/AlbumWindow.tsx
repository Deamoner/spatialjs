import React, { useRef } from 'react';
import { Container, Text, Image, Video } from '@react-three/uikit';
import { Card } from '../../../../src/components/card';
import { Album } from './Albums';
import { colors } from '../theme';

interface AlbumWindowProps {
    album: Album;
}

const AlbumWindow: React.FC<AlbumWindowProps> = ({ album }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <>
            <Container positionType="absolute" width="100%" height={55} flexDirection="row" flexGrow={1} flexWrap="wrap" paddingLeft={0}>
                <Container width="100%" height="100%" justifyContent="flex-start" alignItems="center" flexDirection="column">
                    <Text fontSize={12} fontWeight="medium" color={colors.text}>{album.name}</Text>
                    <Text fontSize={8} color={colors.mutedForeground}>{album.artist}</Text>
                </Container>
            </Container>
            <Container marginTop={55} margin="auto" width={150} height="100%" justifyContent="center" alignItems="center">
                {album.video ? (
                    <Video
                       
                        src={album.video}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        borderRadius={10}
                        autoplay
                        loop
                    />
                ) : (
                    <Image
                        src={album.cover}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        borderRadius={10}
                    />
                )}
            </Container>
        </>
    );
};

export default AlbumWindow;