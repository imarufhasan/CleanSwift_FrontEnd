import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type RatingStarsProps = {
  rating: number;
  size?: number;
  color?: string;
};

export default function RatingStars({
  rating,
  size = 14,
  color = "#FACC15",
}: RatingStarsProps) {
  // Prevent invalid values
  const safeRating = Number.isFinite(rating)
    ? Math.min(Math.max(rating, 0), 5)
    : 0;

  const fullStars = Math.floor(safeRating);

  const hasHalfStar = safeRating - fullStars >= 0.5;

  const emptyStars = Math.max(
    0,
    5 - fullStars - (hasHalfStar ? 1 : 0)
  );

  return (
    <View className="flex-row items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Ionicons
          key={`full-${i}`}
          name="star"
          size={size}
          color={color}
        />
      ))}

      {hasHalfStar && (
        <Ionicons
          key="half"
          name="star-half"
          size={size}
          color={color}
        />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={size}
          color={color}
        />
      ))}
    </View>
  );
}