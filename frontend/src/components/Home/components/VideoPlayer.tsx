import PropTypes from 'prop-types';

interface VideoPlayerProps {
  src: string;
  // Add a scale prop to control the scale factor
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src}) => {
  return (
    <video
      className="rounded-2xl shadow-lg"
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: '280px',
      }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,

};

export default VideoPlayer;
