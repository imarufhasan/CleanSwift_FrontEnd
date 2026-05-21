import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import ShowMessage from '@/constants/toast';

export default function StripeConnectReturn() {
  const { stripeConnect } = useLocalSearchParams<{ stripeConnect?: string }>();

  useEffect(() => {
    if (stripeConnect === 'refresh') {
      ShowMessage.show('Stripe session refreshed. Please continue onboarding.');
    } else {
      ShowMessage.show('Checking Stripe connection...');
    }

    router.replace('/(driver)/(tabs)/profile' as any);
  }, [stripeConnect]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#01A1FF" />
    </View>
  );
}
