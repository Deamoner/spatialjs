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

    if(!album) return null;

    const handleUnload = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    React.useEffect(() => {
        return () => {
            handleUnload();
        };
    }, []);

    return (
        <>
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