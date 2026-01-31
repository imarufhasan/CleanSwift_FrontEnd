// src/constants/onboarding.ts
import ScooterSvg from "@/assets/images/onboarding/delivery-scooter.svg";
import LaundrySvg from "@/assets/images/onboarding/laundry-pricing.svg";
import TrackingSvg from "@/assets/images/onboarding/live-tracking.svg";

export const ONBOARDING_DATA = [
  {
    title: "Fast Pickup & Delivery",
    description:
      "Schedule pickups at your convenience and get your laundry delivered fresh and clean",
    Svg: ScooterSvg,
  },
  {
    title: "Simple Bag-Based Pricing",
    description:
      "Get your laundry done for affordable pricing, saving you the hassle.",
    Svg: LaundrySvg,
  },
  {
    title: "Live Tracking & Trusted Drivers",
    description:
      "Track your laundry in real-time with our verified and trusted driver network",
    Svg: TrackingSvg,
  },
];
