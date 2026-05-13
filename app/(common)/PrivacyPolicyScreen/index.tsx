import { ActivityIndicator, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGetPageBySlugQuery } from '@/src/services/pageApi';

const stripHtml = (value?: string) =>
  (value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const {
    title,
    data,
    slug: routeSlug,
  } = useLocalSearchParams<{
    title?: string;
    data?: string;
    slug?: string;
  }>();

  const slug =
    routeSlug ||
    (data === 'privacy' ? 'privacy-policy' : data === 'terms' ? 'terms-and-conditions' : 'about-us');

  const { data: pageRes, isLoading } = useGetPageBySlugQuery(slug);
  const page = pageRes?.data;
  const content = stripHtml(page?.content);
  const displayTitle = page?.title || title || '';

  return (
    <SafeAreaView className="flex-1 bg-white pb-[60px]">
      {/* Header */}
      <View className="flex-row items-center relative mt-5 mb-3">
        <TouchableOpacity onPress={() => router.back()} className="ml-4 bg-blue-100 p-2 rounded-full">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 items-center">
          <Text className="text-[22px] font-semibold">{displayTitle}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="bg-blue-100 rounded-2xl m-4 border-gray-200 mb-6">
        {isLoading ? (
          <View className="min-h-[240px] items-center justify-center">
            <ActivityIndicator color="#00a2ff" />
            <Text className="mt-3 text-gray-500">Loading content...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} className="p-6">
            <Text className="text-black text-base font-[400] leading-6 mb-10">{content}</Text>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
