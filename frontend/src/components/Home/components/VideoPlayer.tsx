

interface VideoPlayerProps {
  src: string;
  muted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, muted = false }) => {
  console.log('VideoPlayer component rendering. src:', src);
  return (
    <video
      className="rounded-2xl shadow-lg"
      autoPlay
      loop
      playsInline
      muted={muted}
      controls
      src = {src}
      style={{
        width: '280px',
      }}
    >
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
