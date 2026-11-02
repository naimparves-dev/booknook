import React from "react";
import Link from "next/link";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  count: string;
  color: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
}

const categories: CategoryItem[] = [
  {
    id: 1,
    name: "Fiction",
    slug: "Fiction",
    count: "150+ Books",
    color: "from-blue-500/10 to-teal-500/10 text-teal-700",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "Sci-Fi & Fantasy",
    slug: "Sci-Fi & Fantasy",
    count: "95+ Books",
    color: "from-purple-500/10 to-indigo-500/10 text-indigo-700",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Mystery & Thriller",
    slug: "Mystery & Thriller",
    count: "80+ Books",
    color: "from-amber-500/10 to-orange-500/10 text-[#F97316]",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    name: "Non-Fiction",
    slug: "Non-Fiction",
    count: "110+ Books",
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-700",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 5,
    name: "Technology",
    slug: "Technology & Computers",
    count: "70+ Books",
    color: "from-cyan-500/10 to-blue-500/10 text-[#0F4A6B]",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 6,
    name: "Self-Help",
    slug: "Self-Help & Psychology",
    count: "85+ Books",
    color: "from-rose-500/10 to-pink-500/10 text-rose-600",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default function TopCategories() {
  return (
    <section className="w-full bg-[#F1F6F9] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20 shadow-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
              Explore By Genre
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Top Categories
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-xl">
              Discover stories, knowledge, and guides curated across our most popular community genres.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F4A6B] hover:text-[#F97316] transition-colors shrink-0 group"
          >
            <span>All Categories</span>
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* 6 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/all-books?category=${encodeURIComponent(cat.slug)}`}
                className="group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-white border border-[#E2EEF6] shadow-xs hover:shadow-md hover:border-[#0F4A6B]/30 hover:-translate-y-1 transition-all duration-200"
              >
                {/* Icon Circle */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-200 shadow-xs`}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                {/* Name */}
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-[#0F4A6B] transition-colors line-clamp-1">
                  {cat.name}
                </h3>

                {/* Count / Tag */}
                <p className="text-xs text-[#64748B] mt-1 font-medium">
                  {cat.count}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}