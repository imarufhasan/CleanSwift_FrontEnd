import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import {
  Ionicons,
  Feather,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
  type Order,
} from "@/src/services/orderApi";
import { useOrderSocket } from "@/src/hooks/useOrderSocket";
import { useLocalSearchParams } from "expo-router";
import { formatOrderNumber } from "@/src/utils/orderNumber";
import ShowMessage from "@/constants/toast";
import AppLoader from "@/components/shared/AppLoader";

const buildSteps = (order?: Order) => {
  const current = !order
    ? 0
    : order.status === "DELIVERED" || order.status === "COMPLETED"
      ? 8
      : order.status === "OUT_FOR_DELIVERY"
        ? 6
        : order.status === "FOLDING"
          ? 5
          : order.status === "DRYING"
            ? 4
            : order.timeline?.foldingAt
              ? 5
              : order.timeline?.dryingAt
                ? 4
                : order.status === "WASHING_DRYING"
                  ? 3
                  : order.status === "PICKED_UP"
                    ? 2
                    : order.status === "DRIVER_ASSIGNED"
                      ? 1
                      : 0;

  const orderSteps = [
    { key: "requested", title: "Requested", icon: "time-outline" },
    {
      key: "driver_assigned",
      title: "Driver Assigned",
      icon: "person-outline",
    },
    { key: "picked", title: "Picked Up", icon: "cube-outline" },
    { key: "washing", title: "Washing", icon: "water-outline" },
    { key: "drying", title: "Drying", icon: "cloud-outline" },
    { key: "folding", title: "Folding", icon: "layers-outline" },
    { key: "delivery", title: "Out for Delivery", icon: "bicycle-outline" },
    {
      key: "delivered",
      title: "Delivered",
      icon: "checkmark-done-circle-outline",
    },
  ];

  return orderSteps.map((step, index) => ({
    ...step,
    status: index < current ? "done" : index === current ? "active" : "pending",
  }));
};

const getEffectiveBagCount = (order?: Order) =>
  Math.max(
    0,
    order?.bagCountAtDelivery ?? order?.bagCountAtPickup ?? order?.bags ?? 0,
  );

export default function LiveTrackingScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
 // console.log("orderId: ", orderId);

  const [cancelOrder, { isLoading: isCancelReqLoading }] =
    useCancelOrderMutation();

  const { data: ordersRes, refetch } = useGetMyOrdersQuery();
  const orders = ordersRes?.data ?? [];

  const clickedOrder = orderId
    ? orders.find((o) => o._id === orderId)
    : undefined;
  const activeOrder = orderId
    ? clickedOrder
    : orders.find(
        (o) => !["DELIVERED", "COMPLETED", "CANCELED"].includes(o.status),
      );

  const driver = activeOrder?.driver ?? null;
  //console.log("driver: ", driver);

  const driverName =
    activeOrder && typeof activeOrder.driver === "object" && activeOrder.driver
      ? (activeOrder.driver.name ?? "Driver")
      : "Driver";
  const driverImage =
    activeOrder && typeof activeOrder.driver === "object" && activeOrder.driver
      ? (activeOrder.driver.image ?? "")
      : "";

  const status2 = {
    label: activeOrder?.status?.replaceAll("_", " ") ?? "No active order",
    etaMinutes: activeOrder?.scheduledPickupAt ? 12 : 0,
  };

  const getEtaMinutes2 = (order?: Order) => {
    if (!order) return 12;

    if (order.scheduledPickupAt) {
      const diff = new Date(order.scheduledPickupAt).getTime() - Date.now();
      const minutes = Math.round(diff / 60000);

      // clamp between 5–60 mins
      return Math.max(5, Math.min(minutes, 60));
    }

    return 12;
  };
  const getEtaMinutes = (order?: Order) => {
    if (!order) return null;
   // console.log("order.scheduledPickupAt: ", order.scheduledPickupAt);

    if (order.scheduledPickupAt) {
      const diff = new Date(order.scheduledPickupAt).getTime() - Date.now();
      const mins = Math.round(diff / 60000);

      return Math.max(1, Math.min(mins, 60));
    } else {
      return "ASAP";
    }

    // switch (order.status) {
    //   case "OUT_FOR_DELIVERY":
    //     return 5;
    //   case "PICKED_UP":
    //     return 10;
    //   case "DRIVER_ASSIGNED":
    //     return 15;
    //   case "WASHING_DRYING":
    //   case "DRYING":
    //   case "FOLDING":
    //     return 30;
    //   default:
    //     return null;
    // }
  };

  //console.log("activeOrder?.status: ", activeOrder?.status);

  const status = {
    label: activeOrder?.status?.replaceAll("_", " ") ?? "No active order",
    etaMinutes: getEtaMinutes(activeOrder),
  };
 // console.log("getEtaMinutes(activeOrder): ", getEtaMinutes(activeOrder));

  const orderDetails = {
    service: activeOrder?.serviceType
      ? activeOrder.serviceType.replaceAll("_", " ")
      : "Unavailable",
    address: {
      street: activeOrder?.address ?? "No address available",
      city: "",
    },
    instructions: activeOrder?.specialInstructions ?? "No special instructions",
    pricing: {
      bags: getEffectiveBagCount(activeOrder),
      bagPrice: activeOrder?.pricePerBag ?? 0,
      tip: 0,
    },
  };

 // console.log("orderDetails activeOrder: ", activeOrder);

  const total =
    orderDetails.pricing.bags * orderDetails.pricing.bagPrice +
    orderDetails.pricing.tip;

  useOrderSocket({
    role: "CUSTOMER",
    orderId: activeOrder?._id,
    onCustomerUpdate: refetch,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const steps = buildSteps(activeOrder);
  const completedCount = steps.filter((s) => s.status === "done").length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const driverPhone =
    activeOrder && typeof activeOrder.driver === "object" && activeOrder.driver
      ? (activeOrder.driver.phone ?? "")
      : "";

  const handleCancelRequest = async () => {
    try {
      const res = await cancelOrder({
        orderId: activeOrder?._id!,
        reason: "Canceled by customer before pickup",
      }).unwrap();
      if (res?.success) {
        ShowMessage.show(
          res?.message || "Driver assignment cancelled successfully",
        );
        router.back();
      } else {
        ShowMessage.error(res?.message || "Order cancelled fail");
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
    <View className="flex-1 bg-[#F6F9FF]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ═══════════════ MAP HERO ═══════════════ */}
        <View className="h-[340px] bg-blue-50 relative overflow-hidden">
          {/* Map grid */}
          <View className="absolute inset-0 opacity-25">
            <View className="flex-1 flex-row flex-wrap">
              {[...Array(100)]?.map((_, i) => (
                <View
                  key={i}
                  className="w-[10%] h-[10%] border border-blue-200"
                />
              ))}
            </View>
          </View>

          {/* Faux route line */}
          <View className="absolute inset-0 items-center justify-center">
            <View
              className="bg-blue-400 opacity-30"
              style={{
                width: 2,
                height: 180,
                transform: [{ rotate: "25deg" }],
              }}
            />
          </View>

          {/* Pulse location marker */}
          <View className="absolute self-center top-1/2 -mt-14 items-center">
            <View className="w-[140px] h-[140px] items-center justify-center rounded-full bg-blue-500/5">
              <View className="w-[100px] h-[100px] items-center justify-center rounded-full bg-blue-500/10">
                <View className="w-[68px] h-[68px] items-center justify-center rounded-full bg-blue-500/20">
                  <View
                    className="w-[56px] h-[56px] items-center justify-center rounded-full bg-white"
                    style={{
                      shadowColor: "#2563eb",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <Ionicons name="location-sharp" size={28} color="#2563eb" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Top bar */}
          <SafeAreaView
            edges={["top"]}
            className="absolute top-0 left-0 right-0"
          >
            <View className="flex-row items-center justify-between px-4 pt-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-white w-11 h-11 rounded-full items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Ionicons name="arrow-back" size={20} color="#111" />
              </TouchableOpacity>

              <View
                className="bg-white px-4 py-2.5 rounded-full flex-row items-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                <Text className="font-semibold text-sm text-gray-900">
                  {status.label}
                </Text>
              </View>

              <View className="w-11" />
            </View>
          </SafeAreaView>

          {/* Zoom */}
          <View className="absolute right-4 top-28">
            <TouchableOpacity
              className="bg-white w-10 h-10 rounded-xl justify-center items-center mb-2"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Feather name="plus" size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white w-10 h-10 rounded-xl justify-center items-center"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Feather name="minus" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ═══════════════ ETA + PROGRESS OVERLAY CARD ═══════════════ */}
        <View className="-mt-12 mx-5 mb-6">
          <View
            className="bg-white rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-xs text-gray-500 font-medium">
                  Estimated Ready Time
                </Text>
                <Text className="font-bold text-3xl text-gray-900 mt-1">
                  {/* {status.etaMinutes ? `${status.etaMinutes}` : "--"} */}
                  {/* {status.etaMinutes === null || status.etaMinutes === undefined
                    ? "ASAP"
                    : status.etaMinutes}
                  <Text className="text-base font-semibold text-gray-500">
                    {" "}
                    mins
                  </Text> */}
                  {status.etaMinutes == null ? (
                    <Text className="font-bold text-3xl text-gray-900 mt-1">
                      ASAP
                    </Text>
                  ) : (
                    <Text className="font-bold text-3xl text-gray-900 mt-1">
                      {status.etaMinutes}
                      <Text className="text-base font-semibold text-gray-500">
                        {status.etaMinutes !== "ASAP" && " mins"}
                      </Text>
                    </Text>
                  )}
                </Text>
              </View>
              <View className="bg-blue-50 w-14 h-14 rounded-2xl items-center justify-center">
                <Ionicons name="time-outline" size={26} color="#2563eb" />
              </View>
            </View>

            {/* Progress bar */}
            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs font-semibold text-gray-600">
                  {completedCount} of {steps.length} steps
                </Text>
                <Text className="text-xs font-semibold text-blue-600">
                  {progressPercent}%
                </Text>
              </View>
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ═══════════════ ORDER PROGRESS ═══════════════ */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-bold text-xl text-gray-900">
              Order Progress
            </Text>
            <View className="bg-blue-50 rounded-full px-3 py-1.5 flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
              <Text className="text-xs font-semibold text-blue-600">Live</Text>
            </View>
          </View>

          <View
            className="bg-white rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {steps?.map((step, index) => {
              const isLast = index === steps.length - 1;
              const isDone = step.status === "done";
              const isActive = step.status === "active";
              const nextIsDone = !isLast && steps[index + 1].status === "done";

              return (
                <View key={step.key} className="flex-row">
                  {/* Icon + line column — continuous, no gaps */}
                  <View className="items-center mr-4" style={{ width: 40 }}>
                    <View
                      className={`w-10 h-10 rounded-full justify-center items-center ${
                        isDone
                          ? "bg-green-500"
                          : isActive
                            ? "bg-blue-500"
                            : "bg-gray-100"
                      }`}
                      style={
                        isActive
                          ? {
                              shadowColor: "#3B82F6",
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.4,
                              shadowRadius: 8,
                              elevation: 4,
                            }
                          : undefined
                      }
                    >
                      {isDone ? (
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      ) : (
                        <Ionicons
                          name={step.icon as any}
                          size={18}
                          color={isActive ? "#fff" : "#9ca3af"}
                        />
                      )}
                    </View>

                    {!isLast && (
                      <View
                        className={`w-[2px] flex-1 ${
                          isDone && nextIsDone
                            ? "bg-green-500"
                            : isDone
                              ? "bg-blue-400"
                              : "bg-gray-200"
                        }`}
                      />
                    )}
                  </View>

                  {/* Text column */}
                  <View className={`flex-1 ${!isLast ? "pb-6" : ""} pt-2`}>
                    <Text
                      className={`font-semibold text-base ${
                        isDone || isActive ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </Text>
                    {isActive && (
                      <View className="flex-row items-center mt-1">
                        <View className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
                        <Text className="text-xs text-blue-600 font-semibold">
                          In Progress
                        </Text>
                      </View>
                    )}
                    {isDone && (
                      <Text className="text-xs text-green-600 font-medium mt-0.5">
                        Completed
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ═══════════════ DRIVER CARD ═══════════════ */}
        <View className="mx-5 mb-6">
          <Text className="font-bold text-xl text-gray-900 mb-3">
            Your Driver
          </Text>

          <View
            className="bg-white rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="relative">
                <Image
                  source={
                    driverImage
                      ? { uri: driverImage }
                      : require("@/assets/images/profile.png")
                  }
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                  resizeMode="cover"
                />
                <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </View>

              <View className="flex-1 ml-3">
                <Text className="font-bold text-base text-gray-900">
                  {driverName}
                </Text>
                <View className="flex-row items-center mt-1">
                  <RatingStars
                    rating={driverImage || driverName !== "Driver" ? 4.9 : 0}
                  />
                  <Text className="text-xs ml-1.5 text-gray-500">
                    {driverImage || driverName !== "Driver"
                      ? "Assigned driver"
                      : "No driver yet"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(common)/DriverDetails" as any,
                    params: {
                      orderId: String(activeOrder?._id ?? ""),
                      name: driver?.name ?? "Driver",
                      image: driverImage,
                      rating: String(
                        activeOrder?.driverRating ??
                          activeOrder?.driverRatingSummary?.avg ??
                          0,
                      ),
                      trips: String(activeOrder?.driverTrips ?? 0),
                      vehicle:
                        activeOrder?.driverVehicleText ??
                        "Vehicle info unavailable",
                    },
                  })
                }
                className="bg-gray-50 w-9 h-9 rounded-full items-center justify-center"
              >
                <Feather name="chevron-right" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(common)/ChatScreen" as any,
                    params: {
                      orderId: String(activeOrder?._id ?? ""),
                      name: driverName,
                      avatar: driverImage,
                    },
                  })
                }
                className="flex-1 bg-blue-50 rounded-2xl py-3.5 flex-row justify-center items-center"
              >
                <AntDesign name="message" size={16} color={Colors.primary} />
                <Text
                  style={{ color: Colors.primary }}
                  className="ml-2 font-semibold text-sm"
                >
                  Message
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (driverPhone) {
                    Linking.openURL(`tel:${driverPhone}`);
                  } else {
                    router.push({
                      pathname: "/(common)/CallScreen" as any,
                      params: { name: driverName, image: driverImage },
                    });
                  }
                }}
                style={{ backgroundColor: Colors.primary }}
                className="flex-1 rounded-2xl py-3.5 flex-row justify-center items-center"
              >
                <Ionicons name="call-outline" size={16} color="#fff" />
                <Text className="ml-2 font-semibold text-sm text-white">
                  Call Driver
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ═══════════════ ORDER DETAILS ═══════════════ */}
        <View className="mx-5 mb-6">
          <Text className="font-bold text-xl text-gray-900 mb-3">
            Order Details
          </Text>

          <View
            className="bg-white rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* Top row: Order ID + Service */}
            <View className="flex-row mb-5">
              <View className="flex-1 flex-row items-center">
                <View className="bg-blue-50 w-10 h-10 rounded-xl items-center justify-center mr-3">
                  <Feather name="hash" size={16} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-400 text-xs font-medium">
                    Order ID
                  </Text>
                  <Text
                    className="font-semibold text-gray-900 text-sm"
                    numberOfLines={1}
                  >
                    {formatOrderNumber(activeOrder?._id ?? "")}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center mb-5">
              <View className="bg-purple-50 w-10 h-10 rounded-xl items-center justify-center mr-3">
                <MaterialCommunityIcons
                  name="washing-machine"
                  size={18}
                  color="#9333ea"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs font-medium">
                  Service
                </Text>
                <Text className="font-semibold text-gray-900 text-sm">
                  {orderDetails.service}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-5">
              <View className="bg-orange-50 w-10 h-10 rounded-xl items-center justify-center mr-3">
                <Ionicons name="location-outline" size={18} color="#ea580c" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs font-medium">
                  Pickup Address
                </Text>
                <Text className="font-semibold text-gray-900 text-sm leading-5">
                  {orderDetails.address.street}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-5">
              <View className="bg-amber-50 w-10 h-10 rounded-xl items-center justify-center mr-3">
                <Feather name="info" size={16} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 text-xs font-medium">
                  Instructions
                </Text>
                <Text className="font-medium text-gray-700 text-sm leading-5">
                  {orderDetails.instructions}
                </Text>
              </View>
            </View>

            {/* Price summary */}
            <View className="bg-gray-50 rounded-2xl p-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600 text-sm">
                  {orderDetails.pricing.bags} bags × $
                  {orderDetails.pricing.bagPrice}
                </Text>
                <Text className="text-gray-900 font-semibold text-sm">
                  ${orderDetails.pricing.bags * orderDetails.pricing.bagPrice}
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600 text-sm">Tip</Text>
                <Text className="text-gray-900 font-semibold text-sm">
                  ${orderDetails.pricing.tip}
                </Text>
              </View>

              <View className="h-[1px] bg-gray-200 mb-3" />

              <View className="flex-row justify-between items-center">
                <Text className="font-bold text-base text-gray-900">Total</Text>
                <Text
                  className="font-bold text-xl"
                  style={{ color: Colors.primary }}
                >
                  ${total}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ═══════════════ COMPLETE DELIVERY CTA ═══════════════ */}
        {activeOrder?.status === "OUT_FOR_DELIVERY" && (
          <View className="px-5 mb-6">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(common)/DeliveredSuccessScreen" as any,
                  params: {
                    orderId: String(activeOrder?._id ?? ""),
                    driverId: String(activeOrder?.driver?._id ?? ""),
                    name: driver?.name ?? "Driver",
                    image: driver?.image ?? "",
                    service: orderDetails.service,
                    address: orderDetails.address.street,
                    bags: String(orderDetails.pricing.bags),
                    bagPrice: String(orderDetails.pricing.bagPrice),
                    tip: String(orderDetails.pricing.tip),
                  },
                })
              }
              className="bg-green-600 rounded-2xl py-4 flex-row justify-center items-center"
              style={{
                shadowColor: "#16a34a",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text className="text-white text-base font-bold ml-2">
                Complete Delivery
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeOrder?.status === "DRIVER_ASSIGNED" && (
          <View className="px-5 mb-6 mt-8">
            <TouchableOpacity
              onPress={handleCancelRequest}
              activeOpacity={0.85}
              className="bg-red-500 rounded-2xl py-4 px-5 flex-row items-center justify-center"
              style={{
                shadowColor: "#ef4444",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                <Ionicons name="close-circle-outline" size={22} color="#fff" />
              </View>

              <View className="flex-1">
                <Text className="text-white font-bold text-base">
                  Cancel Request
                </Text>

                <Text className="text-red-100 text-xs mt-0.5">
                  Cancel before pickup and send this order back to drivers
                </Text>
              </View>

              <Feather name="chevron-right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <AppLoader visible={isCancelReqLoading} />
        <SafeAreaView edges={["bottom"]} />
      </ScrollView>
    </View>
  );
}
