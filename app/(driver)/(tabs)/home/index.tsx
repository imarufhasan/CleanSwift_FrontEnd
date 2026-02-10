import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Animated,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import Toast from "@/constants/toast";
import { useRouter } from "expo-router";
import RequestPickupModal from "@/components/home/RequestPickupModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import ShowMessage from "@/constants/toast";
import TodayStats from "@/components/driver/home/TodayStats";

export default function HomeScreen() {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [pickupData, setPickupData] = useState({
    asap: true,
    date: null as Date | null,
    time: null as Date | null,
    bags: 1,
  });

  const [data, setData] = useState({
    user: {
      name: "Ali Amin",
    },

    location: {
      title: "Current Location",
      street: "123 Main Street, Apt 4B",
      city: "San Francisco",
      state: "CA 94102",
    },

    activeOrder: {
      id: 1248,
      status: "Washing",
      quantity: 2,
      price: 90,
      progress: 50,
      estimatedDelivery: "Today, 6:00 PM",
      steps: ["Picked Up", "Washing", "Delivery"],
      currentStep: 1,
    },

    recentOrders: [
      {
        id: 1247,
        quantity: 1,
        price: 45,
        rating: 5.0,
        status: "Delivered",
        date: "Jan 24, 2026",
      },
      {
        id: 1246,
        quantity: 2,
        price: 80,
        rating: 4.8,
        status: "Delivered",
        date: "Jan 18, 2026",
      },
      {
        id: 1248,
        quantity: 2,
        price: 90,
        rating: 5.0,
        status: "Delivered",
        date: "Today",
      },
    ],
  });

  useEffect(() => {
    if (!pickupData.asap && !pickupData.date) {
      setShowDatePicker(true);
    }
  }, [pickupData.asap]);

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Washing":
        return "bg-orange-100 text-orange-500";
      case "Delivered":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      // setData((prev) => ({
      //   ...prev,
      //   activeOrder: {
      //     ...prev.activeOrder,
      //     progress: 75,
      //     currentStep: 2,
      //     status: "Delivery",
      //     estimatedDelivery: "Today, 7:00 PM",
      //   },
      //   recentOrders: [
      // {
      //   id: 1248,
      //   quantity: 2,
      //   price: 90,
      //   rating: 5.0,
      //   status: "Delivered",
      //   date: "Today",
      // },
      //     ...prev.recentOrders,
      //   ],
      // }));

      setRefreshing(false);
      ShowMessage.show("updated");
    }, 1500);
  }, []);

  const onDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setPickupData((prev) => ({
        ...prev,
        date,
        asap: false,
      }));
    }
  };

  const onTimeChange = (_: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setPickupData((prev) => ({
        ...prev,
        time,
        asap: false,
      }));
    }
  };

  const translateX = useRef(new Animated.Value(selected ? 40 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: selected ? 40 : 3,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  return (
    <View className="flex-1 bg-blue-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1 bg-blue-50"
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: Colors.primary,
          }}
          className=" rounded-b-[40px] pb-[60px]"
        >
          <View className="flex-row px-5 pt-12 justify-between items-center">
            <View className="flex-1">
              <Text className="text-[16px] text-white/80">Welcome back,</Text>
              <Text className="text-[22px] font-bold text-white">
                {data.user.name}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <View className="bg-green-400 w-4 h-4 rounded-full" />
              <Text className="text-white text-base">Online</Text>
            </View>
          </View>

          {/* Availability Status */}
          <View className="px-5 mt-8">
            <View
              style={{
                backgroundColor: Colors.primary,
              }}
              className="border border-white/40 rounded-2xl p-4"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-row items-start">
                  <View className="ml-3">
                    <Text className="text-white font-semibold">
                      Availability Status
                    </Text>
                    <Text className="text-white text-sm">
                      Accepting new jobs
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelected((prev) => !prev)}
                  activeOpacity={0.8}
                  className={`w-[70px] h-[36px] rounded-full justify-center ${
                    selected ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  <Animated.View
                    style={{ transform: [{ translateX }] }}
                    className="w-[26px] h-[26px] rounded-full bg-white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Earnings */}
        <View className="px-5 -mt-12 z-10">
          <View
            style={{
              backgroundColor: Colors.primary,
            }}
            className="border border-white/40 shadow-xl rounded-2xl p-5 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-white text-base">Today's Earnings</Text>
              <Text className="text-white/90 text-2xl font-bold mt-1">
                $156
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setBottomModal(true)}
              className="bg-white w-12 h-12 rounded-full justify-center items-center shadow"
            >
              <Feather name="dollar-sign" size={26} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-5 mt-6 ">
          {/* Today's Status */}
          <>
            <TodayStats />
          </>

          {/* Active Route */}
          <>
            <Text className="text-lg font-bold mb-3">Active Route</Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-safe">
                  <View
                    className="w-9 h-9 rounded-full justify-center items-center"
                    style={{ backgroundColor: "rgba(37, 99, 235, 0.2)" }}
                  >
                    <Ionicons
                      name="cube-outline"
                      size={20}
                      color={Colors.primary}
                    />
                  </View>

                  <View className="ml-2">
                    <Text className="font-semibold">
                      Order #{data.activeOrder.id}
                    </Text>
                    <Text className="text-sm text-gray-500 mb-3">
                      {data.activeOrder.quantity} bags • $
                      {data.activeOrder.price}
                      .00
                    </Text>
                  </View>
                </View>

                <Text
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    data.activeOrder.status,
                  )}`}
                >
                  In Progress
                </Text>
              </View>

              {/* Steps */}
              <View className="flex-row justify-between mb-2">
                {data.activeOrder.steps.map((step, index) => (
                  <Text
                    key={step}
                    className={`text-xs ${
                      index <= data.activeOrder.currentStep
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </Text>
                ))}
              </View>

              {/* Progress Bar */}
              <View className="h-2 bg-gray-200 rounded-full mb-3">
                <View
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${data.activeOrder.progress}%` }}
                />
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-xs text-gray-500">
                  Estimated delivery: {data.activeOrder.estimatedDelivery}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/LiveTrackScreenDriver")}
                  className="flex-row gap-3 items-center"
                >
                  <Text
                    style={{ color: Colors.primary }}
                    className="text-[14px] font-bold"
                  >
                    Track Live
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>

          {/* Available Jobs */}
          <>
            <Text className="text-lg font-bold mb-3">Available Jobs</Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-safe">
                  <View className="ml-2">
                    <Text className="font-semibold mb-1">Order #1251</Text>
                    <View className="flex-row">
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color={"gray"}
                      />
                      <Text className="text-sm text-gray-500 mb-1">
                        123 Elm St
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Ionicons name="time-outline" size={14} color={"gray"} />
                      <Text className="text-sm text-gray-500 mb-1">
                        Posted 2 mins ago
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="items-end justify-center">
                  <Text className="font-bold text-green-500 text-[24px]">
                    $45
                  </Text>
                  <Text className="font-sm text-gray-500">You earn 70%</Text>
                </View>
              </View>

              <View className="flex-row justify-between bg-blue-50 rounded-[10px] py-4 px-6">
                <View className="flex-1 items-start justify-center">
                  <Text className="text-base text-gray-500">Begs</Text>
                  <Text className="text-lg font-bold text-black">2 Begs</Text>
                </View>
                <View className="flex-1 items-start justify-center ml-[20px]">
                  <Text className="text-base text-gray-500">Distance</Text>
                  <Text className="text-lg font-bold text-black">1.2 mi</Text>
                </View>
              </View>

              <View className=" mt-3 flex-row items-center justify-center gap-4">
                <View className="flex-1 bg-white border-[1px] border-blue-500 rounded-[10px] px-4 py-3 items-center justify-center">
                  <Text className="text-blue-500 text-[18px]">
                    Decline
                  </Text>
                </View>

                <View className="flex-1  bg-blue-500 rounded-[10px] px-4 py-3 items-center justify-center">
                  <Text className="text-white text-[18px]">
                    Accept
                  </Text>
                </View>
              </View>
            </View>
          </>
        </View>
      </ScrollView>

      <RequestPickupModal
        visible={bottomModal}
        onClose={() => setBottomModal(false)}
        confirmed={confirmed}
        setConfirmed={setConfirmed}
        pickupData={pickupData}
        setPickupData={setPickupData}
        openDatePicker={() => setShowDatePicker(true)}
        openTimePicker={() => setShowTimePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={pickupData.date || new Date()}
          mode="date"
          minimumDate={new Date()}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={pickupData.time || new Date()}
          mode="time"
          onChange={onTimeChange}
        />
      )}

      {/* Call Modal */}
      {confirmed && (
        <Modal
          transparent
          visible={confirmed}
          animationType="fade"
          onRequestClose={() => setConfirmed(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-6 w-[90%]">
              <Text className="text-black text-[20px] font-bold text-center">
                Are you sure you want to confirm this request?
              </Text>

              <View className="flex-row items-center mt-6 gap-4">
                <TouchableOpacity
                  onPress={() => setConfirmed(false)}
                  className="flex-1 border border-red-500 rounded-2xl py-3"
                >
                  <Text className="text-red-500 text-[20px] text-center font-semibold">
                    No
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setConfirmed(false);
                    setBottomModal(false);
                    ShowMessage.show("Pickup request confirmed");
                  }}
                  className="flex-1 bg-green-500 rounded-2xl py-3"
                >
                  <Text className="text-white text-[20px] text-center font-semibold">
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
