import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";

const menuItems = [
  { label: "Profile Setting", icon: "person-outline" },
  { label: "Payment Methods", icon: "card-outline" },
  { label: "Change password", icon: "lock-closed-outline" },
  { label: "Support", icon: "help-circle-outline" },
  { label: "About Us", icon: "information-circle-outline" },
  { label: "Privacy Policy", icon: "shield-checkmark-outline" },
  { label: "Terms and Conditions", icon: "document-text-outline" },
];

export default function Profile() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-[#F6F9FF]">
      {/* Header */}
      <View
        style={{ backgroundColor: Colors.primary }}
        className="pt-14 pb-20 px-5 rounded-b-[32px]"
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            className="w-[70px] h-[70px] rounded-full border-2 border-white"
          />
          <View className="ml-3 flex-1">
            <Text className="text-white text-[20px] font-bold">Ali Amin</Text>
            <Text className="text-white/80 text-sm">aliamin@gmail.com</Text>
          </View>

          {/* <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <Ionicons name="settings-outline" size={20} color="#fff" />
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Stats */}
      <View className="px-5 -mt-12">
        <View className="bg-white rounded-2xl flex-row py-4 shadow-sm">
          <View className="flex-1 items-center border-r border-gray-200">
            <Text className="text-[28px] font-bold">28</Text>
            <Text className="text-gray-500 text-sm">Total Orders</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="font-bold text-[28px]">$560</Text>
            <Text className="text-gray-500 text-sm">Total Spent</Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <View className="px-5 mt-6">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white flex-row items-center p-4 rounded-xl mb-3 border border-blue-200"
            onPress={() => {
              if (item.label === "Profile Setting") {
                router.push("/profileSettings");
              } else if (item.label === "Payment Methods") {
                //router.push("/paymentMethods");
              } else if (item.label === "Change password") {
                router.push("/changePassword");
              } else if (item.label === "Support") {
                //router.push("/support");
              } else if (item.label === "About Us") {
                //router.push("/aboutUs");
              } else if (item.label === "Privacy Policy") {
                //router.push("/privacyPolicy");
              } else if (item.label === "Terms and Conditions") {
                //router.push("/termsAndConditions");
              }
            }}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={Colors.primary}
            />
            <Text className="ml-3 flex-1 font-medium">{item.label}</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <View className="px-5 mt-4 mb-10">
        <TouchableOpacity className="border border-red-400 rounded-xl py-4 flex-row justify-center items-center">
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 font-semibold ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
