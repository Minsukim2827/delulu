import './TextCarousel.css'; 
import { CircleCheck } from 'lucide-react';

interface TextCarouselProps {
  items: string[];
  animationDuration?: number;
}


const TextCarousel: React.FC<TextCarouselProps> = ({ items, animationDuration = 35 }) => {
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

export default TextCarousel;
