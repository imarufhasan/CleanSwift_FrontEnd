import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function StripeConnectReturn() {
  const { stripeConnect } = useLocalSearchParams<{ stripeConnect?: string }>();

  useEffect(() => {
    router.replace({
      pathname: '/(driver)/(tabs)/profile' as any,
      params: {
        stripeConnect:
          stripeConnect === 'refresh' ? 'refresh' : 'success',
        stripeConnectCheckedAt: String(Date.now()),
      },
    });
  }, [stripeConnect]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#01A1FF" />
    </View>
  );
}
