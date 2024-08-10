import create from 'zustand';
import { Album } from './components/Albums';

interface AlbumStore {
  currentAlbum: Album | null;
  setCurrentAlbum: (album: Album) => void;
}

export const useAlbumStore = create<AlbumStore>((set) => ({
  currentAlbum: null,
  setCurrentAlbum: (album) => set({ currentAlbum: album }),
}));