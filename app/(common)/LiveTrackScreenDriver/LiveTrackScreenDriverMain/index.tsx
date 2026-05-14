import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/color";
import ShowMessage from "@/constants/toast";
import PickupStep from "../LiveTrackScreenDriverOnePickUp";
import WashingStep from "../LiveTrackScreenDriverTwoWas";
import DryingStep from "../LiveTrackScreenDriverThreeDrying";
import FoldingStep from "../LiveTrackScreenDriverFourFolding";
import DeliveryStep from "../LiveTrackScreenDriverFiveDelivery";
import {
  useGetMyDriverJobsQuery,
  useUpdateDriverJobStageMutation,
} from "@/src/services/driverApi";
import { useGetOrderByIdQuery, type Order } from "@/src/services/orderApi";
import { useGetPricingQuery } from "@/src/services/pricingApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";

type DriverStage = "PICKUP" | "WASHING" | "DRYING" | "DELIVERY";

const inactiveStatuses = ["DELIVERED", "COMPLETED", "CANCELED"];
const steps = ["Pickup", "Washing", "Drying", "Folding", "Delivery"];

const getStepFromOrder = (order?: Order) => {
  if (!order) return 0;
  if (["OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED"].includes(order.status)) {
    return 4;
  }
  if (order.timeline && order.timeline.dryingAt) return 3;
  if (order.status === "WASHING_DRYING") return 2;
  if (order.status === "PICKED_UP") return 1;

  return 0;
};

export default function LiveTrackScreenDriverMain() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const orderId = Array.isArray(id) ? id[0] : id;
  const {
    data: orderRes,
    isFetching: isFetchingOrder,
    refetch: refetchOrder,
  } = useGetOrderByIdQuery(orderId ?? "", { skip: !orderId });
  const {
    data: myJobsRes,
    isFetching: isFetchingJobs,
    refetch: refetchJobs,
  } = useGetMyDriverJobsQuery();
  const { data: pricingRes } = useGetPricingQuery();
  const [updateDriverJobStage, { isLoading: isUpdatingStage }] =
    useUpdateDriverJobStageMutation();
  const [activeStep, setActiveStep] = useState(0);
  const [deliverySuccessModal, setDeliverySuccessModal] = useState(false);

  const activeOrder = useMemo(() => {
    if (orderRes && orderRes.data) return orderRes.data;

    if (orderId) {
      const matchedOrder = myJobsRes && myJobsRes.data
        ? myJobsRes.data.find(order => order._id === orderId)
        : undefined;
      if (matchedOrder) return matchedOrder;
    }

    return myJobsRes && myJobsRes.data
      ? myJobsRes.data.find(order => !inactiveStatuses.includes(order.status))
      : undefined;
  }, [myJobsRes && myJobsRes.data, orderId, orderRes && orderRes.data]);

  useEffect(() => {
    setActiveStep(getStepFromOrder(activeOrder));
  }, [
    activeOrder ? activeOrder._id : undefined,
    activeOrder ? activeOrder.status : undefined,
    activeOrder && activeOrder.timeline ? activeOrder.timeline.dryingAt : undefined,
    activeOrder && activeOrder.timeline ? activeOrder.timeline.washingDryingAt : undefined,
  ]);

  const driverEarningPercentage =
    pricingRes && pricingRes.data
      ? pricingRes.data.driverEarningPercentage
      : 70;
  const displayBags =
    activeOrder
      ? activeOrder.bagCountAtPickup ?? activeOrder.bags ?? 0
      : 0;
  const displayPricePerBag =
    activeOrder && activeOrder.pricePerBag !== undefined
      ? activeOrder.pricePerBag
      : pricingRes && pricingRes.data
        ? pricingRes.data.pricePerBag
        : 0;
  const displayTotal =
    activeOrder && activeOrder.total !== undefined
      ? activeOrder.total
      : displayBags * displayPricePerBag;
  const driverEarning =
    (Number(displayTotal ?? 0) * driverEarningPercentage) / 100;
  const isLoading = isFetchingOrder || isFetchingJobs;
  const currentOrderStep = getStepFromOrder(activeOrder);

  const handleStageUpdate = async (
    stage: DriverStage,
    nextStep: number,
    bagCount?: number,
  ) => {
    if (!activeOrder || !activeOrder._id) {
      ShowMessage.error("No active order found");
      return;
    }

    try {
      await updateDriverJobStage({
        orderId: activeOrder._id,
        stage,
        bagCount,
      }).unwrap();
      await Promise.all([refetchJobs(), orderId ? refetchOrder() : undefined]);
      setActiveStep(nextStep);
    } catch (error: any) {
      ShowMessage.error(
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to update order stage",
      );
    }
  };

  if (!activeOrder && isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!activeOrder) {
    return (
      <SafeAreaView className="flex-1 bg-white px-5 pt-14">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 rounded-full p-3 self-start">
          <Ionicons name="arrow-back-outline" size={18} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-bold text-black">Order not found</Text>
          <Text className="text-gray-500 text-center mt-2">
            This route is no longer active or could not be loaded.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      <View style={{ backgroundColor: Colors.primary }} className="px-5 pt-14 pb-[60px] rounded-b-[30px]">
        <View className="flex-row justify-between items-center">
          <View className="flex-row justify-center items-center gap-4 flex-1 pr-3">
            <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 rounded-full p-3">
              <Ionicons name="arrow-back-outline" size={18} color="black" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-white text-2xl font-semibold" numberOfLines={1}>
                Order #{formatOrderNumber(activeOrder._id)}
              </Text>
              <Text className="text-blue-100 text-sm" numberOfLines={1}>
                {activeOrder.serviceType ? activeOrder.serviceType.replaceAll("_", " ") : "Laundry Service"}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-blue-100 text-xl">Earnings</Text>
            <Text className="text-white font-bold text-2xl">
              ${driverEarning.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View className="mx-4 -mt-10 bg-white rounded-2xl p-4 shadow-lg">
        <View className="flex-row justify-between items-center">
          {steps.map((step, index) => {
            const isActive = index <= activeStep;

            return (
              <TouchableOpacity
                key={step}
                onPress={() => index <= currentOrderStep && setActiveStep(index)}
                disabled={index > currentOrderStep}
                className="items-center flex-1"
              >
                <View
                  className={`w-[40px] h-[40px] rounded-full justify-center items-center shadow-lg ${
                    isActive ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <Text className={`text-base font-bold ${isActive ? "text-white" : "text-gray-500"}`}>
                    {index + 1}
                  </Text>
                </View>

                <Text className={`text-[10px] mt-1 font-semibold ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                  {step}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="h-1 bg-gray-200 mt-3 rounded-full">
          <View
            className="h-1 bg-blue-500 rounded-full"
            style={{
              width: `${((activeStep + 1) / steps.length) * 100}%`,
            }}
          />
        </View>
      </View>

      <ScrollView className="mt-4 bg-white" showsVerticalScrollIndicator={false}>
        {activeStep === 0 && (
          <PickupStep
            order={activeOrder}
            isUpdating={isUpdatingStage}
            onCompletePickup={bagCount =>
              handleStageUpdate("PICKUP", 1, bagCount)
            }
          />
        )}
        {activeStep === 1 && (
          <WashingStep
            order={activeOrder}
            isUpdating={isUpdatingStage}
            onStartWashing={() => handleStageUpdate("WASHING", 2)}
          />
        )}
        {activeStep === 2 && (
          <DryingStep
            order={activeOrder}
            isUpdating={isUpdatingStage}
            onStartDrying={() => handleStageUpdate("DRYING", 3)}
          />
        )}
        {activeStep === 3 && (
          <FoldingStep
            order={activeOrder}
            isUpdating={isUpdatingStage}
            onStartDelivery={() => handleStageUpdate("DELIVERY", 4)}
          />
        )}
        {activeStep === 4 && (
          <DeliveryStep
            order={activeOrder}
            setDeliverySuccessModal={setDeliverySuccessModal}
          />
        )}
      </ScrollView>

      <Modal transparent visible={deliverySuccessModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-8 w-[90%]">
            <View className="items-center mt-2">
              <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center">
                <View
                  style={{ backgroundColor: Colors.primary }}
                  className="w-16 h-16 rounded-full items-center justify-center"
                >
                  <Ionicons name="checkmark" size={32} color="white" />
                </View>
              </View>

              <Text className="text-2xl font-bold mt-4">Congratulations!</Text>
              <Text className="text-gray-500 text-center mt-1">
                Your delivery has been completed successfully
              </Text>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4 mt-6 border border-gray-200">
              <Text className="text-gray-500 text-sm">Service</Text>
              <Text className="text-base font-semibold mb-3">
                {activeOrder.serviceType ? activeOrder.serviceType.replaceAll("_", " ") : "Laundry Service"}
              </Text>

              <Text className="text-gray-500 text-sm">Pickup Address</Text>
              <Text className="text-base font-semibold">
                {activeOrder.address ?? "No address available"}
              </Text>
              <Text className="text-sm text-gray-500 mb-3">
                Order #{formatOrderNumber(activeOrder._id)}
              </Text>

              <Text className="text-gray-500 text-sm">Special Instructions</Text>
              <Text className="text-base font-semibold mb-3">
                {activeOrder.specialInstructions ?? "No special instructions"}
              </Text>

              <View className="border-t border-gray-200 pt-3 mt-2">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-600">
                    {displayBags} bags x ${Number(displayPricePerBag).toFixed(2)}
                  </Text>
                  <Text className="text-gray-600">
                    ${Number(displayTotal ?? 0).toFixed(2)}
                  </Text>
                </View>

                <View className="border-t border-gray-200 my-2" />

                <View className="flex-row justify-between">
                  <Text className="font-bold text-base">Total</Text>
                  <Text className="font-bold text-blue-500 text-base">
                    ${Number(displayTotal ?? 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity className="flex-row justify-center gap-4 px-4 border border-blue-500 rounded-full py-3 mt-6 items-center">
              <Text className="text-blue-500 font-medium">Download Invoice</Text>
              <Ionicons name="cloud-download-sharp" size={18} color="blue" />
            </TouchableOpacity>

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
