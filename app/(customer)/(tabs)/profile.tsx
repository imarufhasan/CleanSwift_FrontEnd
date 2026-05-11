import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useFocusEffect, useRouter } from "expo-router";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import AppLoader from "@/components/shared/AppLoader";
import {
  useProfileInfoQuery,
  useUpdateProfilePhotoMutation,
} from "@/src/services/userApi";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const router = useRouter();
  const {
    data: profileInfo,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useProfileInfoQuery();

  const userRole = profileInfo?.data?.role || "";
  console.log("profileInfo role: ", profileInfo?.data?.role);
  const [updateProfilePhoto, { isLoading: photoLoading }] =
    useUpdateProfilePhotoMutation();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const role = useUserInfo((state) => state.role);
  const setRole = useUserInfo((state) => state.setRole);
  const clearUser = useUserInfo((state) => state.clearAuth);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageVersion, setImageVersion] = useState(Date.now());
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setImageVersion(Date.now());
      await refetch();
      ShowMessage.show("Profile updated");
    } catch (error) {
      ShowMessage.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const menuItems = [
    { label: "Profile Setting", icon: "person-outline" },
    { label: "Payment Methods", icon: "card-outline" },
    ...(userRole === "CUSTOMER"
      ? [
          {
            label: "Be a Driver",
            icon: "car-outline",
          },
        ]
      : []),
    { label: "Change password", icon: "lock-closed-outline" },
    { label: "Support", icon: "help-circle-outline" },
    { label: "About Us", icon: "information-circle-outline" },
    { label: "Privacy Policy", icon: "shield-checkmark-outline" },
    { label: "Terms and Conditions", icon: "document-text-outline" },
  ];

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

  const handleUpdatePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        ShowMessage.error("Gallery permission required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled) return;

      const image = result.assets[0];

      const formData = new FormData();

      formData.append("user", {
        uri: image.uri,
        name: image.fileName || "profile.jpg",
        type: image.mimeType || "image/jpeg",
      } as any);

      const res = await updateProfilePhoto(formData).unwrap();

      console.log("upload response:", res);
      setImageVersion(Date.now());
      await refetch();
      ShowMessage.show("Profile photo updated");
    } catch (error) {
      console.log("PHOTO UPDATE ERROR:", error);
      ShowMessage.error("Failed to update photo");
    }
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
            <TouchableOpacity
              activeOpacity={0.8}
              //onPress={handleUpdatePhoto}
              className="relative"
              disabled={photoLoading}
            >
              <View className="relative">
                <Image
                  source={
                    profileInfo?.data?.image
                      ? {
                          uri: `${profileInfo?.data?.image}?t=${imageVersion}`,
                        }
                      : require("../../../assets/images/profile.png")
                  }
                  className="w-[70px] h-[70px] rounded-full border-2 border-white"
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                />

                {/* Small Loader */}
                {imageLoading && (
                  <View className="absolute inset-0 items-center justify-center bg-transparent rounded-full">
                    <ActivityIndicator size="small" color="#fff" />
                  </View>
                )}

                {/* Camera Icon */}
                {/* <View className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                  <Ionicons name="camera" size={16} color={Colors.primary} />
                </View> */}
              </View>
            </TouchableOpacity>

            <View className="ml-3 flex-1">
              <Text className="text-white text-[20px] font-bold">
                {profileInfo?.data?.name || "User"}
              </Text>

              <Text className="text-white/80 text-sm">
                {profileInfo?.data?.email || ""}
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
                } else if (item.label === "Be a Driver") {
                  router.push("/driverRegistration2");
                  console.log("make driver");
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

        <AppLoader visible={photoLoading} />
      </ScrollView>

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
    </View>
  );
}
