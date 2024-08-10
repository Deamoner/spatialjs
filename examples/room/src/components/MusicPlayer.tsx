import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Container, Text, Image } from '@react-three/uikit';
import { Input } from './apfel/input'
import { Album, albums } from './Albums';
import { Card } from '../../../../src/components/card';
import { AlbumArtwork } from './Album';
import { colors } from '../theme';
import { Search } from '@react-three/uikit-lucide';
import { useAlbumStore } from '../useAlbumStore';
import { createWindow } from '../../../../src/Utils/createWindow';
import MusicPlayerWindow from './MusicPlayerWindow';
import { useThree } from '@react-three/fiber';



const MusicPlayer: React.FC = () => {
    const abumConRef = useRef<any>(null);
    const [text, setText] = useState('')
    const { camera } = useThree();

    const setCurrentAlbum = useAlbumStore((state) => state.setCurrentAlbum);    

    const selectAlbum = (album: Album) => {
        
        createWindow(<MusicPlayerWindow  />, {
            //id: 'music-player',
            title: album.name,
            width: 100,
            height: 100,
            followCamera: false
        });
        setCurrentAlbum(album);
    };

    useEffect(() => {
        setTimeout(() => {
            camera.rotation.set(-0.12698932461142853, 0.5458307802768984, 0.06618362225811597);
          }, 1000);
    }, [])

    return (
        <>
            <Card positionType="absolute" width="95%" height={55} padding={10}>
                <Image src="Spotify.png" width={100} height={60} objectFit="cover" />
                <Container width="100%" height="100%" justifyContent="flex-end" alignItems="center">
                    <Input width={150} height={30} value={text} onValueChange={setText} placeholder="Search..." prefix={<Search />} />
                </Container>
            </Card>
            <Card marginTop={75} paddingLeft={10} width="100%" height={185} justifyContent="center" flexDirection="column">
                
                <Container paddingBottom={12} scrollbarOpacity={0.5} scrollbarWidth={2} scrollbarColor={colors.mutedForeground} ref={abumConRef} width={600} height={200} alignItems="auto" justifyContent="flex-start" flexDirection="row" overflow="scroll" >
                    {albums.map((album) => (
                        <AlbumArtwork album={album} width={100} height={100} onClick={(e) => {
                            e.stopPropagation()
                            selectAlbum(album)
                        }} />
                    ))}
                </Container>
            </Card>
        </>
    );
};
export default MusicPlayer;