import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[80vh] bg-[#F1F6F9] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-[#E2EEF6] shadow-sm p-8 sm:p-12 text-center">
        {/* BookNook Book Icon with Question Badge */}
        <div className="relative w-20 h-20 rounded-2xl bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center mx-auto mb-6 shadow-xs">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#F97316] text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
            ?
          </span>
        </div>

        {/* 404 Large Heading */}
        <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20 mb-3">
          Error 404
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#64748B] mt-3 leading-relaxed">
          Lost in the stacks? The page or book you are looking for doesn&apos;t exist or may have been relocated to another shelf.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#0F4A6B] hover:bg-[#0C3B56] shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/all-books"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-medium text-sm text-[#0F4A6B] hover:bg-[#EAF2F8] border border-[#D5E4EF] transition-colors cursor-pointer"
          >
            Browse All Books
          </Link>
        </div>
      </div>
    </div>
  );
}