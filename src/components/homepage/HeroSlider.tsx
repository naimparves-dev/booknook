"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Swiper CSS styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface SlideData {
  id: number;
  image: string;
  badge: string;
  headline: string;
  description: string;
  buttonText: string;
  buttonRoute: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/images/banner-1.jpg",
    badge: "Up to 50% Off & Free Borrowing",
    headline: "Discover Your Next Great Read at BookNook",
    description:
      "Explore a curated collection of thousands of books across Fiction, Science, History, and more. Borrow easily and read anytime.",
    buttonText: "Browse Books",
    buttonRoute: "/books",
  },
  {
    id: 2,
    image: "/images/banner-2.jpg",
    badge: "Expand Your Mind",
    headline: "Read, Learn, and Grow Every Single Day",
    description:
      "Access top-rated books shared by our community. Simple borrowing terms, quick returns, and zero hassle.",
    buttonText: "Browse Books",
    buttonRoute: "/books",
  },
  {
    id: 3,
    image: "/images/banner-3.jpg",
    badge: "Community Library",
    headline: "Add Your Books, Share Knowledge with Others",
    description:
      "Join fellow avid readers today. List your own books for others to enjoy or pick up your next favorite title in just one click.",
    buttonText: "Browse Books",
    buttonRoute: "/books",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F1F6F9] py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-slate-200/60 bg-[#0F4A6B]">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={800}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            pagination={{
              clickable: true,
              el: ".hero-slider-pagination",
              bulletClass: "hero-bullet",
              bulletActiveClass: "hero-bullet-active",
            }}
            navigation={{
              nextEl: ".hero-slider-next",
              prevEl: ".hero-slider-prev",
            }}
            className="w-full h-[520px] sm:h-[560px] lg:h-[600px]"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id} className="relative w-full h-full">
                {/* Background Image Layer */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.headline}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1280px"
                    className="object-cover object-center md:object-right"
                  />
                  {/*
                    Gradient Overlay:
                    - Mobile: Centered semi-dark overlay for crisp text contrast
                    - Desktop: Deep Teal (#0F4A6B) gradient fading towards the right to reveal artwork
                  */}
                  <div className="absolute inset-0 bg-[#0F4A6B]/80 md:bg-gradient-to-r md:from-[#0F4A6B] md:via-[#0F4A6B]/85 md:to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full flex items-center">
                  <div className="w-full max-w-2xl px-6 sm:px-10 lg:px-16 py-12 text-center md:text-left">
                    {/* Category / Offer Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#F97316] text-white shadow-sm mb-4 sm:mb-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {slide.badge}
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2] mb-3 sm:mb-5 drop-shadow-sm">
                      {slide.headline}
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base lg:text-lg text-slate-100/90 leading-relaxed max-w-xl mx-auto md:mx-0 mb-6 sm:mb-8 font-normal">
                      {slide.description}
                    </p>

                    {/* Primary Call to Action Button */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <Link
                        href={slide.buttonRoute}
                        className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-lg shadow-[#F97316]/30 hover:shadow-xl hover:shadow-[#F97316]/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>{slide.buttonText}</span>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </Link>

                      <Link
                        href="/all-books"
                        className="hidden sm:inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm sm:text-base font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-200"
                      >
                        All Categories
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows (Desktop / Tablet) */}
          <button
            type="button"
            aria-label="Previous Slide"
            className="hero-slider-prev hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center bg-black/25 hover:bg-[#F97316] text-white border border-white/30 backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next Slide"
            className="hero-slider-next hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center bg-black/25 hover:bg-[#F97316] text-white border border-white/30 backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Custom Styled Pagination Bullets */}
          <div className="hero-slider-pagination absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2" />
        </div>
      </div>

      {/* Scoped CSS for Swiper Bullets */}
      <style jsx global>{`
        .hero-bullet {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.45);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-bullet:hover {
          background-color: rgba(255, 255, 255, 0.8);
        }
        .hero-bullet-active {
          width: 28px;
          background-color: #f97316 !important;
          box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
        }
      `}</style>
    </section>
  );
}