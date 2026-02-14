import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/constants/color";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function index() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View
        style={{ backgroundColor: Colors.primary }}
        className=" px-5 pt-14 pb-[40px] rounded-b-[32px]"
      >
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white w-[45px] h-[45px] rounded-full p-2 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color={"black"} />
          </TouchableOpacity>

          <View>
            <Text className="text-white text-2xl font-bold">
              Driver Verification
            </Text>

            <Text className="text-blue-100 text-sm mt-1">
              Complete your verification to start earning
            </Text>
          </View>
        </View>
      </View>

      <View className="px-5 mt-6">
        <View className="bg-blue-50 items-center gap-6 p-4 flex-row border-[1px] border-[#01A1FF] rounded-2xl">
          <View className="bg-white rounded-full p-3">
            <Ionicons name="time-outline" size={22} color={"#01A1FF"} />
          </View>

          <View className="justify-between flex-1">
            <Text className="font-semibold text-black text-lg">
              Verification Complete
            </Text>
            <Text className="text-gray-500 text-sm">
              You're all set to accept jobs
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4 mt-4">
        <Text className="text-black text-2xl mb-4 font-bold">
          Required Documents
        </Text>

        <View className="mb-4">
          <View className="bg-blue-50 items-center gap-6 p-4 flex-row border-[1px] border-[#01A1FF] rounded-2xl">
            <View className="bg-white rounded-full p-3">
              <FontAwesome5 name="car-side" size={18} color={"#01A1FF"} />
            </View>

            <View className="justify-between flex-1">
              <Text className="font-semibold text-black text-lg">
                Driver's License
              </Text>
              <Text className="text-gray-500 text-sm">Approved</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/DriverVerification");
              }}
            >
              <Ionicons name="time-outline" size={22} color={"#01A1FF"} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <View className="bg-blue-50 items-center gap-6 p-4 flex-row border-[1px] border-[#01A1FF] rounded-2xl">
            <View className="bg-white rounded-full p-3">
              <Ionicons
                name="document-text-outline"
                size={20}
                color={"#01A1FF"}
              />
            </View>

            <View className="justify-between flex-1">
              <Text className="font-semibold text-black text-lg">
                Vehicle Registration
              </Text>
              <Text className="text-gray-500 text-sm">Approved</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/DriverVerification");
              }}
            >
              <Ionicons name="time-outline" size={22} color={"#01A1FF"} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <View className="bg-blue-50 items-center gap-6 p-4 flex-row border-[1px] border-[#01A1FF] rounded-2xl">
            <View className="bg-white rounded-full p-3">
              <AntDesign
                name="safety-certificate"
                size={20}
                color={"#01A1FF"}
              />
            </View>

            <View className="justify-between flex-1">
              <Text className="font-semibold text-black text-lg">
                Insurance Certificate
              </Text>
              <Text className="text-gray-500 text-sm">Approved</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/DriverVerification");
              }}
            >
              <Ionicons name="time-outline" size={22} color={"#01A1FF"} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4">
          <View className="bg-blue-50 items-center gap-6 p-4 flex-row border-[1px] border-[#01A1FF] rounded-2xl">
            <View className="bg-white rounded-full p-3">
              <Feather name="user" size={20} color={"#01A1FF"} />
            </View>

            <View className="justify-between flex-1">
              <Text className="font-semibold text-black text-lg">
                Driver Photo
              </Text>
              <Text className="text-gray-500 text-sm">Approved</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/DriverVerification");
              }}
            >
              <Ionicons name="time-outline" size={22} color={"#01A1FF"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
