import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, Dimensions, TextInput } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/color';

const { height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  confirmed: boolean;
  setConfirmed: (value: boolean) => void;
  pickupData: {
    asap: boolean;
    date: Date | null;
    time: Date | null;
    bags: number;
  };
  setPickupData: (data: Props['pickupData']) => void;
  openDatePicker: () => void;
  openTimePicker: () => void;
  pricePerBag?: number;
  isSubmitting?: boolean;
  onConfirmRequest?: (payload: {
    bags: number;
    pickupType: 'ASAP' | 'SCHEDULED';
    scheduledPickupAt?: string;
    specialInstructions?: string;
  }) => Promise<void> | void;
};

type Step = 0 | 1 | 2 | 3 | 4;

export default function RequestPickupModal({
  visible,
  onClose,
  confirmed,
  setConfirmed,
  pickupData,
  setPickupData,
  openDatePicker,
  openTimePicker,
  pricePerBag = 45,
  isSubmitting = false,
  onConfirmRequest,
}: Props) {
  const [internalVisible, setInternalVisible] = useState(visible);
  const [step, setStep] = useState<Step>(0);
  const [bags, setBags] = useState(pickupData.bags);
  const [selectAsap, setSelectAsap] = useState(pickupData.asap);
  const [selectedInstruction, setSelectedInstruction] = useState<number | null>(1);
  const [customInstruction, setCustomInstruction] = useState('');

  const translateY = useRef(new Animated.Value(height)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const dataLoal = {
    service: {
      name: 'Washing & Drying',
      pricePerBag,
    },
    spacialInstructions: [
      {
        id: 1,
        title: 'Light Wash',
        description: 'Gentle wash for delicate clothes',
      },
      {
        id: 2,
        title: 'Cold Wash Only',
        description: 'Wash using cold water only',
      },
      {
        id: 3,
        title: 'Do Not Mix Colors',
        description: 'Wash separately to avoid color bleeding',
      },
    ],
  };

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      setStep(0);
      setBags(1);

      // reset animation values
      translateY.setValue(height);
      overlayOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 22,
          stiffness: 160,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false);
      });
    }
  }, [visible]);

  if (!internalVisible) return null;

  return (
    <Modal transparent visible animationType="none">
      {/* Overlay */}
      <Animated.View style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black/40">
        <TouchableOpacity className="flex-1" onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className="absolute bottom-0 w-full bg-white rounded-t-3xl  pt-4 pb-[50px]"
      >
        {/* Header */}
        <View className="px-5 flex-row justify-between items-center mb-3">
          <Text className="text-[20px] font-bold">New Request</Text>
          <TouchableOpacity className="bg-gray-200 rounded-full p-2" onPress={onClose}>
            <Ionicons name="close" size={20} />
          </TouchableOpacity>
        </View>

        <View className="bg-gray-300 rounded h-[1px] mb-6" />

        {/* Progress Bar */}
        <View className="px-5 flex-row mb-5">
          {[0, 1, 2, 3, 4].map(i => (
            <View
              key={i}
              className={`flex-1 h-1 mx-1 rounded-full ${step >= i ? 'bg-blue-500' : 'bg-gray-200'}`}
            />
          ))}
        </View>

        {/* STEP 1: Service */}
        {step === 0 && (
          <View className="px-5">
            <Text className="text-[22px] font-semibold mb-4">Service</Text>
            <View className="items-start gap-3 flex-row border border-blue-500 rounded-2xl p-4 mb-6">
              <View className="bg-blue-100 rounded-full p-2">
                <Ionicons name="cube-outline" size={22} color="#2563EB" />
              </View>
              <View>
                <View className="flex-row items-center mb-1">
                  <Text className="font-semibold">{dataLoal.service.name}</Text>
                </View>
                <Text className="text-gray-500 text-sm">Standard wash & dry service</Text>
                <Text className="text-blue-500 font-semibold mt-2">
                  ${dataLoal.service.pricePerBag} per bag
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: Bags */}
        {step === 1 && (
          <View className="px-5">
            <Text className="text-[22px] font-semibold mb-4">How many bags?</Text>

            <View className="bg-white border border-gray-100 shadow-transparent flex-row gap-1 rounded-xl p-3 mb-4">
              <View>
                <Ionicons name="information-circle-outline" size={22} color={Colors.primary} />
              </View>
              <View className="mb-2"></View>
              <View>
                <Text className="text-[13px] text-gray-500">1 bag ≈ 1 washing machine load</Text>
                <Text className="text-[13px] text-gray-500">Approximately 15–20 items</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center mb-4">
              <TouchableOpacity
                className="bg-gray-200 w-[45px] h-[45px] rounded-full items-center justify-center"
                onPress={() => setBags(Math.max(1, bags - 1))}
              >
                <Ionicons name="remove" size={18} />
              </TouchableOpacity>

              <View className="mx-[30px] items-center">
                <Text className="text-[34px] font-semibold">{bags}</Text>
                <Text className="text-sm text-gray-500">bags</Text>
              </View>

              <TouchableOpacity
                style={{ backgroundColor: Colors.primary }}
                className="w-[45px] h-[45px] rounded-full items-center justify-center"
                onPress={() => setBags(bags + 1)}
              >
                <Ionicons name="add" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <View className="bg-white border border-gray-200 shadow-transparent flex-row gap-1 rounded-xl p-3 mb-4">
              <View>
                <Text className="text-[13px] text-black font-semibold">
                  Total Cost : ${bags * dataLoal.service.pricePerBag}
                </Text>
              </View>
              <View className="ml-auto">
                <Text className="text-[13px] text-gray-500">{bags} bags</Text>
                <Text className="text-[13px] text-gray-500">${dataLoal.service.pricePerBag} per bag</Text>
              </View>
            </View>
          </View>
        )}

        {/* STEP 3: Instructions */}
        {/* {step === 2 && (
          <View className="px-5">
            <Text className="text-[22px] font-semibold mb-2">
              Special Instructions
            </Text>
            <Text className="text-sm text-gray-500 mb-4">
              Add any specific care instructions for your laundry? (optional)
            </Text>

            {dataLoal.spacialInstructions.map((item) => (
              <View
                key={item.id}
                className="border border-gray-100 bg-white rounded-xl p-3 mb-2"
              >
                <Text className="font-medium">{item.title}</Text>
                <Text className="text-xs text-gray-500">
                  {item.description}
                </Text>
              </View>
            ))}

            <View className="border border-gray-100 bg-white rounded-xl p-3 mb-2">
              <TextInput
                placeholder="Or write custom instructions..."
                multiline
                textAlignVertical="top"
                value={customInstruction}
                onChangeText={setCustomInstruction}
                className="text-sm text-gray-500 min-h-[80px]"
              />
            </View>
          </View>
        )} */}
        {/* STEP 3: Instructions */}
        {step === 2 && (
          <View className="px-5">
            <Text className="text-[22px] font-semibold mb-2">Special Instructions</Text>
            <Text className="text-sm text-gray-500 mb-4">
              Add any specific care instructions for your laundry? (optional)
            </Text>

            {dataLoal.spacialInstructions.map(item => {
              const isSelected = selectedInstruction === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  // onPress={() => setSelectedInstruction(item.id)}
                  onPress={() => {
                    if (selectedInstruction === item.id) {
                      setSelectedInstruction(null);
                    } else {
                      setSelectedInstruction(item.id);
                    }
                  }}
                  className={`border rounded-xl p-3 mb-2 flex-row items-center justify-between ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'
                  }`}
                >
                  <View>
                    <Text className={`font-medium ${isSelected ? 'text-blue-500' : 'text-black'}`}>
                      {item.title}
                    </Text>
                    <Text className="text-xs text-gray-500">{item.description}</Text>
                  </View>

                  {isSelected && <AntDesign name="check-circle" size={20} color={Colors.primary} />}
                </TouchableOpacity>
              );
            })}

            <View className="border border-gray-100 bg-white rounded-xl p-3 mt-3">
              <TextInput
                placeholder="Or write custom instructions..."
                multiline
                textAlignVertical="top"
                className="text-sm text-gray-500 min-h-[80px]"
              />
            </View>
          </View>
        )}

        {/* step 4 pickup time */}
        {step === 3 && (
          <View className="px-5">
            <Text className="text-[22px] font-semibold mb-3">Pickup Time</Text>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
              <Text className="text-sm text-gray-500">Select a convenient pickup time for your laundry</Text>
            </View>

            <View className=" justify-between">
              <TouchableOpacity
                onPress={() => setSelectAsap(true)}
                className={`${selectAsap ? 'border-blue-500' : 'border-gray-500'} items-center justify-between gap-3 flex-row border  rounded-2xl p-4 mb-6  w-full`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="bg-blue-100 rounded-full p-2">
                    <Ionicons name="time-outline" size={22} color="#2563EB" />
                  </View>
                  <View>
                    <View className="flex-row items-center mb-1">
                      <Text className="font-semibold">ASAP</Text>
                    </View>
                    <Text className="text-gray-500 text-sm">Pickup within 2 hours</Text>
                  </View>
                </View>

                {selectAsap && (
                  <View className="ml-auto items-center justify-center">
                    <AntDesign name="check-circle" size={22} color={Colors.primary} />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectAsap(false);
                  // null date and time when selecting schedule for later
                  setPickupData({
                    ...pickupData,
                    asap: false,
                    date: null,
                    time: null,
                  });
                }}
                className={`${!selectAsap ? 'border-blue-500' : 'border-gray-500'} items-center justify-between gap-3 flex-row border  rounded-2xl p-4 mb-6  w-full`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="bg-blue-100 rounded-full p-2">
                    <Ionicons name="calendar" size={22} color="#2563EB" />
                  </View>
                  <View>
                    <View className="flex-row items-center mb-1">
                      <Text className="font-semibold">Scheduled for Later</Text>
                    </View>
                    <Text className="text-gray-500 text-sm">Choose a specific time</Text>
                  </View>
                </View>

                {!selectAsap && (
                  <View className="ml-auto items-center justify-center">
                    <AntDesign name="check-circle" size={22} color={Colors.primary} />
                  </View>
                )}
              </TouchableOpacity>

              {!selectAsap && (
                <View className="flex-1 flex-row gap-4 items-center justify-center">
                  <View className="flex-1">
                    <Text className="text-black text-lg font-semibold">Date</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPickupData({ ...pickupData, asap: false });
                        openDatePicker();
                      }}
                      className="border rounded-xl p-3 mt-1 border-blue-500 bg-blue-100 flex-row items-center justify-between"
                    >
                      <Text className="text-sm text-black font-semibold">
                        {pickupData.date ? pickupData.date.toLocaleDateString() : 'Select date'}
                      </Text>
                      <Ionicons name="calendar" size={16} color={Colors.primary} className="ml-2" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <Text className="text-black text-lg font-semibold">Time</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setPickupData({ ...pickupData, asap: false });
                        openTimePicker();
                      }}
                      className="border rounded-xl p-3 mt-1 border-blue-500 bg-blue-100 flex-row items-center justify-between"
                    >
                      <Text className="text-sm text-black font-semibold">
                        {pickupData.time
                          ? pickupData.time.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Select time'}
                      </Text>
                      <Ionicons name="time-outline" size={16} color={Colors.primary} className="ml-2" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* step 4 confirmation */}
        {step === 4 && (
          <View className="items-center px-5">
            <View className="bg-green-100 rounded-full p-3 mb-4">
              <Ionicons name="checkmark-circle-outline" size={48} color="green" />
            </View>
            <Text className="font-bold text-[22px] mb-2">Confirm Request</Text>
            <Text className="text-gray-500 text-center mb-6">Review your order details</Text>
            <View className="border border-gray-200 rounded-2xl p-4 w-full ">
              <View className="flex-row items-center justify-between">
                <Text className="font-semibold">Service</Text>
                <Text className="text-gray-500">{dataLoal.service.name}</Text>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="font-semibold">Bags</Text>
                <Text className="text-gray-500">{bags}</Text>
              </View>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="font-semibold">Pickup Time</Text>
                <Text className="text-gray-500">{selectAsap ? 'ASAP' : 'Scheduled for later'}</Text>
              </View>

              <View className="bg-gray-100 rounded h-[1px] mt-3" />
              <View className="flex-row items-center justify-between mt-2">
                <Text className="font-bold text-black text-lg">Total</Text>
                <Text className="text-blue-500 font-semibold text-lg">
                  {'$' + bags * dataLoal.service.pricePerBag}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Footer Buttons */}
        <View className="flex-row mt-6 px-5">
          {step > 0 && (
            <TouchableOpacity
              onPress={() => setStep(prev => (prev - 1) as Step)}
              className="flex-1 border border-blue-500 rounded-xl py-3 mr-3 items-center"
            >
              <Text className="text-[16px] text-blue-500 font-semibold">Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            disabled={isSubmitting}
            onPress={async () => {
              if (step < 4) setStep(prev => (prev + 1) as Step);
              else {
                const selectedPreset = dataLoal.spacialInstructions.find(
                  item => item.id === selectedInstruction,
                );
                const scheduledPickupAt =
                  !selectAsap && pickupData.date && pickupData.time
                    ? new Date(
                        pickupData.date.getFullYear(),
                        pickupData.date.getMonth(),
                        pickupData.date.getDate(),
                        pickupData.time.getHours(),
                        pickupData.time.getMinutes(),
                      ).toISOString()
                    : undefined;

                await onConfirmRequest?.({
                  bags,
                  pickupType: selectAsap ? 'ASAP' : 'SCHEDULED',
                  scheduledPickupAt,
                  specialInstructions: customInstruction.trim() || selectedPreset?.title || undefined,
                });
              }
            }}
            style={{ backgroundColor: Colors.primary }}
            className="flex-1 rounded-xl py-3 items-center"
          >
            <Text className="text-[16px] text-white font-semibold">
              {step === 4 ? (isSubmitting ? 'Confirming...' : 'Confirm') : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}
