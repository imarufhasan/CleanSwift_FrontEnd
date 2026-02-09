import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";

const messages = [
  {
    id: "1",
    name: "Michael Johnson",
    lastMessage: "I’m on my way with your order 🚗",
    time: "2 min ago",
    unread: 2,
    avatar: require("@/assets/images/profile.png"),
  },
  {
    id: "2",
    name: "Support Team",
    lastMessage: "Your issue has been resolved.",
    time: "1 hr ago",
    unread: 0,
    avatar: require("@/assets/images/profile.png"),
  },
  {
    id: "3",
    name: "Anna Driver",
    lastMessage: "Reached pickup location.",
    time: "Yesterday",
    unread: 1,
    avatar: require("@/assets/images/profile.png"),
  },
  {
    id: "4",
    name: "Anna Driver",
    lastMessage: "Reached pickup location.",
    time: "Yesterday",
    unread: 1,
    avatar: require("@/assets/images/profile.png"),
  },
  {
    id: "5",
    name: "Anna Driver",
    lastMessage: "Reached pickup location.",
    time: "Yesterday",
    unread: 1,
    avatar: require("@/assets/images/profile.png"),
  },
];

export default function MessagesScreen() {
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      className="flex-row items-center bg-white px-4 py-3 rounded-xl mb-3"
      onPress={() => {
        router.push(`/ChatScreen`);
      }}
    >
      {/* Avatar */}
      <Image source={item.avatar} className="w-12 h-12 rounded-full" />

      {/* Message Content */}
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-base">{item.name}</Text>
          <Text className="text-xs text-gray-400">{item.time}</Text>
        </View>

        <View className="flex-row justify-between items-center mt-1">
          <Text
            className={`text-sm ${
              item.unread > 0 ? "text-gray-900 font-medium" : "text-gray-500"
            }`}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          {item.unread > 0 && (
            <View
              className="ml-2 w-5 h-5 rounded-full justify-center items-center"
              style={{ backgroundColor: Colors.primary }}
            >
              <Text className="text-white text-xs font-bold">
                {item.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View
        className="pt-14 pb-4 px-5 flex-row items-center"
        style={{ backgroundColor: Colors.primary }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-[22px] font-semibold ml-4">
          Messages
        </Text>
      </View>

      {/* Message List */}
      <View className="px-5 mt-4">
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        />
      </View>

      {/* Floating New Message Button */}
      <TouchableOpacity
        className="absolute bottom-[50px] right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        style={{ backgroundColor: Colors.primary }}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
