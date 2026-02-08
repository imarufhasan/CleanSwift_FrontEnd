import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";

const notifications = [
  {
    id: "1",
    title: "Order Picked Up",
    message: "Your laundry has been picked up by the driver.",
    time: "5 min ago",
    icon: "cube-outline",
    color: Colors.primary,
    unread: true,
  },
  {
    id: "2",
    title: "Order Washing",
    message: "Your clothes are currently being washed.",
    time: "30 min ago",
    icon: "water-outline",
    color: "#F97316",
    unread: true,
  },
  {
    id: "3",
    title: "Order Delivered",
    message: "Your laundry has been delivered successfully.",
    time: "Yesterday",
    icon: "checkmark-circle-outline",
    color: Colors.green,
    unread: false,
  },
  {
    id: "4",
    title: "New Message",
    message: "Driver sent you a message.",
    time: "2 days ago",
    icon: "chatbubble-outline",
    color: "#8B5CF6",
    unread: false,
  },
];

export default function NotificationScreen() {
  const router = useRouter();
 
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      className={`flex-row p-6 rounded-2xl border-b border-blue-300 bg-white`}
    >
      {/* Icon */}
      <View
        className="w-12 h-12 rounded-full justify-center items-center mr-4"
        style={{ backgroundColor: `${item.color}20` }}
      >
        <Ionicons
          name={item.icon}
          size={22}
          color={item.color}
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-base">
            {item.title}
          </Text>
          <Text className="text-xs text-gray-400">
            {item.time}
          </Text>
        </View>

        <Text className="text-sm text-gray-600 mt-1">
          {item.message}
        </Text>
      </View>

      {/* Unread Dot */}
      {item.unread && (
        <View className="w-2 h-2 rounded-full bg-blue-500 ml-2 mt-2" />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        className="pt-14 pb-4 px-5 flex-row items-center"
        style={{ backgroundColor: Colors.primary }}
      >
        <TouchableOpacity className="bg-white rounded-full p-3" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text className="text-white text-[22px] font-semibold ml-4">
          Notifications
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="items-center mt-20">
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color="#9CA3AF"
            />
            <Text className="mt-3 text-gray-400">
              No notifications yet
            </Text>
          </View>
        )}
      />
    </View>
  );
}
