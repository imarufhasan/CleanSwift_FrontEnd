import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatChatTime } from "@/constants/chatTimes";
import ShowMessage from "@/constants/toast";
import * as ImagePicker from "expo-image-picker";
import {
  useGetChatMessagesQuery,
  useGetSupportMessagesQuery,
  useSendChatImageMutation,
  useSendChatMessageMutation,
  useSendSupportImageMutation,
  useSendSupportMessageMutation,
  type ChatMessage,
} from "@/src/services/chatApi";
import { useProfileInfoQuery } from "@/src/services/userApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";

const fallbackAvatar = require("@/assets/images/profile.png");

const getUserId = (value: ChatMessage["from"]) =>
  typeof value === "string" ? value : value ? value._id : undefined;

export default function ChatScreen() {
  const router = useRouter();
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const { orderId, name, avatar, support, to } = useLocalSearchParams<{
    orderId?: string;
    name?: string;
    avatar?: string;
    support?: string;
    to?: string;
  }>();
  const isSupportChat = support === "true";
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const { data: profileInfo } = useProfileInfoQuery();
  const currentUserId =
    profileInfo && profileInfo.data ? profileInfo.data._id : undefined;
  const { data, isLoading, refetch } = useGetChatMessagesQuery(orderId ?? "", {
    skip: isSupportChat || !orderId,
    pollingInterval: !isSupportChat && orderId ? 7000 : 0,
  });
  const {
    data: supportData,
    isLoading: isSupportLoading,
    refetch: refetchSupport,
  } = useGetSupportMessagesQuery(to ? { to } : undefined, {
    skip: !isSupportChat,
    pollingInterval: isSupportChat ? 7000 : 0,
  });
  const [sendChatMessage, { isLoading: isSending }] =
    useSendChatMessageMutation();
  const [sendSupportMessage, { isLoading: isSendingSupport }] =
    useSendSupportMessageMutation();
  const [sendChatImage, { isLoading: isUploadingImage }] =
    useSendChatImageMutation();
  const [sendSupportImage, { isLoading: isUploadingSupportImage }] =
    useSendSupportImageMutation();

  const messages = isSupportChat
    ? supportData && supportData.data
      ? supportData.data
      : []
    : data && data.data
      ? data.data
      : [];
  const isLoadingMessages = isSupportChat ? isSupportLoading : isLoading;
  const isSendingAny = isSending || isSendingSupport;
  const isUploadingAny = isUploadingImage || isUploadingSupportImage;

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const sendMessage = async () => {
    const content = message.trim();
    if (!content || isSendingAny) return;
    if (!isSupportChat && !orderId) return;

    try {
      if (isSupportChat) {
        await sendSupportMessage({ content, to }).unwrap();
        refetchSupport();
      } else {
        await sendChatMessage({ orderId: orderId ?? "", content }).unwrap();
        refetch();
      }
      setMessage("");
    } catch (error: any) {
      ShowMessage.show(
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to send message",
      );
    }
  };

  const sendImageMessage2 = async (imageUri: string) => {
    if (!orderId) return;
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: `chat-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      await sendChatImage({ orderId, image: formData }).unwrap();
      refetch();
    } catch (error: any) {
      ShowMessage.show(
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to send image",
      );
    }
  };
  const sendImageMessage = async (imageUri: string) => {
    if (!isSupportChat && !orderId) return;

    // সাথে সাথে UI তে দেখাও
    setPendingImages((prev) => [...prev, imageUri]);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: `chat-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      if (isSupportChat) {
        await sendSupportImage({ image: formData, to }).unwrap();
        refetchSupport();
      } else {
        await sendChatImage({ orderId: orderId ?? "", image: formData }).unwrap();
        refetch();
      }
    } catch (error: any) {
      ShowMessage.show(error?.data?.message ?? "Failed to send image");
    } finally {
      // upload শেষে pending থেকে সরাও
      setPendingImages((prev) => prev.filter((uri) => uri !== imageUri));
    }
  };

  const renderItem2 = ({ item }: { item: ChatMessage }) => {
    const isUser = getUserId(item.from) === currentUserId;

    return (
      <View
        className={`mb-3 flex-row ${isUser ? "justify-end" : "justify-start"}`}
      >
        <View
          className={`max-w-[75%] px-4 py-3 rounded-2xl ${
            isUser ? "rounded-br-none" : "rounded-bl-none bg-gray-200"
          }`}
          style={isUser ? { backgroundColor: Colors.primary } : undefined}
        >
          {item.contentType === "IMAGE" ? (
            <Image
              source={{ uri: item.content }}
              className="w-[180px] h-[180px] rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <Text
              className={`text-sm ${isUser ? "text-white" : "text-gray-800"}`}
            >
              {item.content}
            </Text>
          )}

          <Text
            className={`text-[10px] mt-1 ${isUser ? "text-white/70" : "text-gray-500"}`}
          >
            {item.createdAt ? formatChatTime(new Date(item.createdAt)) : ""}
          </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = getUserId(item.from) === currentUserId;

    return (
      <View
        className={`mb-4 flex-row items-end ${isUser ? "justify-end" : "justify-start"}`}
      >
        {/* Receiver avatar */}
        {!isUser && (
          <Image
            source={avatar ? { uri: String(avatar) } : fallbackAvatar}
            className="w-8 h-8 rounded-full mr-2 mb-1"
          />
        )}

        <View className={`max-w-[72%]`}>
          {/* Bubble */}
          <View
            className={`px-4 py-3 ${
              isUser
                ? "bg-blue-500 rounded-2xl rounded-br-sm"
                : "bg-white rounded-2xl rounded-bl-sm"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {item.contentType === "IMAGE" ? (
              <Image
                source={{ uri: item.content }}
                className="w-[180px] h-[180px] rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <Text
                className={`text-sm leading-5 ${isUser ? "text-white" : "text-gray-800"}`}
              >
                {item.content}
              </Text>
            )}
          </View>

          {/* Time — bubble এর নিচে */}
          <Text
            className={`text-[10px] mt-1 text-gray-400 ${isUser ? "text-right" : "text-left"}`}
          >
            {item.createdAt ? formatChatTime(new Date(item.createdAt)) : ""}
          </Text>
        </View>

        {/* Sender side spacer (avatar এর জায়গা) */}
        {/* {isUser && <View className="w-8 ml-2" />} */}
      </View>
    );
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      ShowMessage.show("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      sendImageMessage(result.assets[0].uri);
    }
  };

  if (!isSupportChat && !orderId) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View
          className="pt-14 pb-4 px-5 flex-row items-center"
          style={{ backgroundColor: Colors.primary }}
        >
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-2xl">Chat</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-600 text-center">
            Please open chat from an order.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View
          className="pt-14 pb-4 px-5 flex-row items-center"
          style={{ backgroundColor: Colors.primary }}
        >
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Image
            source={avatar ? { uri: String(avatar) } : fallbackAvatar}
            className="w-[45px] h-[45px] rounded-full"
          />

          <View className="ml-3 flex-1">
            <Text
              className="text-white font-semibold text-2xl"
              numberOfLines={1}
            >
              {name ?? "Chat"}
            </Text>
            <Text className="text-white/80 text-sm">
              {isSupportChat
                ? "Support"
                : `Order #${formatOrderNumber(orderId)}`}
            </Text>
          </View>

          {/* <TouchableOpacity onPress={() => router.push("/(common)/CallScreen")}>
            <Ionicons name="call-outline" size={22} color="#fff" />
          </TouchableOpacity> */}
        </View>

        {/* Messages */}
        {isLoadingMessages ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 16,
            }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            ListEmptyComponent={
              <View className="items-center mt-20">
                <Text className="text-gray-500">No messages yet</Text>
              </View>
            }
          />
        )}

        {/* Pending / optimistic images */}
        {pendingImages.map((uri) => (
          <View key={uri} className="mb-4 flex-row justify-end px-4">
            <View className="max-w-[72%]">
              <View
                className="bg-blue-500 rounded-2xl rounded-br-sm p-1 opacity-80"
                style={{ elevation: 2 }}
              >
                <Image
                  source={{ uri }}
                  className="w-[180px] h-[180px] rounded-xl"
                  resizeMode="cover"
                />
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{ position: "absolute", bottom: 8, right: 8 }}
                />
              </View>
              <Text className="text-[10px] mt-1 text-gray-400 text-right">
                Sending...
              </Text>
            </View>
          </View>
        ))}

        {/* Input */}
        {/* Input */}
        <View
          className="flex-row items-end bg-white px-4 py-3 border-t border-gray-200"
          style={{ paddingBottom: Platform.OS === "android" ? 12 : 3 }}
        >
          <View
            className="flex-row flex-1 items-end bg-gray-100 rounded-2xl px-4"
            style={{ minHeight: 46 }}
          >
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              placeholderTextColor="#9CA3AF"
              multiline
              scrollEnabled
              style={{
                flex: 1,
                fontSize: 14,
                paddingTop: 12,
                paddingBottom: 12,
                maxHeight: 120, // ~5 lines
                color: "#111827",
              }}
            />

            <TouchableOpacity
              onPress={pickImage}
              disabled={isSendingAny || isUploadingAny}
              style={{ paddingBottom: 12, paddingLeft: 8 }}
            >
              {isUploadingAny ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Ionicons
                  name="image-outline"
                  size={22}
                  color={Colors.primary}
                />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={isSendingAny || !message.trim()}
            style={{ marginLeft: 10, marginBottom: 6 }}
          >
            <Ionicons
              name="send"
              size={22}
              color={message.trim() ? Colors.primary : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
