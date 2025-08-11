'use client';

import { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { RadioShow } from '@/lib/types';

interface AudioPlayerProps {
  show: RadioShow | null;
  onClose: () => void;
}

export default function AudioPlayer({ show, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (show && audioRef.current) {
      // For Archive.org, we need to construct the direct audio URL
      // This is a simplified approach - in production you'd need proper Archive.org API integration
      const archiveId = show.archiveUrl.split('/').pop();
      const audioUrl = `https://archive.org/download/${archiveId}/${archiveId}.mp3`;
      
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [show]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        // Fallback: open Archive.org page in new tab
        window.open(show?.archiveUrl, '_blank');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-purple-500/30 text-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          {/* Show Info */}
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm truncate">{show.title}</h4>
            <p className="text-purple-300 text-xs truncate">{show.series} • {show.year}</p>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlayPause}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>

            {/* Progress Bar */}
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <span
                id="current-time"
                className="text-xs text-purple-300 w-12 text-right"
              >
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={duration || 0}
                aria-valuenow={currentTime}
                aria-describedby="current-time duration-time"
                className="flex-1 h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #4c1d95 ${(currentTime / duration) * 100}%, #4c1d95 100%)`
                }}
              />
              <span id="duration-time" className="text-xs text-purple-300 w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="p-1 hover:text-purple-300 transition-colors">
                {isMuted || volume === 0 ? (
                  <SpeakerXMarkIcon className="h-4 w-4" />
                ) : (
                  <SpeakerWaveIcon className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={isMuted ? 0 : volume}
                aria-describedby="volume-level"
                className="w-16 h-1 bg-purple-900 rounded-lg appearance-none cursor-pointer slider"
              />
              <span
                id="volume-level"
                className="text-xs text-purple-300 w-8 text-right"
              >
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-purple-300 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Archive.org Attribution */}
        <div className="mt-2 text-xs text-purple-400 text-center">
          Streaming from <a href={show.archiveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 underline">Archive.org</a>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
        }
      `}</style>
    </div>
  );
}