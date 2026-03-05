import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import Toast from "@/constants/toast";
import { useRouter } from "expo-router";
import RequestPickupModal from "@/components/home/RequestPickupModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import ShowMessage from "@/constants/toast";
import { useProfileInfoQuery } from "@/src/services/authApi";
import RequestPickupCard from "@/components/home/components/RequestPickupCard";
import HeaderSection from "@/components/home/components/HeaderSection";
import ActiveOrderCard from "@/components/home/components/ActiveOrderCard";
import RecentOrdersList from "@/components/home/components/RecentOrdersList";
import { getAccessToken } from "@/src/services/storage/tokenStorage";

export default function HomeScreen() {
  const router = useRouter();
  const { data: profileInfo, error, isLoading } = useProfileInfoQuery();
  const userInfo = getAccessToken();
  const [refreshing, setRefreshing] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
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
    notificationCount: 100,
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

  // Refresh logic
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
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

  const handleOrderPress = (order: any) => {
    console.log("Clicked order: ", order);
    router.push("/(common)/OrderDetails");
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1 bg-white"
      >
        {/* Header Section */}
        <HeaderSection
          userName={data?.user?.name}
          notificationCount={data.notificationCount}
          location={data.location}
          profileInfo={profileInfo}
        />

        {/* Request Pickup Card */}
        <RequestPickupCard onPressAdd={() => setBottomModal(true)} />

        {/* Active & Recent Orders */}
        <View className="px-5 mt-6">
          <ActiveOrderCard data={data.activeOrder} />

          <RecentOrdersList
            orders={data.recentOrders}
            onOrderPress={handleOrderPress}
          />
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
