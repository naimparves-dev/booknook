"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DiscountFeature {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
}

const features: DiscountFeature[] = [
  {
    id: 1,
    title: "Easy Returns & Delivery",
    subtitle: "Hassle-free return & fast dispatch",
    badge: "Free",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Special Membership",
    subtitle: "30% Off on yearly subscriptions",
    badge: "Save 30%",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Quality Support",
    subtitle: "Always online 24/7 reader help",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Daily Flash Offers",
    subtitle: "Up to 50% discount on top titles",
    badge: "Hot Deal",
    icon: (props) => (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
];

export default function DiscountSection() {
  const [copied, setCopied] = useState(false);
  const couponCode = "BOOKNOOK50";

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full bg-[#F1F6F9] pb-6 sm:pb-8 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* 
          1. Four Feature & Discount Cards Strip
          Matching the exact reference layout directly below the hero banner
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative flex items-center gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-white border border-[#E2EEF6] shadow-sm hover:shadow-md hover:border-[#0F4A6B]/30 transition-all duration-200"
              >
                {/* Icon Container with Deep Teal Tint */}
                <div className="w-12 h-12 rounded-xl bg-[#EAF2F8] text-[#0F4A6B] flex items-center justify-center shrink-0 group-hover:bg-[#0F4A6B] group-hover:text-white transition-colors duration-200">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-[#0F172A] truncate group-hover:text-[#0F4A6B] transition-colors">
                      {item.title}
                    </h2>
                    {item.badge && (
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF4ED] text-[#F97316] border border-[#F97316]/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] truncate mt-0.5 font-normal">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 
          2. Promotional Coupon & Discount Voucher Card
          Special highlighted discount strip for book lovers
        */}
        <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#0F4A6B] via-[#0C3B56] to-[#0A2F45] text-white p-5 sm:p-6 lg:p-7 shadow-sm overflow-hidden border border-[#135A82]">
          {/* Subtle Decorative Background Circles */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-1/4 -bottom-16 w-40 h-40 rounded-full bg-[#F97316]/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
            {/* Left: Offer Details */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F97316] text-white shadow-sm mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Special Reader Discount
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1">
                Get Flat 50% Off on Your First Borrow!
              </h3>
              <p className="text-xs sm:text-sm text-slate-200/90 max-w-xl">
                Use our exclusive community promo code at checkout. Valid for all new book borrows and premium library passes this month.
              </p>
            </div>

            {/* Right: Coupon Code & Action Button */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              {/* Copy Coupon Badge */}
              <div className="flex items-center rounded-xl bg-white/10 border border-white/20 p-1 backdrop-blur-sm">
                <span className="px-3.5 py-1.5 font-mono text-sm sm:text-base font-bold text-white tracking-widest select-all">
                  {couponCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#0F4A6B] hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Click to copy code"
                >
                  {copied ? "Copied! ✓" : "Copy"}
                </button>
              </div>

              {/* CTA Button */}
              <Link
                href="/books"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Browse Deals</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}