// home/components/HeaderSection.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";

type Location = {
  title: string;
  street: string;
  city: string;
  state: string;
};

type Props = {
  userName: string;
  notificationCount: number;
  location: Location;
  profileInfo: any;
};

export default function HeaderSection({
  userName,
  notificationCount,
  location,
  profileInfo,
}: Props) {
  const router = useRouter();

  // console.log("profileInfo: ", profileInfo);
  

  return (
    <View
      style={{ backgroundColor: Colors.primary }}
      className="rounded-b-[40px] pb-20"
    >
      {/* Top row: Welcome & Notification */}
      <View className="flex-row px-5 pt-12 justify-between items-center">
        <View className="flex-1">
          <Text className="text-sm text-white/80">Welcome back,</Text>
          <Text className="text-2xl font-bold text-white">{profileInfo?.data?.name}</Text>
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.push("/(common)/notifications")}
            className="bg-white/20 p-3 rounded-full relative"
          >
            <Ionicons name="notifications-outline" size={22} color="#fff" />

            {notificationCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 min-w-[22px] min-h-[22px] rounded-full justify-center items-center px-1">
                <Text className="text-white text-[8px]">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Card */}
      <View className="px-5 mt-8">
        <View
          style={{ backgroundColor: Colors.primary }}
          className="border border-white/40 rounded-2xl p-4"
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-row items-start">
              <View className="bg-white/20 w-9 h-9 rounded-full justify-center items-center">
                <Ionicons name="location-outline" size={18} color="#fff" />
              </View>

              <View className="ml-3">
                <Text className="text-white font-semibold">{location.title}</Text>
                <Text className="text-white text-lg">{location.street}</Text>
                <Text className="text-white text-sm">
                  {location.city}, {location.state}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(common)/ChangeLocation")}
            >
              <Text className="text-white font-medium">Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}