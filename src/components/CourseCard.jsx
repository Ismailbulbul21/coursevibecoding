import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    image_url,
    thumbnail_url,
    price,
    level,
    short_description,
    lesson_count
  } = course;

  // Get the appropriate image URL
  const imageUrl = image_url || thumbnail_url;

  // Format price display
  const formattedPrice = typeof price === 'number' ? `$${price.toFixed(2)}` : 'Free';
  
  // Determine level badge color
  const getLevelBadgeColor = () => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-[#00E5A0]/15 text-[#00E5A0]';
      case 'intermediate':
        return 'bg-[#5D3BE7]/15 text-[#5D3BE7]';
      case 'advanced':
        return 'bg-[#FF6B6B]/15 text-[#FF6B6B]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Translate level to Somali
  const getTranslatedLevel = (englishLevel) => {
    switch (englishLevel?.toLowerCase()) {
      case 'beginner':
        return 'Bilowga';
      case 'intermediate':
        return 'Dhexe';
      case 'advanced':
        return 'Sare';
      default:
        return englishLevel;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#5D3BE7]/30 hover:translate-y-[-5px]">
      <div className="relative group">
        {/* Course image */}
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=No+Image+Available';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
        
        {/* Price tag */}
        <div className="absolute top-0 right-0 m-4 px-4 py-1 bg-[#1A0B2E] text-white rounded-full shadow-md font-bold">
          {formattedPrice}
        </div>
      </div>
      
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-[#2C1952] line-clamp-1">{title}</h3>
        
        {/* Level badge */}
        {level && (
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor()} mb-3`}>
            {level}
          </span>
        )}
        
        {/* Description */}
        <p className="text-[#8C8C9E] mb-4 line-clamp-2">
          {short_description || 'No description available'}
        </p>
        
        {/* Course stats */}
        <div className="flex items-center text-sm text-[#8C8C9E] mb-5">
          {lesson_count !== undefined && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-[#5D3BE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span>{lesson_count} {lesson_count === 1 ? 'Lesson' : 'Lessons'}</span>
            </div>
          )}
        </div>
        
        {/* Action button */}
        <Link 
          to={`/courses/${id}`}
          className="btn-primary w-full flex items-center justify-center group"
        >
          <span>View Details</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    thumbnail_url: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    level: PropTypes.string,
    short_description: PropTypes.string,
    lesson_count: PropTypes.number
  }).isRequired
};

export default CourseCard; 