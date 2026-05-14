import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatChatTime } from "@/constants/chatTimes";
import ShowMessage from "@/constants/toast";
import { useProfileInfoQuery } from "@/src/services/userApi";
import * as ImagePicker from "expo-image-picker";

type SupportMessage = {
  id: string;
  text?: string;
  imageUri?: string;
  sender: string;
  time: string;
};

export default function supportScreen() {
  const router = useRouter();
  const { data: profileInfo } = useProfileInfoQuery();
  const driver = {
    name: profileInfo?.data?.name ?? "Support",
    avatar: profileInfo?.data?.image
      ? { uri: profileInfo.data.image }
      : require("@/assets/images/profile.png"),
    online: true,
  };
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message,
        sender: "user",
        time: formatChatTime(new Date()),
      },
    ]);
    setMessage("");
  };

  const sendImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      ShowMessage.error("Gallery permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
    });

    if (result.canceled) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        imageUri: result.assets[0].uri,
        sender: "user",
        time: formatChatTime(new Date()),
      },
    ]);
  };

  const renderItem = ({ item }: any) => {
    const isUser = item.sender === "user";

    return (
      <View
        className={`mb-3 flex-row ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <Image
            source={driver?.avatar}
            className="w-8 h-8 rounded-full mr-2 self-end"
          />
        )}

        <View
          className={`max-w-[75%] px-4 py-3 rounded-2xl ${
            isUser ? "rounded-br-none" : "rounded-bl-none bg-gray-200"
          }`}
          style={isUser ? { backgroundColor: Colors.primary } : undefined}
        >
          {item.imageUri ? (
            <Image
              source={{ uri: item.imageUri }}
              className="w-[180px] h-[180px] rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <Text
              className={`text-sm ${isUser ? "text-white" : "text-gray-800"}`}
            >
              {item.text}
            </Text>
          )}

          <Text
            className={`text-[10px] mt-1 ${
              isUser ? "text-white/70" : "text-gray-500"
            }`}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
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
            source={driver?.avatar}
            className="w-10 h-10 rounded-full"
          />

          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold text-base">
              {profileInfo?.data?.name ?? "Support"}
            </Text>
            <Text className="text-white/80 text-xs">
              {driver.online ? "Online" : "Offline"}
            </Text>
          </View>

          {/* <TouchableOpacity>
            <Ionicons name="call-outline" size={22} color="#fff" />
          </TouchableOpacity> */}
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListEmptyComponent={
            <View className="items-center mt-20 px-6">
              <Text className="text-gray-500 text-center">
                No messages yet. Send a message to start the conversation.
              </Text>
            </View>
          }
        />

        {/* Input */}
        <View className="flex-row items-center bg-white px-4 py-3 border-t border-gray-200">
          <View className="flex-row flex-1 items-center bg-gray-100 rounded-full px-4">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              className="flex-1 py-3 text-sm"
              placeholderTextColor="#9CA3AF"
              multiline
            />

            <TouchableOpacity onPress={sendImage}>
              <Ionicons name="image-outline" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={sendMessage} className="ml-3">
            <Ionicons name="send" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
