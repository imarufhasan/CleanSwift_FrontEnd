import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Linking,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useLocalSearchParams, useRouter } from "expo-router";
import RatingStars from "@/components/home/RatingStars";
import { useGetOrderByIdQuery } from "@/src/services/orderApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";
import SkeletonPlaceholder from "@/components/common/SkeletonPlaceholder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER } from "@/src/services/storage/tokenStorage";

const { width } = Dimensions.get("window");

const serviceLabel: Record<string, string> = {
  WASH_DRY: "Washing & Drying",
  DRY_CLEAN: "Dry Cleaning",
};

const userImage = (image?: string) =>
  image ? { uri: image } : require("@/assets/images/profile.png");

/* ---------------- SKELETON ---------------- */
const OrderDetailsSkeleton = () => {
  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* HEADER */}
      <View
        className="pb-8 rounded-b-[30px]"
        style={{ backgroundColor: Colors.primary }}
      >
        <View className="flex-row items-center px-5 pt-14">
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={40}
              height={40}
              borderRadius={20}
              marginRight={14}
            />
          </SkeletonPlaceholder>

          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={180}
              height={24}
              borderRadius={8}
            />
          </SkeletonPlaceholder>
        </View>
      </View>

      {/* CARD */}
      <View className="px-5 mt-6">
        <View className="bg-white rounded-3xl p-5">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="mb-5">
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  width={100}
                  height={14}
                  borderRadius={6}
                  marginBottom={8}
                />
              </SkeletonPlaceholder>

              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  width={width - 80}
                  height={20}
                  borderRadius={8}
                />
              </SkeletonPlaceholder>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/* ---------------- MAIN ---------------- */

export default function OrderDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [userInfo, setUserInfo] = useState<any>(null);

  const { data, isLoading, isError } = useGetOrderByIdQuery(id ?? "", {
    skip: !id,
  });

  const order = data?.data;
  console.log("order details: ", data);
  

  /* ---------------- GET LOCAL USER ---------------- */

  useEffect(() => {
    const getLocalUser = async () => {
      try {
        const userString = await AsyncStorage.getItem(USER);

        if (userString) {
          const parsedUser = JSON.parse(userString);
          setUserInfo(parsedUser);
        }
      } catch (error) {
        console.log("Local user error:", error);
      }
    };

    getLocalUser();
  }, []);

  /* ---------------- SET TARGET USER ---------------- */

  const targetUser = useMemo(() => {
    if (!order || !userInfo) return null;

    // If logged user is CUSTOMER → show DRIVER
    if (userInfo?.role === "CUSTOMER") {
      return order?.driver;
    }

    // If logged user is DRIVER → show CUSTOMER
    if (userInfo?.role === "DRIVER") {
      return order?.customer;
    }

    return null;
  }, [order, userInfo]);

  if (isLoading) return <OrderDetailsSkeleton />;

  if (!order || isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="document-text-outline" size={70} color="#D1D5DB" />

        <Text className="text-xl font-bold text-gray-700 mt-4">
          Order not found
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-5 px-5 py-3 rounded-2xl"
          style={{ backgroundColor: Colors.primary }}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const total = Number(order.total ?? 0);

  const subTotal = (order.bags ?? 0) * (order.pricePerBag ?? 0);

  const handleCall = async () => {
    try {
      const phone =
        targetUser?.phone || targetUser?.phoneNumber || targetUser?.mobile;

      if (!phone) {
        console.log("Phone number not found");
        return;
      }

      const url = `tel:${phone}`;

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Dialer not supported");
      }
    } catch (error) {
      console.log("Call error:", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F8FAFC]"
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View
        className="pb-10 rounded-b-[32px]"
        style={{ backgroundColor: Colors.primary }}
      >
        <View className="flex-row items-center justify-between px-5 pt-14">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/20 backdrop-blur-md p-3 rounded-full"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-2xl font-bold">Order Details</Text>

          <View className="w-12" />
        </View>
      </View>

      {/* ORDER INFO CARD */}
      <View className="px-5 -mt-8">
        <View
          className="bg-white rounded-3xl p-5"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          {/* Order ID */}
          <View className="mb-5">
            <Text className="text-gray-400 text-sm mb-1">Order ID</Text>

            <Text className="text-xl font-bold text-black">
              #{formatOrderNumber(order._id)}
            </Text>
          </View>

          {/* STATUS */}
          <View className="flex-row items-center justify-between mb-5">
            <View>
              <Text className="text-gray-400 text-sm mb-1">Status</Text>

              <Text
                className="font-semibold capitalize"
                style={{ color: Colors.primary }}
              >
                {order.status?.replaceAll("_", " ")}
              </Text>
            </View>

            <View className="bg-green-100 px-3 py-2 rounded-full">
              <Text className="text-green-700 font-semibold text-xs">
                Active Order
              </Text>
            </View>
          </View>

          {/* SERVICE */}
          <View className="mb-5">
            <Text className="text-gray-400 text-sm mb-1">Service Type</Text>

            <Text className="font-semibold text-black">
              {serviceLabel[order.serviceType] ?? order.serviceType}
            </Text>
          </View>

          {/* ADDRESS */}
          <View className="mb-5">
            <Text className="text-gray-400 text-sm mb-1">Pickup Address</Text>

            <Text className="font-semibold text-black leading-6">
              {order.address || "No address available"}
            </Text>
          </View>

          {/* NOTES */}
          <View className="mb-5">
            <Text className="text-gray-400 text-sm mb-1">
              Special Instructions
            </Text>

            <Text className="font-semibold text-black leading-6">
              {order.specialInstructions || "No special instructions"}
            </Text>
          </View>

          {/* PRICE */}
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500">
                {order.bags} bags × ${order.pricePerBag}
              </Text>

              <Text className="font-semibold">${subTotal.toFixed(2)}</Text>
            </View>

            <View className="h-[1px] bg-gray-200 mb-3" />

            <View className="flex-row justify-between">
              <Text className="font-bold text-lg">Total</Text>

              <Text
                className="font-bold text-xl"
                style={{ color: Colors.primary }}
              >
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* USER CARD */}
      <View className="px-5 mt-6">
        <View
          className="bg-white rounded-3xl p-5"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          {/* HEADER */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-black">
              {userInfo?.role === "CUSTOMER"
                ? "Driver Information"
                : "Customer Information"}
            </Text>

            {userInfo?.role !== "DRIVER" && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(common)/DriverDetails" as any,
                    params: {
                      orderId: order._id,
                      name: targetUser?.name ?? "",
                      image: targetUser?.image ?? "",
                      rating: "4.9",
                      trips: "0",
                    },
                  })
                }
              >
                <Text
                  className="font-semibold"
                  style={{ color: Colors.primary }}
                >
                  View Details
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* USER INFO */}
          <View className="flex-row items-center">
            <Image
              source={userImage(targetUser?.image)}
              className="w-16 h-16 rounded-full"
            />

            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-black">
                {targetUser?.name ?? "No User Found"}
              </Text>

              <Text className="text-gray-500 mt-1">
                {targetUser?.email ?? "No Email"}
              </Text>

              <View className="flex-row items-center mt-2">
                <RatingStars rating={4.9} size={16} />

                <Text className="ml-2 text-sm text-gray-500">
                  {userInfo?.role === "CUSTOMER"
                    ? "Assigned Driver"
                    : "Customer"}
                </Text>
              </View>
            </View>
          </View>

          {/* ACTION BUTTONS */}
          {targetUser?._id && (
            <View className="flex-row justify-between mt-6">
              {/* MESSAGE */}
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-2xl py-4 w-[48%]"
                style={{
                  backgroundColor: "#EEF6FF",
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
                onPress={() => {
                  router.push({
                    pathname: "/(common)/ChatScreen" as any,
                    params: {
                      orderId: order._id,
                      name: targetUser?.name ?? "",
                      avatar: targetUser?.image ?? "",
                    },
                  });
                }}
              >
                <AntDesign name="message" size={18} color={Colors.primary} />

                <Text
                  className="ml-2 font-semibold"
                  style={{ color: Colors.primary }}
                >
                  Message
                </Text>
              </TouchableOpacity>

              {/* CALL */}
              <TouchableOpacity
                className="flex-row items-center justify-center rounded-2xl py-4 w-[48%]"
                style={{
                  backgroundColor: "#EEF6FF",
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
                onPress={handleCall}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={Colors.primary}
                />

                <Text
                  className="ml-2 font-semibold"
                  style={{ color: Colors.primary }}
                >
                  Call
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View className="h-24" />
    </ScrollView>
  );
}
