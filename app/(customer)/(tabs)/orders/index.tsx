import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { useRouter } from "expo-router";
import RatingStars from "@/components/home/RatingStars";
import { orderTrackingData } from "@/data/ordering";

export default function Orders() {
  const router = useRouter();

  const { activeOrder, driver, orderDetails, pastOrders } = orderTrackingData;

  const totalAmount =
    activeOrder.quantity * activeOrder.bagPrice + activeOrder.tip;

  return (
    <ScrollView className="flex-1 bg-[#F6F9FF]">
      {/* Header */}
      <View
        style={{ backgroundColor: Colors.primary }}
        className="pt-14 pb-16 px-5 rounded-b-[32px]"
      >
        <Text className="text-white text-[26px] font-bold">Order Tracking</Text>
        <Text className="text-white/80 mt-1">
          Track your laundry in real-time
        </Text>
      </View>

      {/* Active Order Card */}
      <View className="px-5 -mt-10">
        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="font-semibold">Order #{activeOrder.id}</Text>
              <Text className="text-gray-500 text-sm">
                {activeOrder.quantity} bags • $
                {activeOrder.quantity * activeOrder.bagPrice}
              </Text>
            </View>

            <View className="bg-orange-100 px-3 py-1 rounded-full">
              <Text className="text-orange-500 text-xs font-semibold">
                {activeOrder.status}
              </Text>
            </View>
          </View>

          <View className="bg-blue-50 rounded-xl p-3 mt-3">
            <Text className="text-xs text-gray-500">Estimated Delivery</Text>
            <Text className="font-semibold mt-1">
              {activeOrder.estimatedDelivery}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Progress */}
      <View className="px-5 mt-6">
        <Text className="font-bold text-lg mb-4">Order Progress</Text>

        <View className="bg-white rounded-2xl p-4 shadow">
          {activeOrder.progressSteps.map((step, index) => {
            if (step.status === "done") {
              return (
                <View key={step.key}>
                  <View className="flex-row">
                    <View className="items-center mr-3">
                      <View className="w-9 h-9 rounded-full bg-green-200 justify-center items-center">
                        {step.title === "Delivered" ? (
                          <Ionicons
                            name="home-outline"
                            size={22}
                            color={"green"}
                          />
                        ) : (
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={22}
                            color={"green"}
                          />
                        )}
                      </View>
                      <View className="w-[2px] flex-1 bg-green-500 mt-1" />
                    </View>

                    <View>
                      <Text className="font-medium">{step.title}</Text>
                      <Text className="text-xs text-gray-500">{step.time}</Text>
                    </View>
                  </View>
                  {step.title !== "Delivered" ? (
                    <View className="bg-green-200 h-[30px] w-[1px] ml-4 my-2 rounded-full" />
                  ) : null}
                </View>
              );
            }

            if (step.status === "active") {
              return (
                <View key={step.key}>
                  <View className="flex-row">
                    <View className="items-center mr-3">
                      {/* loader icon */}
                      <View className="w-9 h-9 rounded-full bg-blue-100 justify-center items-center">
                        <Ionicons
                          name="refresh-outline"
                          size={22}
                          color="#3B82F6"
                        />
                      </View>
                    </View>

                    <View>
                      <Text className="font-medium text-black">
                        {step.title}
                      </Text>
                      <Text className="text-xs text-black">In Progress</Text>
                      <Text className="text-xs text-blue-500 font-semibold">
                        {step.subtitle}
                      </Text>
                    </View>
                  </View>
                  {step.title !== "Delivered" ? (
                    <View className="bg-blue-300 h-[30px] w-[1px] ml-4 my-2 rounded-full" />
                  ) : null}
                </View>
              );
            }

            return (
              <View key={step.key}>
                <View className="flex-row">
                  <View className="flex-row opacity-40">
                    <View className="items-center mr-3">
                      <View className="w-9 h-9 rounded-full bg-gray-300 justify-center items-center">
                        <AntDesign
                          name={step.icon as any}
                          size={16}
                          color="#000"
                        />
                      </View>
                    </View>
                    <Text className="font-medium">{step.title}</Text>
                  </View>
                </View>
                {step.title !== "Delivered" ? (
                  <View className="bg-gray-300 h-[30px] w-[1px] ml-4 my-2 rounded-full" />
                ) : null}
              </View>
            );
          })}
        </View>
      </View>

      {/* Driver Card */}
      <View className="px-5 mt-6 mb-6">
        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: driver.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="font-semibold">{driver.name}</Text>
              <View className="flex-row items-center mt-1">
                <RatingStars rating={driver.rating} size={14} />
                <Text className="text-sm ml-1 text-gray-600">
                  {driver.rating} ({driver.trips} trips)
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/ChatScreen")}
              className="flex-1 border bg-blue-100 border-blue-500 rounded-xl py-3 flex-row justify-center items-center mr-2"
            >
              <Ionicons
                name="chatbubble-outline"
                size={18}
                color={Colors.primary}
              />
              <Text className="ml-2 text-lg text-blue-500 font-semibold">Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/CallScreen")}
              className="flex-1 border bg-blue-100 border-blue-500 rounded-xl py-3 flex-row justify-center items-center ml-2"
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <Text className="ml-2 text-lg text-blue-500 font-semibold">
                Call Driver
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Order Details */}
      <View className="px-5 mb-6">
        <Text className="font-bold text-[20px] mb-3">Order Details</Text>

        <View className="bg-white rounded-2xl p-4 shadow">
          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Service</Text>
            <Text className="font-medium">{orderDetails.service}</Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Pickup Address</Text>
            <Text className="font-medium">{orderDetails.address.street}</Text>
            <Text className="text-gray-500 text-sm">
              {orderDetails.address.city}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-500 text-xs">Special Instructions</Text>
            <Text className="font-medium">{orderDetails.instructions}</Text>
          </View>

          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">
                {activeOrder.quantity} bags × ${activeOrder.bagPrice}
              </Text>
              <Text>${activeOrder.quantity * activeOrder.bagPrice}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Tip</Text>
              <Text>${activeOrder.tip}</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="font-bold">Total</Text>
              <Text className="font-bold text-blue-600">${totalAmount}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Past Orders */}
      <View className="px-5 mb-6">
        <Text className="text-lg font-bold mb-3">Past Orders</Text>

        {pastOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="bg-white rounded-2xl p-4 mb-2 border border-gray-100 flex-row"
            onPress={() => router.push("/(common)/OrderDetails")}
          >
            <View className="w-9 h-9 rounded-full bg-gray-200 justify-center items-center">
              <Ionicons name="cube-outline" size={20} />
            </View>

            <View className="flex-1 ml-3">
              <Text className="font-semibold">Order #{order.id}</Text>
              <Text className="text-sm text-gray-500">
                {order.quantity} bag • Estimate cost ${order.price}
              </Text>

              <View className="flex-row items-center mt-1">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={14}
                  color="green"
                />
                <Text className="ml-1 text-green-600 text-sm">
                  {order.status}
                </Text>
              </View>
            </View>

            <View className="items-end justify-between">
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FACC15" />
                <Text className="ml-1 text-sm">{order.rating.toFixed(1)}</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  console.log("recet_item: ", order);
                  router.push("/(common)/OrderDetails");
                }}
                className="my-2"
              >
                <Text
                  style={{ color: Colors.primary }}
                  className="font-semibold"
                >
                  View Details
                </Text>
              </TouchableOpacity>

              <Text className="text-xs text-gray-400">{order.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
