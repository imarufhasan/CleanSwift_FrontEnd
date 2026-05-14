import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/color';
import { useLocalSearchParams, router } from 'expo-router';
import ShowMessage from '@/constants/toast';
import { useConfirmPaymentMutation } from '@/src/services/paymentApi';
import { formatOrderNumber } from '@/src/utils/orderNumber';

export default function DeliveredSuccessScreen() {
  const { name, image, orderId, service, bags, bagPrice, tip } = useLocalSearchParams<{
    name?: string;
    image?: string;
    orderId?: string;
    service?: string;
    bags?: string;
    bagPrice?: string;
    tip?: string;
  }>();

  const [tipValue, setTipValue] = useState(tip ?? '');
  const [tipValueCustom, setTipValueCustom] = useState('');
  const [confirmPaymentModal, setConfirmPaymentModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [confirmPayment, { isLoading }] = useConfirmPaymentMutation();

  const bagsCount = Number(bags ?? 0);
  const perBag = Number(bagPrice ?? 0);
  const tipAmount = Number(tipValue || tipValueCustom || tip || 0);
  const total = bagsCount * perBag + tipAmount;

  const handleCompletePayment = async () => {
    if (!orderId) {
      ShowMessage.error('Order not found');
      return;
    }

    try {
      await confirmPayment({
        orderId: String(orderId),
        tipAmount,
      }).unwrap();
      setConfirmPaymentModal(true);
    } catch (error: any) {
      ShowMessage.error(
        error && error.data && error.data.message
          ? error.data.message
          : 'Failed to complete payment',
      );
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Content */}
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <View style={{ backgroundColor: Colors.primary }} className="pt-14 pb-[50px] items-center relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-5 top-14 bg-white p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>

          <View className="bg-white p-4 rounded-full mb-4">
            <Ionicons name="checkmark-circle-outline" size={32} color={Colors.primary} />
          </View>

          <Text className="text-white text-xl font-semibold">Delivered Successfully!</Text>
          <Text className="text-white/80 mt-1">Order #{formatOrderNumber(orderId)}</Text>
        </View>

        <View className="rounded-xl mt-5 mb-6 px-5">
          {/* Delivery Person */}
          <View className="bg-white rounded-2xl border shadow-sm border-gray-100 p-4 -mt-12 z-10 flex-row items-center">
            <Image
              source={image ? { uri: String(image) } : require('@/assets/images/profile.png')}
              className="w-14 h-14 rounded-full mr-4"
            />

            <View className="flex-1">
              <Text className="text-gray-500 text-xs mb-1">Delivered by</Text>
              <Text className="text-black font-semibold text-[20px]">{name ?? 'Driver'}</Text>

              <View className="flex-row items-center mt-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <AntDesign key={i} name="star" size={14} color="#FACC15" />
                ))}
                <Text className="text-gray-400 text-xs ml-2">4.9 (234 trips)</Text>
              </View>
            </View>
          </View>

          {/* Rating */}
          <View className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 mt-4 items-center">
            <Text className="text-black font-semibold mb-3">How was your experience?</Text>

            {/* <View className="flex-row mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Feather
                  key={i}
                  name="star"
                  size={32}
                  color="#FACC15"
                  className="mx-1"
                />
              ))}
            </View> */}
            <View className="flex-row mb-2">
              {[1, 2, 3, 4, 5].map(i => {
                const isSelected = i <= rating;

                return (
                  <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
                    <FontAwesome
                      name={isSelected ? 'star' : 'star-o'}
                      size={32}
                      color="#FACC15"
                      style={{ marginHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-gray-400 text-sm">Tap to rate</Text>
          </View>

          {/* Tip */}
          <View className="mb-6">
            <View className="flex-row">
              <Ionicons name="gift-outline" size={18} color="blue" className="mr-2" />
              <Text className="font-semibold text-black mb-1">Add a Tip (Optional)</Text>
            </View>
            <Text className="text-gray-400 text-sm mb-3">Show your appreciation for great service</Text>

            <View className="flex-row justify-between mb-3">
              {/* {data.tipOptions.map((tip) => (
                <TouchableOpacity
                  key={tip.id}
                  onPress={() => setTipValue(tip.value.toString())}
                  className="border border-gray-200 px-5 py-3 rounded-xl"
                >
                  <Text className="font-semibold">{tip.label}</Text>
                </TouchableOpacity>
              ))} */}

              {[2, 3, 5, 10].map(value => {
                const isSelected = tipValue === value.toString();

                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => {
                      setTipValue(value.toString());
                      setTipValueCustom('');
                    }}
                    className={`px-5 py-3 rounded-xl border ${
                      isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-black'}`}>
                      ${value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="mb-4 border border-gray-200 rounded-xl p-4">
              <Text className="text-gray-400 text-sm mb-1">Custom Tip Amount</Text>

              <View className="border flex-row justify-start items-center border-gray-200 rounded-xl px-4 py-3">
                <Text className="text-gray-600 text-lg">$</Text>
                <TextInput
                  value={tipValueCustom}
                  onChangeText={text => setTipValueCustom(text)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  className="text-black"
                />
              </View>
            </View>
          </View>

          {/* Payment Summary */}
          <View className="mb-6">
            <Text className="font-semibold text-black mb-3">Payment Summary</Text>

            {[
              ['Service', service ?? '-'],
              ['Bags', `${bagsCount || 0} bag`],
              ['Tip', `$${tipAmount}`],
              ['Pickup Time', 'ASAP'],
            ].map(([label, value]) => (
              <View key={label} className="flex-row justify-between mb-2">
                <Text className="text-gray-500">{label}</Text>
                <Text className="text-black">{value}</Text>
              </View>
            ))}

            <View className="flex-row justify-between mt-3">
              <Text className="font-bold text-black">Total</Text>
              <Text className="font-bold text-[#0A8CFF]">${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl mb-8">
            <View className="flex-row items-center">
              <View style={{ backgroundColor: Colors.primary }} className="rounded-full p-2">
                <Ionicons name="card" size={22} color="#fff" />
              </View>
              <View className="ml-3">
                <Text className="text-gray-500 text-sm mb-1">Payment Method</Text>
                <Text className="text-black">Visa •••• 4242</Text>
              </View>
            </View>
            <Text className="text-[#0A8CFF] font-semibold">Change</Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleCompletePayment}
            disabled={isLoading}
            className="bg-[#0A8CFF] py-4 rounded-2xl mb-[50px] flex-row items-center justify-center"
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" className="mx-2" />
            <Text className="text-white text-center font-bold text-lg">
              {isLoading ? 'Processing...' : `Complete Payment $${total.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Payment Modal */}
      {confirmPaymentModal && (
        <Modal
          transparent
          visible={confirmPaymentModal}
          animationType="fade"
          onRequestClose={() => setConfirmPaymentModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl py-6 px-4 w-[90%] items-center justify-center">
              <View className="justify-center items-center bg-blue-100 w-[70px] h-[70px] p-4 rounded-full">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={38}
                  color={Colors.primary}
                  className="mx-auto"
                />
              </View>
              <Text className="text-[24px] font-bold text-center mb-4 mt-4">Thank You!</Text>
              <Text className="text-gray-500 text-center mb-6">
                Your payment of ${total.toFixed(2)} has been completed successfully!
              </Text>

              <View className="bg-gray-50 w-full rounded-xl shadow-sm mb-6 items-center">
                <Text className="text-gray-500 text-center mb-1">
                  Your feedback helps us serve you better.
                </Text>
                <View className="flex-row mt-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <AntDesign key={i} name="star" size={30} color="#FACC15" className="mr-2" />
                  ))}
                </View>
                <Text className="text-gray-400 text-sm mb-4 mt-1">You rated {name ?? 'Driver'} 5 stars</Text>
              </View>

              <View className="flex-row items-center mb-4 border bg-blue-100 border-blue-500 rounded-xl px-4 py-3 w-full justify-center">
                <Text className="text-[#0A8CFF] font-semibold">Download Invoice</Text>
                <Ionicons name="download-outline" size={18} color={Colors.primary} className="ml-2" />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setConfirmPaymentModal(false);
                }}
                style={{ backgroundColor: Colors.primary }}
                className="w-full py-3 rounded-2xl mb-4 flex-row items-center justify-center"
              >
                <Text className="text-white text-center font-bold text-lg">Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
