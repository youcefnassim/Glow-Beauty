import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { HomepageBanner } from '@/types';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerSliderProps {
  className?: string;
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({ className = '' }) => {
  const [banners, setBanners] = useState<HomepageBanner[]>(() => StorageService.getActiveBanners());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Sync if storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      setBanners(StorageService.getActiveBanners());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Automatic slideshow interval (4.5s)
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> Next
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      } else {
        // Swipe right -> Prev
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={`relative mx-auto max-w-md lg:max-w-none select-none group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-tr from-rose-300/40 via-amber-200/30 to-blush opacity-60 blur-xl transform -rotate-2 pointer-events-none" />

      {/* Main Slider Card */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white aspect-[4/3] sm:aspect-[4/5] bg-stone-900">
        
        {/* Slides Images with Transition */}
        {banners.map((banner, idx) => {
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover object-center transform transition-transform duration-6000 ease-out scale-105"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
            </div>
          );
        })}

        {/* Top Badges & Slide Counter */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          {currentBanner.badge ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-deep text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3 h-3 text-rose-600" />
              <span>{currentBanner.badge}</span>
            </span>
          ) : <div />}

          <div className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-widest border border-white/20">
            {currentIndex + 1} / {banners.length}
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Diapositive précédente"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-deep shadow-md flex items-center justify-center transition opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Diapositive suivante"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white text-deep shadow-md flex items-center justify-center transition opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Floating Content Card at Bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <Link
            to={currentBanner.buttonLink || '/shop'}
            className="block p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md shadow-luxury border border-rose-100/80 transition hover:bg-white group/card"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="font-serif text-xs sm:text-sm md:text-base font-bold text-deep truncate">
                  {currentBanner.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-mutedText line-clamp-1 mt-0.5 font-light">
                  {currentBanner.subtitle}
                </p>
              </div>

              <span className="shrink-0 inline-flex items-center gap-1 bg-deep hover:bg-rose-950 text-ivory text-[10px] sm:text-xs font-semibold px-3 py-1.5 sm:py-2 rounded-xl transition shadow-xs group-hover/card:bg-brand-rose">
                <span>{currentBanner.buttonText || 'Découvrir'}</span>
                <ArrowRight className="w-3 h-3 group-hover/card:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        </div>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Aller au slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-brand-rose shadow-xs'
                  : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
