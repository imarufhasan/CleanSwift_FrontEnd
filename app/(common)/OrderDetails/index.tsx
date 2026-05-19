import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useLocalSearchParams, useRouter } from "expo-router";
import RatingStars from "@/components/home/RatingStars";
import { useGetOrderByIdQuery } from "@/src/services/orderApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";
import SkeletonPlaceholder from "@/components/common/SkeletonPlaceholder";

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
    <View className="flex-1 bg-gray-100">
      {/* HEADER */}
      <View className="pb-6" style={{ backgroundColor: Colors.primary }}>
        <View className="flex-row items-center px-5 pt-12 mb-[40px]">
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={36}
              height={36}
              borderRadius={18}
              marginRight={12}
            />
          </SkeletonPlaceholder>

          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={160}
              height={22}
              borderRadius={6}
            />
          </SkeletonPlaceholder>
        </View>
      </View>

      {/* ORDER CARD */}
      <View className="px-5 -mt-10">
        <View className="bg-white rounded-2xl p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} className="mb-4">
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  width={120}
                  height={14}
                  borderRadius={6}
                  marginBottom={6}
                />
              </SkeletonPlaceholder>

              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  width={width - 80}
                  height={18}
                  borderRadius={6}
                />
              </SkeletonPlaceholder>
            </View>
          ))}
        </View>
      </View>

      {/* DRIVER CARD */}
      <View className="px-5 mt-6">
        <View className="bg-white rounded-2xl p-4">
          <View className="flex-row items-center">
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width={56}
                height={56}
                borderRadius={28}
              />
            </SkeletonPlaceholder>

            <View className="ml-3 flex-1">
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  width={140}
                  height={18}
                  borderRadius={6}
                />
              </SkeletonPlaceholder>

              <View className="mt-2">
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item
                    width={180}
                    height={14}
                    borderRadius={6}
                  />
                </SkeletonPlaceholder>
              </View>
            </View>
          </View>

          {/* BUTTONS */}
          <View className="flex-row justify-between mt-6">
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width="48%"
                height={44}
                borderRadius={12}
              />
            </SkeletonPlaceholder>

            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width="48%"
                height={44}
                borderRadius={12}
              />
            </SkeletonPlaceholder>
          </View>
        </View>
      </View>
    </View>
  );
};

/* ---------------- MAIN ---------------- */

export default function OrderDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { data, isLoading, isError } = useGetOrderByIdQuery(id ?? "", {
    skip: !id,
  });

  const order = data?.data;
  const driver = order?.driver;

  if (isLoading) return <OrderDetailsSkeleton />;

  if (!order || isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 px-6">
        <Text className="text-lg font-semibold text-gray-800">
          Order not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text style={{ color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const total = Number(order.total ?? 0);
  const subTotal = (order.bags ?? 0) * (order.pricePerBag ?? 0);

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* HEADER */}
      <View className="pb-6" style={{ backgroundColor: Colors.primary }}>
        <View className="flex-row items-center px-5 pt-12 mb-[40px]">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white p-2 rounded-full mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>

          <Text className="text-white text-[22px] font-semibold">
            Order Details
          </Text>
        </View>
      </View>

      {/* ORDER CARD */}
      <View className="px-5 -mt-10">
        <View className="bg-white rounded-2xl p-4 shadow">
          <Text className="text-gray-400 text-sm">Order ID</Text>
          <Text className="font-bold text-lg mb-3">
            #{formatOrderNumber(order._id)}
          </Text>

          <Text className="text-gray-400 text-sm">Status</Text>
          <Text className="font-semibold mb-3 text-blue-600">
            {order.status?.replaceAll("_", " ")}
          </Text>

          <Text className="text-gray-400 text-sm">Service</Text>
          <Text className="font-semibold mb-3">
            {serviceLabel[order.serviceType] ?? order.serviceType}
          </Text>

          <Text className="text-gray-400 text-sm">Pickup Address</Text>
          <Text className="font-semibold mb-3">
            {order.address || "No address available"}
          </Text>

          <Text className="text-gray-400 text-sm">Special Instructions</Text>
          <Text className="font-semibold mb-4">
            {order.specialInstructions || "No special instructions"}
          </Text>

          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">
                {order.bags} bags × ${order.pricePerBag}
              </Text>
              <Text className="text-gray-700">${subTotal.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between border-t border-gray-200 pt-3 mt-2">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold" style={{ color: Colors.primary }}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* DRIVER CARD */}
      <View className="px-5 mt-6">
        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Image
                source={userImage(driver?.image)}
                className="w-14 h-14 rounded-full"
              />

              <View className="ml-3 flex-1">
                <Text className="font-bold text-lg" numberOfLines={1}>
                  {driver?.name ?? "Driver not assigned"}
                </Text>

                <View className="flex-row items-center mt-1">
                  <RatingStars rating={driver ? 4.9 : 0} size={16} />
                  <Text className="ml-1 text-sm text-gray-600">
                    {driver ? "Assigned driver" : "Pending assignment"}
                  </Text>
                </View>
              </View>
            </View>

            {driver?._id && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(common)/DriverDetails" as any,
                    params: {
                      orderId: order._id,
                      name: driver.name ?? "Driver",
                      image: driver.image ?? "",
                      rating: "4.9",
                      trips: "0",
                    },
                  })
                }
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: Colors.primary }}
                >
                  View Details
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {driver?._id && (
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                className="flex-row bg-blue-100/80 items-center justify-center border rounded-xl py-3 w-[48%]"
                style={{ borderColor: Colors.primary }}
              >
                <AntDesign name="message" size={18} color={Colors.primary} />
                <Text
                  className="ml-2 font-semibold"
                  style={{ color: Colors.primary }}
                >
                  Message
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row bg-blue-100/80 items-center justify-center border rounded-xl py-3 w-[48%]"
                style={{ borderColor: Colors.primary }}
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
