import { Maximize, Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react";

export default function PlayerControls({ isPlaying, isMuted, currentTime, duration, progress, onPlay, onMute, onSeek, onSkip, onFullscreen }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-5">
      <input
        min="0"
        max="100"
        value={progress}
        onChange={(event) => onSeek(Number(event.target.value))}
        type="range"
        className="w-full accent-[#20946E]"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={onPlay} className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
          </button>
          <button onClick={() => onSkip(-10)} className="rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white"><RotateCcw size={20} /></button>
          <button onClick={() => onSkip(10)} className="rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white"><RotateCw size={20} /></button>
          <button onClick={onMute} className="rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white">
            {isMuted ? <VolumeX size={21} /> : <Volume2 size={21} />}
          </button>
          <span className="text-xs text-white/50 sm:text-sm">{currentTime} / {duration}</span>
        </div>
        <button onClick={onFullscreen} className="rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white"><Maximize size={22} /></button>
      </div>
    </div>
  );
}
