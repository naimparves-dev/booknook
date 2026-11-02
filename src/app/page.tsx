import { Suspense } from "react";
import DiscountSection from "@/components/homepage/DiscountSection";
import HeroSlider from "@/components/homepage/HeroSlider";
import NewArrivals from "@/components/homepage/NewArrivals";
import TopCategories from "@/components/homepage/TopCategories";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen">
      {/* হিরো স্লাইডার সেকশন
          Swiper's autoplay reads the clock during render, so this client
          component streams in behind a Suspense boundary instead of blocking
          the static shell from being prerendered. */}
      <Suspense fallback={<div className="h-[70vh] w-full bg-[#0F4A6B]" />}>
        <HeroSlider />
      </Suspense>
      <NewArrivals></NewArrivals>
      <DiscountSection></DiscountSection>
      <TopCategories></TopCategories>

      {/* পরবর্তীতে অন্যান্য সেকশন (Categories, Featured Books ইত্যাদি) এখানে আসবে */}
    </div>
  );
}