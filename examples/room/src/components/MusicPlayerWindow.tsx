import React from 'react';
import MusicPlayer from './MusicPlayer';
import AlbumWindow from './AlbumWindow';
import { useAlbumStore } from '../useAlbumStore';

export const MusicPlayerWindow: React.FC = () => {
  const currentAlbum = useAlbumStore((state) => state.currentAlbum);

  return (
    <>
      <AlbumWindow album={currentAlbum!} />
    </>
  );
};

export default MusicPlayerWindow;