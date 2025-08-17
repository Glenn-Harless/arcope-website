
// src/components/MusicPlayer/MusicPlayer.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Track {
  title: string;
  file: string;
  duration: string;
  releaseDate?: string;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks: Track[] = [
    {
      title: "Beneath the Data Sea",
      file: "/audio/track1.mp3", // Path to your audio file
      duration: "3:42",
      releaseDate: "April 2025"
    },
    {
      title: "Signal Flow",
      file: "/audio/track2.mp3",
      duration: "4:15",
      releaseDate: "Coming Soon"
    },
    {
      title: "Digital Horizon",
      file: "/audio/track3.mp3",
      duration: "5:21",
      releaseDate: "Coming Soon"
    }
  ];

  useEffect(() => {
    // Update progress bar during playback
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(currentProgress) ? 0 : currentProgress);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNextTrack);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNextTrack);
    };
  }, [currentTrack]);

  // Set volume when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error("Playback prevented:", error);
          // Handle autoplay restrictions
        });
    }
  };

  const handlePrevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(false);
  };

  const handleNextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % tracks.length);
    setIsPlaying(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    audio.currentTime = percent * audio.duration;
  };

  const handleTrackSelection = (index: number) => {
    if (index === currentTrack) {
      togglePlay();
    } else {
      setCurrentTrack(index);
      setIsPlaying(false);
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(error => console.error("Playback prevented:", error));
        }
      }, 100);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light tracking-wider text-primary-DEFAULT mb-6">MUSIC</h2>
      
      {/* Now Playing */}
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Visualizer/Album Art Placeholder */}
          <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-primary-light to-accent-light rounded-lg flex items-center justify-center">
            <div className="relative w-3/4 h-3/4">
              {/* Vinyl record effect */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-900 animate-spin" style={{ animationDuration: '3s', animationPlayState: isPlaying ? 'running' : 'paused' }}></div>
              <div className="absolute inset-[15%] rounded-full border-4 border-gray-700"></div>
              <div className="absolute inset-[40%] rounded-full bg-gray-800"></div>
            </div>
          </div>
          
          {/* Player Controls */}
          <div className="w-full md:w-2/3 space-y-4">
            <h3 className="text-xl font-medium">{tracks[currentTrack].title}</h3>
            <p className="text-sm text-gray-500">{tracks[currentTrack].releaseDate}</p>
            
            {/* Progress bar */}
            <div 
              className="h-1.5 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {/* Time indicator */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                {audioRef.current ? 
                  `${Math.floor(audioRef.current.currentTime / 60)}:${String(Math.floor(audioRef.current.currentTime % 60)).padStart(2, '0')}` : 
                  '0:00'}
              </span>
              <span>{tracks[currentTrack].duration}</span>
            </div>
            
            {/* Control buttons */}
            <div className="flex justify-center items-center space-x-8">
              <button 
                onClick={handlePrevTrack}
                className="text-gray-600 hover:text-primary-DEFAULT transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 20L9 12l10-8v16z"></path>
                  <line x1="5" y1="19" x2="5" y2="5"></line>
                </svg>
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-DEFAULT to-accent-DEFAULT text-white"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"></rect>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"></polygon>
                  </svg>
                )}
              </button>
              
              <button 
                onClick={handleNextTrack}
                className="text-gray-600 hover:text-primary-DEFAULT transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 4l10 8-10 8V4z"></path>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </button>
            </div>
            
            {/* Volume control */}
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
              
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-full appearance-none"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Track List */}
      <div className="space-y-1">
        <h3 className="text-lg font-light mb-3">Tracks</h3>
        
        {tracks.map((track, index) => (
          <motion.div
            key={index}
            onClick={() => handleTrackSelection(index)}
            className={`p-3 flex justify-between items-center rounded-md cursor-pointer transition-colors ${
              currentTrack === index ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                {currentTrack === index && isPlaying ? (
                  <span className="w-2 h-2 bg-primary-DEFAULT rounded-full animate-pulse"></span>
                ) : (
                  <span className="text-sm text-gray-500">{index + 1}</span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">{track.title}</h4>
                <p className="text-xs text-gray-500">{track.releaseDate}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">{track.duration}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Streaming Links */}
      <div className="pt-6">
        <h3 className="text-lg font-light mb-4">Listen On</h3>
        <div className="flex flex-wrap gap-3">
          <a 
            href="https://open.spotify.com/artist/your-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            Spotify
          </a>
          <a 
            href="https://music.apple.com/artist/your-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            Apple Music
          </a>
          <a 
            href="https://soundcloud.com/your-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            Soundcloud
          </a>
          <a 
            href="https://bandcamp.com/your-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            Bandcamp
          </a>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        src={tracks[currentTrack].file}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default MusicPlayer;