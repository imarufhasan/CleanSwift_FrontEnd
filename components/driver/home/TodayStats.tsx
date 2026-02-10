import React from "react";
import { View, Text } from "react-native";
import { Feather, AntDesign, FontAwesome6 } from "@expo/vector-icons";

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
      <Text className="text-xs text-gray-400 mt-1">{subtitle}</Text>
    </View>
  );
};

export default function TodayStats() {
  return (
    <View className="mb-4">
      <Text className="text-lg font-semibold text-black mb-3">
        Today's Stats
      </Text>

      <View className="flex-row mb-3 gap-3">
        <StatCard
          title="Deliveries"
          value="12"
          subtitle="+3 from yesterday"
          iconBg="#EAF2FF"
          icon={<Feather name="box" size={18} color="#2563EB" />}
        />

        <StatCard
          title="Hours"
          value="6.5"
          subtitle="Active time"
          iconBg="#F3E8FF"
          icon={<Feather name="clock" size={18} color="#9333EA" />}
        />
      </View>

      <View className="flex-row gap-3">
        <StatCard
          title="Rating"
          value="4.9"
          subtitle="234 reviews"
          iconBg="#ECFDF3"
          icon={<FontAwesome6 name="arrow-trend-up" size={18} color="#16A34A" />}
        />

        <StatCard
          title="Tier"
          value="Gold"
          subtitle="Top 10%"
          iconBg="#FFF7ED"
          icon={<Feather name="star" size={18} color="#F97316" />}
        />
      </View>
    </View>
  );
}
