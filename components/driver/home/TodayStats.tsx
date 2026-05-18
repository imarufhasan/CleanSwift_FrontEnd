import React from "react";
import { View, Text } from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";

type TodayStatsProps = {
  deliveries: number;
  hours: number;
  ratingText: string;
  ratingSubtitle: string;
  tierText: string;
  tierSubtitle: string;
};

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  iconBg: string;
}) => {
  return (
    <View className="flex-1 bg-white rounded-2xl p-4 shadow-lg">
      <View className="flex-row items-center mb-2">
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </View>
        <Text className="ml-2 text-gray-500 text-sm">{title}</Text>
      </View>

      <Text className="text-2xl font-bold text-black">{value}</Text>
      <Text className={`text-xs ${title === "Deliveries" ? "text-green-500" : "text-gray-400"}  mt-4`}>{subtitle}</Text>
    </View>
  );
};

export default function TodayStats({
  deliveries,
  hours,
  ratingText,
  ratingSubtitle,
  tierText,
  tierSubtitle,
}: TodayStatsProps) {
  return (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-black mb-3">
        Today's Stats
      </Text>

      <View className="flex-row mb-3 gap-3">
        <StatCard
          title="Deliveries"
          value={String(deliveries)}
          subtitle="Completed today"
          iconBg="#EAF2FF"
          icon={<Feather name="box" size={18} color="#2563EB" />}
        />

        <StatCard
          title="Hours"
          value={hours.toFixed(1)}
          subtitle="Active today"
          iconBg="#F3E8FF"
          icon={<Feather name="clock" size={18} color="#9333EA" />}
        />
      </View>

      <View className="flex-row gap-3">
        <StatCard
          title="Rating"
          value={ratingText}
          subtitle={ratingSubtitle}
          iconBg="#ECFDF3"
          icon={<FontAwesome6 name="arrow-trend-up" size={18} color="#16A34A" />}
        />

        <StatCard
          title="Tier"
          value={tierText}
          subtitle={tierSubtitle}
          iconBg="#FFF7ED"
          icon={<Feather name="star" size={18} color="#F97316" />}
        />
      </View>
    </View>
  );
}
