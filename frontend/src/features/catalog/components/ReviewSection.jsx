import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

export default function ReviewSection({ reviews = [] }) {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const hasReviews = Array.isArray(reviews) && reviews.length > 0;
  const currentReview = hasReviews ? (reviews[activeReviewIdx] || reviews[0]) : null;

  return (
    <div className="mb-24 pt-12 border-t border-neutral-200">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mb-8 font-cute">
        Rating & Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Breakdown Column */}
        <div className="lg:col-span-5 flex items-center gap-6">
          <div className="flex flex-col">
            <div className="text-6xl sm:text-7xl font-black text-neutral-950 font-cute tracking-tight leading-none">
              {hasReviews ? '4.8' : '5.0'}<span className="text-xl sm:text-2xl font-normal text-neutral-400 ml-1">/ 5</span>
            </div>
            <div className="text-xs text-neutral-400 mt-2 font-semibold font-cute">
              ({reviews.length} {reviews.length === 1 ? 'Customer Review' : 'Customer Reviews'})
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 space-y-1.5">
            {[
              { star: 5, pct: hasReviews ? 'w-[85%]' : 'w-[100%]' },
              { star: 4, pct: hasReviews ? 'w-[10%]' : 'w-[0%]' },
              { star: 3, pct: hasReviews ? 'w-[5%]' : 'w-[0%]' },
              { star: 2, pct: 'w-[0%]' },
              { star: 1, pct: 'w-[0%]' },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-0.5 text-neutral-600 font-bold w-6 font-cute">
                  ★ {row.star}
                </span>
                <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-neutral-950 rounded-full ${row.pct}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Testimonial Slider Card */}
        <div className="lg:col-span-7">
          {hasReviews && currentReview ? (
            <div className="relative p-6 sm:p-7 rounded-3xl bg-neutral-50 border border-neutral-200/80 shadow-sm flex flex-col justify-between min-h-[190px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm sm:text-base font-bold text-neutral-950 font-cute">
                    {currentReview.author || currentReview.user?.name || 'Verified Buyer'}
                  </h4>
                  <span className="text-xs text-neutral-400 font-medium">
                    {currentReview.date || (currentReview.createdAt ? new Date(currentReview.createdAt).toLocaleDateString() : 'Recent')}
                  </span>
                </div>

                {/* Gold Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(currentReview.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 italic leading-relaxed mb-6 font-sans">
                  "{currentReview.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <img 
                  src={currentReview.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                  alt={currentReview.author || 'Reviewer'} 
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200" 
                />

                {/* Carousel Controls */}
                {reviews.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveReviewIdx((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))}
                      className="w-8 h-8 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-4 h-4 text-neutral-700" />
                    </button>
                    <button
                      onClick={() => setActiveReviewIdx((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))}
                      className="w-8 h-8 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-4 h-4 text-neutral-700" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-neutral-50/80 border border-neutral-200/80 text-center flex flex-col items-center justify-center">
              <MessageSquare className="w-8 h-8 text-neutral-300 mb-2" />
              <p className="text-sm font-bold text-neutral-700 font-cute">No reviews yet</p>
              <p className="text-xs text-neutral-400 font-cute mt-1">
                Be the first to order and review this piece from our live store!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
