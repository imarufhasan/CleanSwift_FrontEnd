import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
} from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import Toast from "@/constants/toast";
import ShowMessage from "@/constants/toast";
import { useUserInfo } from "@/src/core/store/userInfo";
import {
  ACCESS_KEY,
  clearTokens,
  REFRESH_KEY,
  USER,
} from "@/src/services/storage/tokenStorage";
import { api } from "@/src/services/api";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfileInfoQuery } from "@/src/services/userApi";
const menuItems = [
  { label: "Profile Setting", icon: "person-outline" },
  { label: "Connect Stripe", icon: "card-outline" },
  { label: "Earnings History", icon: "briefcase" },
  { label: "Change password", icon: "lock-closed-outline" },
  { label: "Support", icon: "help-circle-outline" },
  { label: "About Us", icon: "information-circle-outline" },
  { label: "Privacy Policy", icon: "shield-checkmark-outline" },
  { label: "Terms and Conditions", icon: "document-text-outline" },
];

export default function Profile() {
  const router = useRouter();
  const { data: profileInfo, error, isLoading } = useProfileInfoQuery();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const clearUser = useUserInfo((state) => state.clearAuth);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      ShowMessage.show("updated");
    }, 1500);
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, USER]);

      // clear RTK Query cache (VERY IMPORTANT)
      dispatch(api.util.resetApiState());

      // clear Zustand / local store
      clearUser();

      setLogoutModal(false);

      ShowMessage.show("Logged out successfully");
      checkStorage();

      router.replace("/(auth)/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const checkStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    console.log("Keys:", keys);

    const data = await AsyncStorage.multiGet(keys);
    console.log("Data:", data);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        className="flex-1 bg-[#F6F9FF]"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View
          style={{ backgroundColor: Colors.primary }}
          className="pt-14 pb-20 px-5"
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.push("/profileSettings")}
              className="w-[70px] h-[70px]"
            >
              <Image
                source={{ uri: profileInfo?.data?.image }}
                className="w-[70px] h-[70px] rounded-full border-2 border-white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profileSettings")}
              className="ml-3 flex-1"
            >
              <Text className="text-white text-2xl font-bold">
                {profileInfo?.data?.name}
              </Text>
              <Text className="text-white/80 text-sm">
                {profileInfo?.data?.email}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View className="px-5 -mt-12">
          <View className="bg-white rounded-2xl  py-4 shadow-sm">
            <View className="flex-row">
              <View className="flex-1 items-center">
                <Text className="text-gray-500 text-sm">Driver Tier</Text>
                <Text className="text-[20px] font-bold">Gold</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-gray-500 text-sm">Performance</Text>
                <Text className="font-bold text-blue-500 text-[20px]">
                  Top 10%
                </Text>
              </View>
            </View>

            <View className="bg-gray-100 h-[1px] w-full my-4" />

            <View className="flex-row">
              <View className="flex-1 items-center border-r border-gray-200">
                <Text className="text-[28px] font-bold">4.9</Text>
                <Text className="text-gray-500 text-sm">Rating</Text>
              </View>

              <View className="flex-1 items-center border-r border-gray-200">
                <Text className="text-[28px] font-bold">234</Text>
                <Text className="text-gray-500 text-sm">Deliveries</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="font-bold text-[28px]">98%</Text>
                <Text className="text-gray-500 text-sm">Success</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("/DriverVerification");
          }}
          className="px-5 mt-6"
        >
          <View className="bg-blue-50 items-center gap-6 p-4 flex-row border-[1px] border-[#01A1FF] rounded-2xl">
            <View className="bg-white rounded-full p-3">
              <Ionicons name="time-outline" size={22} color={"#01A1FF"} />
            </View>

            <View className="justify-between flex-1">
              <Text className="font-semibold text-black text-lg">
                Verified Driver
              </Text>
              <Text className="text-gray-500 text-sm">
                All documents approved
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/DriverVerification");
              }}
            >
              <Ionicons
                name="chevron-forward-sharp"
                size={18}
                color={"#01A1FF"}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Menu */}
        <View className="px-5 mt-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white flex-row items-center p-4 rounded-xl mb-3 border border-blue-200"
              onPress={() => {
                if (item.label === "Profile Setting") {
                  router.push("/profileSettings");
                } else if (item.label === "Payment Methods") {
                  ShowMessage.show("Payment Methods is coming soon!");
                } else if (item.label === "Change password") {
                  router.push("/changePassword");
                } else if (item.label === "Support") {
                  router.push("/supportScreen");
                } else if (item.label === "Earnings History") {
                  router.push("/DriverEarningHistory");
                } else if (item.label === "About Us") {
                  router.push({
                    pathname: "/PrivacyPolicyScreen",
                    params: {
                      title: "About Us",
                      data: "about",
                    },
                  });
                } else if (item.label === "Privacy Policy") {
                  router.push({
                    pathname: "/PrivacyPolicyScreen",
                    params: {
                      title: "Privacy Policy",
                      data: "privacy",
                    },
                  });
                } else if (item.label === "Terms and Conditions") {
                  router.push({
                    pathname: "/PrivacyPolicyScreen",
                    params: {
                      title: "Terms & Conditions",
                      data: "terms",
                    },
                  });
                }
              }}
            >
              <Ionicons name={item.icon as any} size={20} color={"black"} />
              <Text className="ml-3 flex-1 font-medium">{item.label}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View className="px-5 mt-4 mb-10">
          <TouchableOpacity
            onPress={() => setLogoutModal(true)}
            className="border border-red-400 rounded-xl py-4 flex-row justify-center items-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-500 font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {logoutModal && (
        <Modal
          transparent
          visible={logoutModal}
          animationType="fade"
          onRequestClose={() => setLogoutModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-8 w-[90%]">
              <Text className="text-black text-[18px] font-bold text-center">
                Are you sure Logout your Profile?
              </Text>

              <View className="flex-row items-center mt-6 gap-4">
                <TouchableOpacity
                  onPress={() => setLogoutModal(false)}
                  className="flex-1 border border-red-500 rounded-2xl py-3"
                >
                  <Text className="text-red-500 text-[20px] text-center font-semibold">
                    No
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => logout()}
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
