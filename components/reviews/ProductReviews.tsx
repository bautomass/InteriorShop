'use client'
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const sampleReviews: Review[] = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2024-01-15",
    comment: "Absolutely stunning pendant light! The craftsmanship is exceptional, and it perfectly complements my minimalist dining room.",
    verified: true
  },
  {
    id: 2,
    author: "James K.",
    rating: 5,
    date: "2024-01-10",
    comment: "The quality of this light is outstanding. The warm glow it creates sets the perfect ambiance in our space.",
    verified: true
  },
  {
    id: 3,
    author: "Emily R.",
    rating: 4,
    date: "2024-01-05",
    comment: "Beautiful design and great customer service. Installation was straightforward. Would highly recommend!",
    verified: true
  },
  {
    id: 4,
    author: "Michael T.",
    rating: 5,
    date: "2024-01-03",
    comment: "This pendant light exceeded all my expectations. The attention to detail is remarkable, and the natural materials used create such a warm, inviting atmosphere. Perfect addition to our home!",
    verified: true
  }
];

interface ProductReviewsProps {
  productId: string;
  onToggle: () => void;
}

const ProductReviews = ({ productId, onToggle }: ProductReviewsProps) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-4 relative">
      {sampleReviews.slice(0, 4).map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 bg-white/50 rounded-lg border border-[#B5A48B]/20 
            ${index === 3 ? 'opacity-25 blur-[2px] pointer-events-none select-none' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#6B5E4C]">{review.author}</span>
              {review.verified && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Verified Purchase
                </span>
              )}
            </div>
            <span className="text-sm text-[#8C7E6A]">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1 mb-2">
            {renderStars(review.rating)}
          </div>
          <p className="text-[#6B5E4C]">{review.comment}</p>
        </motion.div>
      ))}
      
      {/* Gradient Overlay - Made stronger */}
      <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-gradient-to-t from-[#F9F7F4] via-[#F9F7F4]/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default ProductReviews;
