import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/color';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatChatTime } from '@/constants/chatTimes';
import ShowMessage from '@/constants/toast';
import * as ImagePicker from 'expo-image-picker';
import {
  useGetChatMessagesQuery,
  useSendChatImageMutation,
  useSendChatMessageMutation,
  type ChatMessage,
} from '@/src/services/chatApi';
import { useProfileInfoQuery } from '@/src/services/userApi';

const fallbackAvatar = require('@/assets/images/profile.png');

const getUserId = (value: ChatMessage['from']) => (typeof value === 'string' ? value : value?._id);

export default function ChatScreen() {
  const router = useRouter();
  const { orderId, name, avatar } = useLocalSearchParams<{
    orderId?: string;
    name?: string;
    avatar?: string;
  }>();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data: profileInfo } = useProfileInfoQuery();
  const currentUserId = profileInfo?.data?._id;
  const { data, isLoading, refetch } = useGetChatMessagesQuery(orderId ?? '', {
    skip: !orderId,
    pollingInterval: orderId ? 7000 : 0,
  });
  const [sendChatMessage, { isLoading: isSending }] = useSendChatMessageMutation();
  const [sendChatImage, { isLoading: isUploadingImage }] = useSendChatImageMutation();

  const messages = data?.data ?? [];

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const sendMessage = async () => {
    const content = message.trim();
    if (!content || !orderId || isSending) return;

    try {
      await sendChatMessage({ orderId, content }).unwrap();
      setMessage('');
      refetch();
    } catch (error: any) {
      ShowMessage.show(error?.data?.message ?? 'Failed to send message');
    }
  };

  const sendImageMessage = async (imageUri: string) => {
    if (!orderId) return;
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: `chat-${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as any);

      await sendChatImage({ orderId, image: formData }).unwrap();
      refetch();
    } catch (error: any) {
      ShowMessage.show(error?.data?.message ?? 'Failed to send image');
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = getUserId(item.from) === currentUserId;

    return (
      <View className={`mb-3 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
        <View
          className={`max-w-[75%] px-4 py-3 rounded-2xl ${
            isUser ? 'rounded-br-none' : 'rounded-bl-none bg-gray-200'
          }`}
          style={isUser ? { backgroundColor: Colors.primary } : undefined}
        >
          {item.contentType === 'IMAGE' ? (
            <Image
              source={{ uri: item.content }}
              className="w-[180px] h-[180px] rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <Text className={`text-sm ${isUser ? 'text-white' : 'text-gray-800'}`}>{item.content}</Text>
          )}

          <Text className={`text-[10px] mt-1 ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
            {item.createdAt ? formatChatTime(new Date(item.createdAt)) : ''}
          </Text>
        </View>
      </View>
    );
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      ShowMessage.show('Permission required');
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

  if (!orderId) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="pt-14 pb-4 px-5 flex-row items-center" style={{ backgroundColor: Colors.primary }}>
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-semibold text-2xl">Chat</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-600 text-center">Please open chat from an order.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View className="pt-14 pb-4 px-5 flex-row items-center" style={{ backgroundColor: Colors.primary }}>
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Image
            source={avatar ? { uri: String(avatar) } : fallbackAvatar}
            className="w-[45px] h-[45px] rounded-full"
          />

          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold text-2xl" numberOfLines={1}>
              {name ?? 'Chat'}
            </Text>
            <Text className="text-white/80 text-sm">Order #{orderId.slice(-6)}</Text>
          </View>

          {/* <TouchableOpacity onPress={() => router.push("/(common)/CallScreen")}>
            <Ionicons name="call-outline" size={22} color="#fff" />
          </TouchableOpacity> */}
        </View>

        {/* Messages */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item._id}
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

            <TouchableOpacity onPress={pickImage} disabled={isSending || isUploadingImage}>
              <Ionicons name="image-outline" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={sendMessage} disabled={isSending || !message.trim()} className="ml-3">
            <Ionicons name="send" size={22} color={message.trim() ? Colors.primary : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
