import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import privacyPolicy from "@/data/privacyPolicy";
import termsAndCondition from "@/data/termsAndCondition";
import aboutUs from "@/data/aboutUs";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { title, data } = useLocalSearchParams<{
    title?: string;
    data?: string;
  }>();

  const content =
    data === "privacy"
      ? privacyPolicy
      : data === "terms"
        ? termsAndCondition
        : aboutUs;

  return (
    <SafeAreaView className="flex-1 bg-white pb-[60px]">
      {/* Header */}
      <View className="flex-row items-center relative mt-5 mb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="ml-4 bg-blue-100 p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 items-center">
          <Text className="text-[22px] font-semibold">{title}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="bg-blue-100 rounded-2xl m-4 border-gray-200 mb-6">
        <ScrollView showsVerticalScrollIndicator={false} className="p-6">
          <Text className="text-black text-base font-[400] leading-6 mb-10">
            {content}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
