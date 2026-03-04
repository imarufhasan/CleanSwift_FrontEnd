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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import Toast from "@/constants/toast";
import ShowMessage from "@/constants/toast";
import { useUserInfo } from "@/src/core/store/userInfo";
import { useProfileInfoQuery } from "@/src/services/authApi";
import { clearTokens } from "@/src/services/storage/tokenStorage";
import { api } from "@/src/services/api";
import * as SecureStore from "expo-secure-store";

const menuItems = [
  { label: "Profile Setting", icon: "person-outline" },
  { label: "Payment Methods", icon: "card-outline" },
  { label: "Change password", icon: "lock-closed-outline" },
  { label: "Support", icon: "help-circle-outline" },
  { label: "About Us", icon: "information-circle-outline" },
  { label: "Privacy Policy", icon: "shield-checkmark-outline" },
  { label: "Terms and Conditions", icon: "document-text-outline" },
];

export default function Profile() {
  const router = useRouter();
  const { data: profileInfo, error, isLoading } = useProfileInfoQuery();

  const [refreshing, setRefreshing] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const role = useUserInfo((state) => state.role);
  const setRole = useUserInfo((state) => state.setRole);
  const clearUser = useUserInfo((state) => state.clearAuth);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      ShowMessage.show("updated");
    }, 1500);
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    setLogoutModal(false);
    router.replace("/(auth)/login");
    clearUser();
    ShowMessage.show("Logged out successfully");
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
          className="pt-14 pb-20 px-5 rounded-b-[32px]"
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: profileInfo?.data?.image }}
              className="w-[70px] h-[70px] rounded-full border-2 border-white"
            />
            <View className="ml-3 flex-1">
              <Text className="text-white text-[20px] font-bold">
                {profileInfo?.data?.name}
              </Text>
              <Text className="text-white/80 text-sm">
                {profileInfo?.data?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="px-5 -mt-12">
          <View className="bg-white rounded-2xl flex-row py-4 shadow-sm">
            <View className="flex-1 items-center border-r border-gray-200">
              <Text className="text-[28px] font-bold">28</Text>
              <Text className="text-gray-500 text-sm">Total Orders</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="font-bold text-[28px]">$560</Text>
              <Text className="text-gray-500 text-sm">Total Spent</Text>
            </View>
          </View>
        </View>

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
              <Ionicons
                name={item.icon as any}
                size={20}
                color={Colors.primary}
              />
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
