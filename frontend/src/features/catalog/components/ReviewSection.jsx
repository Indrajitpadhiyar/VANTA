import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { REVIEWS } from '../../../data/products';

export default function ReviewSection({ reviews = REVIEWS }) {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const currentReview = reviews[activeReviewIdx] || reviews[0];

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
              4,5<span className="text-xl sm:text-2xl font-normal text-neutral-400 ml-1">/ 5</span>
            </div>
            <div className="text-xs text-neutral-400 mt-2 font-semibold font-cute">
              (50 New Reviews)
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 space-y-1.5">
            {[
              { star: 5, pct: 'w-[75%]' },
              { star: 4, pct: 'w-[18%]' },
              { star: 3, pct: 'w-[5%]' },
              { star: 2, pct: 'w-[2%]' },
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
          <div className="relative p-6 sm:p-7 rounded-3xl bg-neutral-50 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm sm:text-base font-bold text-neutral-950 font-cute">
                  {currentReview.author}
                </h4>
                <span className="text-xs text-neutral-400 font-medium">
                  {currentReview.date}
                </span>
              </div>

              {/* Gold Stars */}
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 italic leading-relaxed mb-6 font-sans">
                "{currentReview.comment}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <img 
                src={currentReview.avatar} 
                alt={currentReview.author} 
                className="w-10 h-10 rounded-full object-cover border border-neutral-200" 
              />

              {/* Carousel Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveReviewIdx(prev => prev === 0 ? reviews.length - 1 : prev - 1)}
                  className="w-8 h-8 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-700" />
                </button>
                <button
                  onClick={() => setActiveReviewIdx(prev => prev === reviews.length - 1 ? 0 : prev + 1)}
                  className="w-8 h-8 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
