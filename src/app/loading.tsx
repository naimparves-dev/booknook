import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-[75vh] bg-[#F1F6F9] flex flex-col items-center justify-center p-6">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Glow */}
        <div className="absolute w-20 h-20 rounded-full bg-[#0F4A6B]/15 animate-ping" />

        {/* Outer Spinning Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-[#0F4A6B]/20 border-t-[#0F4A6B] border-r-[#F97316] animate-spin" />

        {/* Center Book Icon */}
        <div className="absolute flex items-center justify-center text-[#0F4A6B]">
          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      {/* Loading Label */}
      <div className="mt-6 text-center space-y-1">
        <p className="text-base font-bold text-[#0F172A] tracking-tight">
          Loading <span className="text-[#0F4A6B]">Book</span><span className="text-[#F97316]">Nook</span>
        </p>
        <p className="text-xs text-[#64748B]">
          Fetching books and community shelves...
        </p>
      </div>
    </div>
  );
}