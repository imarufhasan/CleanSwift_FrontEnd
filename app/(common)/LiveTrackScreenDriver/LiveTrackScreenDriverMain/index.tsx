import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import {
  useCancelOrderMutation,
  useGetOrderByIdQuery,
  type Order,
} from "@/src/services/orderApi";
import { useOrderSocket } from "@/src/hooks/useOrderSocket";
import { formatOrderNumber } from "@/src/utils/orderNumber";
import AppLoader from "@/components/shared/AppLoader";

type DriverStage = "PICKUP" | "WASHING" | "DRYING" | "FOLDING" | "DELIVERY";

const inactiveStatuses = ["DELIVERED", "COMPLETED", "CANCELED"];
const steps = ["Pickup", "Washing", "Drying", "Folding", "Delivery"];

const getEffectiveBagCount = (order?: Order) =>
  Math.max(
    0,
    order?.bagCountAtDelivery ?? order?.bagCountAtPickup ?? order?.bags ?? 0,
  );

const getOrderDriverEarningPercentage = (
  order?: Pick<Order, "driverEarningPercentage">,
) => Number(order?.driverEarningPercentage ?? 70);

const getStepFromOrder = (order?: Order) => {
  if (!order) return 0;
  if (["OUT_FOR_DELIVERY", "DELIVERED", "COMPLETED"].includes(order.status)) {
    return 4;
  }
  if (order.status === "FOLDING") return 4;
  if (order.status === "DRYING") return 3;
  if (order.timeline && order.timeline.foldingAt) return 3;
  if (order.timeline && order.timeline.dryingAt) return 3;
  if (order.timeline && order.timeline.washingDryingAt) return 2;
  if (order.status === "WASHING_DRYING") return 1;
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
  const [updateDriverJobStage, { isLoading: isUpdatingStage }] =
    useUpdateDriverJobStageMutation();

  const [cancelOrder, { isLoading: isCancelReqLoading }] =
    useCancelOrderMutation();

  const [activeStep, setActiveStep] = useState(0);

  const refreshDriverOrder = useCallback(() => {
    refetchJobs();
    if (orderId) {
      refetchOrder();
    }
  }, [orderId, refetchJobs, refetchOrder]);

  useOrderSocket({
    role: "DRIVER",
    orderId,
    onDriverJobsUpdate: refreshDriverOrder,
  });

  const activeOrder = useMemo(() => {
    if (orderRes && orderRes.data) return orderRes.data;

    if (orderId) {
      const matchedOrder =
        myJobsRes && myJobsRes.data
          ? myJobsRes.data.find((order) => order._id === orderId)
          : undefined;
      if (matchedOrder) return matchedOrder;
    }

    return myJobsRes && myJobsRes.data
      ? myJobsRes.data.find((order) => !inactiveStatuses.includes(order.status))
      : undefined;
  }, [myJobsRes && myJobsRes.data, orderId, orderRes && orderRes.data]);

  useEffect(() => {
    setActiveStep(getStepFromOrder(activeOrder));
  }, [
    activeOrder ? activeOrder._id : undefined,
    activeOrder ? activeOrder.status : undefined,
    activeOrder && activeOrder.timeline
      ? activeOrder.timeline.dryingAt
      : undefined,
    activeOrder && activeOrder.timeline
      ? activeOrder.timeline.washingDryingAt
      : undefined,
    activeOrder && activeOrder.timeline
      ? activeOrder.timeline.foldingAt
      : undefined,
  ]);

  const driverEarningPercentage = getOrderDriverEarningPercentage(activeOrder);
  const displayBags = activeOrder ? getEffectiveBagCount(activeOrder) : 0;
  const displayPricePerBag =
    activeOrder && activeOrder.pricePerBag !== undefined
      ? activeOrder.pricePerBag
      : 0;
  const displayTotal = displayBags * Number(displayPricePerBag);
  const driverEarning =
    (Number(displayTotal ?? 0) * Number(driverEarningPercentage)) / 100;
  const isLoading = isFetchingOrder || isFetchingJobs;
  const currentOrderStep = getStepFromOrder(activeOrder);
  const isOrderLocked =
    activeOrder?.status === "COMPLETED" || activeOrder?.status === "CANCELED";

  const handleStageUpdate = async (
    stage: DriverStage,
    nextStep: number,
    bagCount?: number,
  ): Promise<boolean> => {
    if (isOrderLocked) {
      ShowMessage.show("This order is already completed.");
      return false;
    }

    if (!activeOrder || !activeOrder._id) {
      ShowMessage.error("No active order found");
      return false;
    }

    try {
      await updateDriverJobStage({
        orderId: activeOrder._id,
        stage,
        bagCount,
      }).unwrap();
      await Promise.all([refetchJobs(), orderId ? refetchOrder() : undefined]);
      setActiveStep(nextStep);
      return true;
    } catch (error: any) {
      ShowMessage.error(
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to update order stage",
      );
      return false;
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
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-100 rounded-full p-3 self-start"
        >
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

  const onCancelRequest = async () => {
    try {
      const res = await cancelOrder({
        orderId: activeOrder?._id!,
        reason: "Canceled by driver before pickup",
      }).unwrap();
      if (res?.success) {
        ShowMessage.show(
          res?.message || "Order sent back to available jobs",
        );
        router.back();
      } else {
        ShowMessage.show(res?.message || "Order cancelled fail");
      }
    } catch (error: unknown) {
      const err = error as any;
      if (
        err?.status === "FETCH_ERROR" ||
        err?.message === "Network request failed"
      ) {
        ShowMessage.error(
          "Server is not reachable. Please check your internet or try again later.",
        );
        return;
      }
      if (err?.status === "PARSING_ERROR") {
        ShowMessage.error("Server response error. Please try again.");
        return;
      }
      ShowMessage.error(
        err?.data?.message ||
          "An error occurred while updating. Please try again.",
      );
      return false;
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      <View
        style={{ backgroundColor: Colors.primary }}
        className="px-5 pt-14 pb-[60px] rounded-b-[30px]"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row justify-center items-center gap-4 flex-1 pr-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-100 rounded-full p-3"
            >
              <Ionicons name="arrow-back-outline" size={18} color="black" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text
                className="text-white text-2xl font-semibold"
                numberOfLines={1}
              >
                Order #{formatOrderNumber(activeOrder._id)}
              </Text>
              <Text className="text-blue-100 text-sm" numberOfLines={1}>
                {activeOrder.serviceType
                  ? activeOrder.serviceType.replaceAll("_", " ")
                  : "Laundry Service"}
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
                onPress={() =>
                  index <= currentOrderStep && setActiveStep(index)
                }
                disabled={index > currentOrderStep}
                className="items-center flex-1"
              >
                <View
                  className={`w-[40px] h-[40px] rounded-full justify-center items-center shadow-lg ${
                    isActive ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-base font-bold ${isActive ? "text-white" : "text-gray-500"}`}
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  className={`text-[10px] mt-1 font-semibold ${isActive ? "text-blue-500" : "text-gray-400"}`}
                >
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

      <ScrollView
        className="mt-4 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {activeStep === 0 && (
          <PickupStep
            order={activeOrder}
            isUpdating={isUpdatingStage}
            readOnly={isOrderLocked}
            onCompletePickup={(bagCount) =>
              handleStageUpdate("PICKUP", 1, bagCount)
            }
            onCancelRequest={
              activeOrder.status === "DRIVER_ASSIGNED"
                ? onCancelRequest
                : undefined
            }
            isCancelling={isCancelReqLoading}
          />
        )}
        {activeStep === 1 && (
          <WashingStep
            order={activeOrder}
            isUpdating={isUpdatingStage}
            readOnly={isOrderLocked}
            onStartWashing={() => handleStageUpdate("WASHING", 2)}
          />
        )}
        {activeStep === 2 && (
          <DryingStep
            order={activeOrder}
            isUpdating={isUpdatingStage}
            readOnly={isOrderLocked}
            onStartDrying={() => handleStageUpdate("DRYING", 3)}
          />
        )}
        {activeStep === 3 && (
          <FoldingStep
            order={activeOrder}
            isUpdating={isUpdatingStage}
            readOnly={isOrderLocked}
            onStartDelivery={() => handleStageUpdate("FOLDING", 4)}
          />
        )}
        {activeStep === 4 && (
          <DeliveryStep
            order={activeOrder}
            readOnly={isOrderLocked}
            onStartOutForDelivery={() => handleStageUpdate("DELIVERY", 4)}
          />
        )}
      </ScrollView>

      <AppLoader visible={isCancelReqLoading} />
    </SafeAreaView>
  );
}
