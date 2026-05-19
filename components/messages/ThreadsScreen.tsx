import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import { useGetChatThreadsQuery, type ChatThread } from "@/src/services/chatApi";
import { useProfileInfoQuery } from "@/src/services/userApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";

const fallbackAvatar = require("@/assets/images/profile.png");

const formatTime = (date?: string) => {
  if (!date) return "";
  const value = new Date(date);
  const diff = Date.now() - value.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return value.toLocaleDateString();
};

export default function ThreadsScreen() {
  const router = useRouter();
  const { data: profileInfo } = useProfileInfoQuery();
  const { data, isLoading, refetch, isFetching } = useGetChatThreadsQuery();
  const currentRole =
    profileInfo && profileInfo.data ? profileInfo.data.role : undefined;
  const threads = (data && data.data ? data.data : []).filter(
    (item) => item.threadType !== "SUPPORT" && Boolean(item.orderId),
  );

  const getPeer = (item: ChatThread) =>
    currentRole === "DRIVER" ? item.customer : item.driver ?? item.customer;

  const renderItem = ({ item }: { item: ChatThread }) => {
    const peer = getPeer(item);
    const name = peer && peer.name ? peer.name : `Order #${formatOrderNumber(item.orderId)}`;
    const avatar = peer && peer.image ? peer.image : "";

    return (
      <TouchableOpacity
        className="flex-row items-center bg-white px-4 py-3 rounded-xl mb-3"
        onPress={() =>
          router.push({
            pathname: "/(common)/ChatScreen" as any,
            params: { orderId: item.orderId, name, avatar },
          })
        }
      >
        <Image
          source={avatar ? { uri: avatar } : fallbackAvatar}
          className="w-12 h-12 rounded-full"
        />

        <View className="flex-1 ml-3">
          <View className="flex-row justify-between items-center">
            <Text className="font-semibold text-base flex-1" numberOfLines={1}>
              {name}
            </Text>
            <Text className="text-xs text-gray-400 ml-2">
              {formatTime(item.lastMessageAt)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mt-1">
            <Text
              className={`text-sm flex-1 ${
                item.unreadCount ? "text-gray-900 font-medium" : "text-gray-500"
              }`}
              numberOfLines={1}
            >
              {item.lastContentType === "IMAGE"
                ? "Sent an image"
                : item.lastMessage ||
                  (item.order ? item.order.status : "") ||
                  "No messages yet"}
            </Text>

            {!!item.unreadCount && (
              <View
                className="ml-2 min-w-[20px] h-5 rounded-full justify-center items-center px-1"
                style={{ backgroundColor: Colors.primary }}
              >
                <Text className="text-white text-xs font-bold">
                  {item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

      <View className="px-5 mt-4 flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={threads}
            keyExtractor={(item) => String(item.orderId)}
            renderItem={renderItem}
            refreshing={isFetching}
            onRefresh={refetch}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
            ListEmptyComponent={
              <View className="items-center mt-20">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={44}
                  color="#9CA3AF"
                />
                <Text className="text-gray-500 mt-3">No messages yet</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
