import CircularProgress from "@/components/driver/home/CircularProgress";
import CustomerCard from "@/components/driver/home/CustomerCard";
import Colors from "@/constants/color";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function FoldingStep({ setActiveStep }: any) {
  return (
    <View className="bg-white mb-6 px-4">
      <CustomerCard name="Customer" address="Live order address" />

      <View className="bg-green-100 rounded-2xl px-4 py-6 my-4  w-full items-center justify-center">
        <View className="mb-4">
          <Entypo name="check" size={22} color={"green"} />
        </View>
        <Text className="font-bold text-2xl text-black">
          Folding & Packaging
        </Text>
        <Text className="text-base text-gray-500">
          Almost ready for delivery
        </Text>
      </View>

      <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
        <Text className="font-bold text-black text-lg mb-4">
          Quality Checklist
        </Text>
        <View className="bg-green-50 rounded-2xl px-2 py-2 w-full mb-2">
          <View className="flex-row gap-3 my-2">
            <AntDesign name="check-circle" size={18} color={"green"} />
            <Text className="font-semibold text-black text-sm">
              All items washed and dried
            </Text>
          </View>
        </View>

        {/* next */}
        <View className="bg-green-50 rounded-2xl px-2 py-2 w-full mb-2">
          <View className="flex-row gap-3 my-2">
            <AntDesign name="check-circle" size={18} color={"green"} />
            <Text className="font-semibold text-black text-sm">
              All items washed and dried
            </Text>
          </View>
        </View>
        {/* next */}
        <View className="bg-green-50 rounded-2xl px-2 py-2 w-full mb-2">
          <View className="flex-row gap-3 my-2">
            <AntDesign name="check-circle" size={18} color={"green"} />
            <Text className="font-semibold text-black text-sm">
              All items washed and dried
            </Text>
          </View>
        </View>
        {/* next */}
        <View className="bg-green-50 rounded-2xl px-2 py-2 w-full mb-2">
          <View className="flex-row gap-3 my-2">
            <AntDesign name="check-circle" size={18} color={"green"} />
            <Text className="font-semibold text-black text-sm">
              All items washed and dried
            </Text>
          </View>
        </View>
      </View>

      <View className="pb-6 mt-[50px]">
        <TouchableOpacity
          onPress={() => setActiveStep(4)}
          style={{ backgroundColor: Colors.primary }}
          className="py-4 rounded-xl flex-row justify-center items-center gap-3"
        >
          <Text className="text-white font-semibold ml-2">
            Mark as "Now Folding"
          </Text>
          <FontAwesome6 name="arrow-right-long" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
