import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import { liveTrackingData } from "@/data/liveTracking";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LiveTrackingScreen() {
  const router = useRouter();
  const { status, order, driver, orderDetails } = liveTrackingData;

  const total =
    orderDetails.pricing.bags * orderDetails.pricing.bagPrice +
    orderDetails.pricing.tip;

  return (
    <ScrollView className="flex-1">
      <SafeAreaView edges={["bottom"]} className="bg-[#F6F9FF] flex-1">
        {/* Map Placeholder */}
        <View className="h-[300px] bg-blue-100 relative">
          {/* Fake Map Grid Background */}
          <View className="absolute inset-0 opacity-40">
            <View className="flex-1 flex-row flex-wrap">
              {[...Array(100)].map((_, i) => (
                <View
                  key={i}
                  className="w-[10%] h-[10%] border border-blue-200"
                />
              ))}
            </View>
          </View>

          {/* Fake Location Marker */}
          <View className="absolute self-center top-1/2 -mt-10 items-center">
            <View className="w-[100px] h-[100px] p-4 items-center justify-center bg-transparent border-blue-400 border-[1px] rounded-full">
              <Ionicons name="location-sharp" size={30} color="#2563eb" />
              <View className="w-3 h-3 bg-blue-600 rounded-full mt-1" />
            </View>
          </View>

          {/* back icon */}
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            className="absolute top-12 left-4 bg-white p-2 rounded-full shadow"
          >
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          {/* Status Badge */}
          <View className="absolute top-12 self-center bg-white px-4 py-2 rounded-full flex-row items-center shadow">
            <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
            <Text className="font-semibold text-lg">{status.label}</Text>
          </View>

          {/* Zoom buttons */}
          <View className="absolute right-4 top-28">
            <TouchableOpacity className="bg-white w-10 h-10 rounded-lg justify-center items-center mb-2 shadow">
              <Feather name="plus" size={18} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white w-10 h-10 rounded-lg justify-center items-center shadow">
              <Feather name="minus" size={18} />
            </TouchableOpacity>
          </View>

          {/* ETA Bubble */}
          <View className="absolute left-4 bottom-4 bg-white px-4 py-2 rounded-xl shadow">
            <Text className="text-sm text-gray-500">Estimated Ready Time</Text>
            <Text className="font-bold text-[22px]">6:30 PM</Text>
          </View>
        </View>

        {/* Order Progress */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center mb-3 justify-between">
            <Text className="font-bold text-[22px]">Order Progress</Text>
            <Text className="text-sm bg-red-100 rounded-full px-3 py-2 font-bold text-red-500 ml-2">
              In Progress
            </Text>
          </View>
          <View className="bg-white rounded-2xl p-4 shadow">
            {liveTrackingData.progressSteps.map((step, index) => {
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
                        <Text className="text-xs text-gray-500">
                          {step.time}
                        </Text>
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
                  <View key={step.key} className="flex-row mb-6">
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
                );
              }

              return (
                <View key={step.key} className="flex-row mb-5 opacity-40">
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
              );
            })}
          </View>
        </View>

        {/* Driver Card */}
        <View className="bg-white rounded-2xl p-4 shadow mx-5 mb-5 mt-4">
          <View className="flex-row items-center mb-3">
            <Image
              source={{ uri: driver.avatar }}
              style={{ width: 40, height: 40, borderRadius: 25 }}
              resizeMode="cover"
            />
            <View className="flex-1 ml-2">
              <Text className="font-semibold text-base">{driver.name}</Text>
              <View className="flex-row items-center mt-1">
                <RatingStars rating={driver.rating} />
                <Text className="text-sm ml-1 text-gray-600">
                  {driver.rating} ({driver.trips} trips)
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push("/DriverDetails")}>
              <Text
                style={{ color: Colors.primary }}
                className="text-sm font-semibold  text-right"
              >
                View Details
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/ChatScreen")}
              className="flex-1 border bg-blue-100 border-blue-400 rounded-xl py-3 flex-row justify-center items-center mr-2"
            >
              <AntDesign name="message" size={18} color={Colors.primary} />
              <Text
                style={{ color: Colors.primary }}
                className="ml-2  font-semibold"
              >
                Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/CallScreen")}
              className="flex-1 border bg-blue-100 border-blue-400 rounded-xl py-3 flex-row justify-center items-center ml-2"
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <Text
                style={{ color: Colors.primary }}
                className="ml-2  font-semibold"
              >
                Call Driver
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Details */}
        <View className="mx-5 mb-5">
          <Text className="font-bold text-[20px] mb-3">Order Details</Text>

          <View className="bg-white rounded-2xl p-4 shadow mb-8">
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
              <Text className="text-gray-500 text-xs">
                Special Instructions
              </Text>
              <Text className="font-medium">{orderDetails.instructions}</Text>
            </View>

            <View className="pt-3">
              <View className="border-t border-b border-gray-200 py-3 flex-row justify-between mb-2">
                <Text className="text-gray-600">
                  {orderDetails.pricing.bags} bags × $
                  {orderDetails.pricing.bagPrice}
                </Text>

                <Text>
                  ${orderDetails.pricing.bags * orderDetails.pricing.bagPrice}
                </Text>
              </View>

              <View className="flex-row justify-between mt-2">
                <Text className="font-bold">Total</Text>
                <Text className="font-bold text-blue-600">${total}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mark as Delivered Button */}
        <View className="px-5 mb-5">
          <TouchableOpacity
            onPress={() => router.push("/DeliveredSuccessScreen")}
            className="bg-green-600 gap-2 rounded-xl py-3 flex-row justify-center items-center"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text className="text-white text-lg font-semibold">
              Mark as Delivered
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
