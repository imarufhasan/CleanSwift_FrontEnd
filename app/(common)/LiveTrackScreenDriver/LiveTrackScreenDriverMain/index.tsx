import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { SafeAreaView } from "react-native-safe-area-context";
import PickupStep from "../LiveTrackScreenDriverOnePickUp";
import WashingStep from "../LiveTrackScreenDriverTwoWas";
import DryingStep from "../LiveTrackScreenDriverThreeDrying";
import FoldingStep from "../LiveTrackScreenDriverFourFolding";
import DeliveryStep from "../LiveTrackScreenDriverFiveDelivery";
import { useRouter } from "expo-router";
import ShowMessage from "@/constants/toast";

export default function LiveTrackScreenDriverMain() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [deliverySuccessModal, setDeliverySuccessModal] = useState(false);

  const [bags, setBags] = useState(0);

  const steps = ["Pickup", "Washing", "Drying", "Folding", "Delivery"];

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      {/* 🔵 HEADER */}

      <View
        style={{ backgroundColor: Colors.primary }}
        className=" px-5 pt-14 pb-[60px] rounded-b-[30px]"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row justify-center items-center gap-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-100 rounded-full p-3"
            >
              <Ionicons name="arrow-back-outline" size={18} color={"black"} />
            </TouchableOpacity>
            <View>
                <Text className="text-white text-2xl font-semibold">
                Order #LIVE
              </Text>
              <Text className="text-blue-100 text-sm">Washing & Folding</Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-blue-100 text-xl">Earnings</Text>
            <Text className="text-white font-bold text-2xl">$45</Text>
          </View>
        </View>
      </View>

      {/* ⚪ STEP PROGRESS */}
      <View className="mx-4 -mt-10 bg-white rounded-2xl p-4 shadow-lg">
        <View className="flex-row justify-between items-center">
          {steps.map((step, index) => {
            const isActive = index <= activeStep;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveStep(index)}
                className="items-center flex-1"
              >
                <View
                  className={`w-[40px] h-[40px] rounded-full justify-center items-center shadow-lg ${
                    isActive ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-base font-bold ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  className={`text-[10px] mt-1 font-semibold ${
                    isActive ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  {step}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Progress Bar */}
        <View className="h-1 bg-gray-200 mt-3 rounded-full">
          <View
            className="h-1 bg-blue-500 rounded-full"
            style={{
              width: `${((activeStep + 1) / steps.length) * 100}%`,
            }}
          />
        </View>
      </View>

      <ScrollView
        className="mt-4 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {activeStep === 0 && <PickupStep setActiveStep={setActiveStep} />}
        {activeStep === 1 && <WashingStep setActiveStep={setActiveStep} />}
        {activeStep === 2 && <DryingStep setActiveStep={setActiveStep} />}
        {activeStep === 3 && <FoldingStep setActiveStep={setActiveStep} />}
        {activeStep === 4 && (
          <DeliveryStep setDeliverySuccessModal={setDeliverySuccessModal} />
        )}
      </ScrollView>

      <Modal transparent visible={deliverySuccessModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-8 w-[90%]">
            {/* ✅ Success Icon */}
            <View className="items-center mt-2">
              <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center">
                <View
                  style={{ backgroundColor: Colors.primary }}
                  className="w-16 h-16 rounded-full  items-center justify-center"
                >
                  <Ionicons name="checkmark" size={32} color="white" />
                </View>
              </View>

              <Text className="text-2xl font-bold mt-4">Congratulations!</Text>
              <Text className="text-gray-500 text-center mt-1">
                Your ride has been completed successfully
              </Text>
            </View>

            {/* ✅ Invoice Card */}
            <View className="bg-gray-50 rounded-2xl p-4 mt-6 border border-gray-200">
              <Text className="text-gray-500 text-sm">Service</Text>
              <Text className="text-base font-semibold mb-3">
                Washing & Drying
              </Text>

              <Text className="text-gray-500 text-sm">Pickup Address</Text>
              <Text className="text-base font-semibold">Live order address</Text>
              <Text className="text-sm text-gray-500 mb-3">Live location</Text>

              <Text className="text-gray-500 text-sm">
                Special Instructions
              </Text>
              <Text className="text-base font-semibold mb-3">
                Light wash-Gentle wash for delicate clothes
              </Text>

              <View className="border-t border-gray-200 pt-3 mt-2">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">2 bags × $45</Text>
                  <Text className="text-gray-600">$90.00</Text>
                </View>

                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">Tip</Text>
                  <Text className="text-gray-600">$5.00</Text>
                </View>

                <View className="border-t border-gray-200 my-2" />

                <View className="flex-row justify-between">
                  <Text className="font-bold text-base">Total</Text>
                  <Text className="font-bold text-blue-500 text-base">
                    $95.00
                  </Text>
                </View>
              </View>
            </View>

            {/* ✅ Download Button */}
            <TouchableOpacity className="flex-row justify-center gap-4 px-4 border border-blue-500 rounded-full py-3 mt-6 items-center">
              <Text className="text-blue-500 font-medium">
                Download Invoice
              </Text>
              <Ionicons name="cloud-download-sharp" size={18} color={"blue"} />
            </TouchableOpacity>

            {/* ✅ Done Button */}
            <TouchableOpacity
              onPress={() => {
                setDeliverySuccessModal(false);
                router.push("/(driver)/(tabs)/jobs?tab=Completed");
              }}
              style={{ backgroundColor: Colors.primary }}
              className="rounded-xl py-4 mt-4 items-center"
            >
              <Text className="text-white font-semibold text-base">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
