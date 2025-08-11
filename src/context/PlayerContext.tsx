'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface PlayerShow {
  id: string;
  title: string;
  series: string;
  duration: string;
  year: string;
  description: string;
  archiveUrl: string;
}

interface PlayerContextType {
  currentShow: PlayerShow | null;
  isPlaying: boolean;
  playShow: (show: PlayerShow) => void;
  closePlayer: () => void;
  setIsPlaying: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentShow, setCurrentShow] = useState<PlayerShow | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playShow = (show: PlayerShow) => {
    setCurrentShow(show);
    setIsPlaying(true);
  };

  const closePlayer = () => {
    setCurrentShow(null);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider value={{ currentShow, isPlaying, playShow, closePlayer, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}

