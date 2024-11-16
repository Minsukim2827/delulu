
import PropTypes from 'prop-types';
import './TextCarousel.css'; // We'll create this CSS file next
import { CircleCheck } from 'lucide-react';



const TextCarousel = ({ items, animationDuration = 35 }) => {
    return (
      <div className="logos">
        <div className="logo_items" style={{ animationDuration: `${animationDuration}s` }}>
          {items.map((item, index) => (
            <div key={`item1-${index}`} className="flex items-center px-4">
              <CircleCheck className="mr-2" />
              <span className="logo_text inline-block">
                {item}
              </span>
            </div>
          ))}
          {/* Duplicate the items for seamless scrolling */}
          {items.map((item, index) => (
            <div key={`item2-${index}`} className="flex items-center px-4">
              <CircleCheck className="mr-2" />
              <span className="logo_text inline-block">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

TextCarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  animationDuration: PropTypes.number,
};

export default TextCarousel;
