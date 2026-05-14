import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Animated,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import Toast from "@/constants/toast";
import { useRouter } from "expo-router";
import RequestPickupModal from "@/components/home/RequestPickupModal";
import DateTimePicker from "@react-native-community/datetimepicker";
import ShowMessage from "@/constants/toast";
import TodayStats from "@/components/driver/home/TodayStats";
import {
  getAccessToken,
  getRefreshToken,
} from "@/src/services/storage/tokenStorage";
import { useProfileInfoQuery } from "@/src/services/userApi";
import {
  useAcceptJobMutation,
  useDeclineJobMutation,
  useGetAvailableJobsQuery,
  useGetMyDriverProfileQuery,
  useGetMyDriverJobsQuery,
  useUpdateDriverAvailabilityMutation,
} from "@/src/services/driverApi";
import type { Order } from "@/src/services/orderApi";
import { useOrderSocket } from "@/src/hooks/useOrderSocket";

export default function HomeScreen() {
  const router = useRouter();
  const { data: profileInfo, error, isLoading } = useProfileInfoQuery();
  const { data: driverProfileRes, refetch: refetchDriverProfile } =
    useGetMyDriverProfileQuery();
  const { data: myJobsRes, refetch: refetchMyJobs } = useGetMyDriverJobsQuery();
  const { data: availableJobsRes, refetch: refetchAvailableJobs } =
    useGetAvailableJobsQuery();
  const [updateAvailability, { isLoading: isUpdatingAvailability }] =
    useUpdateDriverAvailabilityMutation();
  const [acceptJob, { isLoading: isAcceptingJob }] = useAcceptJobMutation();
  const [declineJob, { isLoading: isDecliningJob }] = useDeclineJobMutation();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [acceptModal, setAcceptModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const [pickupData, setPickupData] = useState({
    asap: true,
    date: null as Date | null,
    time: null as Date | null,
    bags: 1,
  });

  const driverProfile = driverProfileRes?.data;
  const driverStatus = driverProfile?.status ?? "PENDING";
  const driverApproved = driverStatus === "APPROVED";
  const myJobs = myJobsRes?.data ?? [];
  const availableJobs = availableJobsRes?.data ?? [];
  const activeOrder = myJobs.find(
    (order) => !["DELIVERED", "COMPLETED", "CANCELED"].includes(order.status),
  );
  const availableOrder = availableJobs[0];

  const refreshJobs = useCallback(() => {
    refetchAvailableJobs();
    refetchMyJobs();
  }, [refetchAvailableJobs, refetchMyJobs]);

  useOrderSocket({
    role: "DRIVER",
    onDriverJobsUpdate: refreshJobs,
  });

  useEffect(() => {
    if (typeof driverProfile?.isAvailable === "boolean") {
      setSelected(driverProfile.isAvailable);
    }
  }, [driverProfile?.isAvailable]);

  useEffect(() => {
    const loadTokens = async () => {
      const access = await getAccessToken();
      const refresh = await getRefreshToken();

      // console.log("home_Access:", access);
      // console.log("home_Refresh:", refresh);

      setAccessToken(access);
      setRefreshToken(refresh);
    };

    loadTokens();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: activeOrder ? getOrderProgress(activeOrder.status) : 0,
      duration: 800, // smooth speed
      useNativeDriver: false, // width animation must be false
    }).start();
  }, [activeOrder?.status]);

  useEffect(() => {
    if (!pickupData.asap && !pickupData.date) {
      setShowDatePicker(true);
    }
  }, [pickupData.asap]);

  const getStatusStyle = (status: any) => {
    switch (status) {
      case "Washing":
        return "bg-orange-100 text-orange-500";
      case "Delivered":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      // setData((prev) => ({
      //   ...prev,
      //   activeOrder: {
      //     ...prev.activeOrder,
      //     progress: 75,
      //     currentStep: 2,
      //     status: "Delivery",
      //     estimatedDelivery: "Today, 7:00 PM",
      //   },
      //   recentOrders: [
      // {
      //   id: 1248,
      //   quantity: 2,
      //   price: 90,
      //   rating: 5.0,
      //   status: "Delivered",
      //   date: "Today",
      // },
      //     ...prev.recentOrders,
      //   ],
      // }));

      setRefreshing(false);
      refetchDriverProfile();
      refetchMyJobs();
      refetchAvailableJobs();
      ShowMessage.show("updated");
    }, 1500);
  }, [refetchAvailableJobs, refetchDriverProfile, refetchMyJobs]);

  const getOrderProgress = (status: Order["status"]) => {
    switch (status) {
      case "REQUESTED":
        return 10;
      case "DRIVER_ASSIGNED":
        return 25;
      case "PICKED_UP":
        return 50;
      case "WASHING_DRYING":
        return 70;
      case "OUT_FOR_DELIVERY":
        return 90;
      case "DELIVERED":
      case "COMPLETED":
        return 100;
      default:
        return 0;
    }
  };

  const getOrderStep = (status: Order["status"]) => {
    if (status === "REQUESTED" || status === "DRIVER_ASSIGNED") return 0;
    if (status === "PICKED_UP" || status === "WASHING_DRYING") return 1;
    return 2;
  };

  const handleAcceptJob = async () => {
    if (!selectedJobId) return;
    try {
      await acceptJob(selectedJobId).unwrap();
      setAcceptModal(false);
      setSelectedJobId(null);
      refetchMyJobs();
      refetchAvailableJobs();
      ShowMessage.show("Job accepted successfully");
    } catch (error: any) {
      ShowMessage.error(error?.data?.message ?? "Failed to accept job");
    }
  };

  const handleDeclineJob = async () => {
    if (!selectedJobId) return;
    try {
      await declineJob(selectedJobId).unwrap();
      setDeclineModal(false);
      setSelectedJobId(null);
      refetchAvailableJobs();
      ShowMessage.show("Job declined successfully");
    } catch (error: any) {
      ShowMessage.error(error?.data?.message ?? "Failed to decline job");
    }
  };

  const handleToggleAvailability = async () => {
    if (!driverApproved) {
      ShowMessage.show("Your driver profile is under approval");
      return;
    }

    const nextValue = !selected;
    setSelected(nextValue);

    try {
      await updateAvailability(nextValue).unwrap();
      refetchDriverProfile();
    } catch (error: any) {
      setSelected(!nextValue);
      ShowMessage.error(
        error?.data?.message ?? "Failed to update availability",
      );
    }
  };

  const onDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setPickupData((prev) => ({
        ...prev,
        date,
        asap: false,
      }));
    }
  };

  const onTimeChange = (_: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setPickupData((prev) => ({
        ...prev,
        time,
        asap: false,
      }));
    }
  };

  const translateX = useRef(new Animated.Value(selected ? 40 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: selected ? 40 : 4,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  return (
    <View className="flex-1 bg-blue-50">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={50}
          />
        }
        className="flex-1 bg-blue-50"
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: Colors.primary,
          }}
          className=" rounded-b-[40px] pb-[60px]"
        >
          <View className="flex-row px-5 pt-12 justify-between items-center">
            <View className="flex-1">
              <Text className="text-[16px] text-white/80">Welcome back,</Text>
              <Text className="text-[22px] font-bold text-white">
                {profileInfo?.data?.name}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <View
                className={`w-4 h-4 rounded-full ${
                  selected ? "bg-green-400" : "bg-gray-400"
                }`}
              />
              <Text className="text-white text-base">
                {selected ? "Online" : "Offline"}
              </Text>
            </View>
          </View>

          {/* Availability Status */}
          <View className="px-5 mt-8">
            <View
              style={{
                backgroundColor: Colors.primary,
              }}
              className="border border-white/40 rounded-2xl p-4"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-row items-start">
                  <View className="ml-3">
                    <Text className="text-white font-semibold">
                      Availability Status
                    </Text>
                    <Text className="text-white text-sm">
                      {selected ? "Accepting new jobs" : "Not accepting jobs"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleToggleAvailability}
                  activeOpacity={0.8}
                  disabled={isUpdatingAvailability}
                  className={`w-[70px] h-[36px] rounded-full justify-center ${
                    selected ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  <Animated.View
                    style={{ transform: [{ translateX }] }}
                    className="w-[26px] h-[26px] rounded-full bg-white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Earnings */}
        {!driverApproved && (
          <View className="px-5 -mt-8 z-20">
            <View className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
              <Text className="text-base font-bold text-yellow-700">
                Driver profile {driverStatus.toLowerCase()}
              </Text>
              <Text className="mt-1 text-sm text-yellow-700">
                {driverStatus === "PENDING"
                  ? "Your driver profile is under approval. You can start taking jobs after admin approval."
                  : "Please contact support for more details."}
              </Text>
            </View>
          </View>
        )}

        {/* Today's Earnings */}
        <View className="px-5 -mt-12 z-10">
          <View
            style={{
              backgroundColor: Colors.primary,
            }}
            className="border border-white/40 shadow-xl rounded-2xl p-5 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-white text-base">Today's Earnings</Text>
              <Text className="text-white/90 text-2xl font-bold mt-1">
                $156
              </Text>
            </View>

            <View className="bg-white w-12 h-12 rounded-full justify-center items-center shadow">
              <Feather name="dollar-sign" size={26} color={Colors.primary} />
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-5 mt-6 ">
          {/* Today's Status */}
          <>
            <TodayStats />
          </>

          {/* Active Route */}
          <Text className="text-lg font-bold mb-3">Active Route</Text>
          {activeOrder ? (
            <>
              <View className="bg-white rounded-2xl px-4 py-6 shadow-sm mb-6 border border-gray-100">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-row items-safe">
                    <View
                      className="w-9 h-9 rounded-full justify-center items-center"
                      style={{ backgroundColor: "rgba(37, 99, 235, 0.2)" }}
                    >
                      <Ionicons
                        name="cube-outline"
                        size={20}
                        color={Colors.primary}
                      />
                    </View>

                    <View className="ml-2">
                      <Text className="font-semibold">
                        Order #{activeOrder._id.slice(-6)}
                      </Text>
                      <Text className="text-sm text-gray-500 mb-3">
                        {activeOrder.bags} bags • ${activeOrder.total}
                        .00
                      </Text>
                    </View>
                  </View>

                  <Text
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      activeOrder.status,
                    )}`}
                  >
                    {activeOrder.status.replaceAll("_", " ")}
                  </Text>
                </View>

                {/* Steps */}
                <View className="flex-row justify-between mb-2">
                  {["Picked Up", "Washing", "Delivery"].map((step, index) => (
                    <Text
                      key={step}
                      className={`text-xs ${
                        index <= getOrderStep(activeOrder.status)
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </Text>
                  ))}
                </View>
                <View className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                  <Animated.View
                    className="h-2 bg-blue-500 rounded-full"
                    style={{
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    }}
                  />
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-xs  text-gray-500">
                      {activeOrder.address || "Pickup address unavailable"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(common)/OrderDetailsDriver" as any,
                        params: { id: activeOrder._id },
                      })
                    }
                    className="flex-row gap-3 items-center"
                  >
                    <Text
                      style={{ color: Colors.primary }}
                      className="text-[14px] font-bold"
                    >
                      Details
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <View className="bg-white rounded-2xl px-4 py-6 shadow-sm mb-6 border border-gray-100">
              <Text className="text-gray-500">No active route right now</Text>
            </View>
          )}

          {/* Available Jobs */}
          <>
            <View className=" mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Available Jobs</Text>
              <TouchableOpacity
                onPress={() => {
                  router.push("/(driver)/(tabs)/jobs?tab=Available");
                }}
              >
                <Text className="text-blue-500 font-semibold text-base">
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            {availableOrder ? (
              <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-row mr-2 flex-1">
                    <View className="ml-2">
                      <Text className="font-semibold mb-1">
                        Order #{availableOrder._id.slice(-6)}
                      </Text>
                      <View className="flex-row">
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color="gray"
                        />

                        <Text className="text-sm text-gray-500 mb-1 ml-1 flex-shrink flex-wrap">
                          {availableOrder.address ||
                            "Pickup address unavailable"}
                        </Text>
                      </View>

                      {/* Pickup type row */}
                      <View className="flex-row">
                        <Ionicons name="time-outline" size={14} color="gray" />

                        <Text className="text-sm text-gray-500 mb-1 ml-1">
                          {availableOrder.pickupType}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="items-end justify-center ">
                    <Text className="font-bold text-green-500 text-[24px]">
                      ${availableOrder.total}
                    </Text>
                    <Text className="font-sm text-gray-500">You earn 70%</Text>
                  </View>
                </View>

                <View className="flex-row justify-between bg-blue-50 rounded-[10px] py-4 px-6">
                  <View className="flex-1 items-start justify-center">
                    <Text className="text-base text-gray-500">Begs</Text>
                    <Text className="text-lg font-bold text-black">
                      {availableOrder.bags} Bags
                    </Text>
                  </View>
                  <View className="flex-1 items-start justify-center ml-[20px]">
                    <Text className="text-base text-gray-500">Service</Text>
                    <Text className="text-lg font-bold text-black">
                      {availableOrder.serviceType.replaceAll("_", " ")}
                    </Text>
                  </View>
                </View>

                <View className=" mt-5 flex-row items-center justify-center gap-4">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedJobId(availableOrder._id);
                      setDeclineModal(true);
                    }}
                    className="flex-1 border border-red-400 py-2 rounded-xl"
                  >
                    <Text className="text-center text-lg py-1 text-red-500 font-medium">
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedJobId(availableOrder._id);
                      setAcceptModal(true);
                    }}
                    className="flex-1 bg-blue-500 py-2 rounded-xl"
                  >
                    <Text className="text-center text-lg py-1 text-white font-medium">
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
                <Text className="text-gray-500">No available jobs now</Text>
              </View>
            )}
          </>
        </View>
      </ScrollView>

      <RequestPickupModal
        visible={bottomModal}
        onClose={() => setBottomModal(false)}
        confirmed={confirmed}
        setConfirmed={setConfirmed}
        pickupData={pickupData}
        setPickupData={setPickupData}
        openDatePicker={() => setShowDatePicker(true)}
        openTimePicker={() => setShowTimePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={pickupData.date || new Date()}
          mode="date"
          minimumDate={new Date()}
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={pickupData.time || new Date()}
          mode="time"
          onChange={onTimeChange}
        />
      )}

      {/* Call Modal */}
      {confirmed && (
        <Modal
          transparent
          visible={confirmed}
          animationType="fade"
          onRequestClose={() => setConfirmed(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-6 w-[90%]">
              <Text className="text-black text-[20px] font-bold text-center">
                Are you sure you want to confirm this request?
              </Text>

              <View className="flex-row items-center mt-6 gap-4">
                <TouchableOpacity
                  onPress={() => setConfirmed(false)}
                  className="flex-1 border border-red-500 rounded-2xl py-3"
                >
                  <Text className="text-red-500 text-[20px] text-center font-semibold">
                    No
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setConfirmed(false);
                    setBottomModal(false);
                    ShowMessage.show("Pickup request confirmed");
                  }}
                  className="flex-1 bg-green-500 rounded-2xl py-3"
                >
                  <Text className="text-white text-[20px] text-center font-semibold">
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal transparent visible={declineModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-8 w-[90%]">
            <Text className="text-[24px] font-bold text-center">
              Are you sure Decline the Job?
            </Text>

            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={() => setDeclineModal(false)}
                className="flex-1 border-[2px] border-red-500 rounded-xl py-3"
              >
                <Text className="text-center text-lg text-red-500 font-bold">
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeclineJob}
                disabled={isDecliningJob}
                className="flex-1 bg-blue-500 rounded-xl py-3"
              >
                <Text className="text-white text-lg text-center font-semibold">
                  {isDecliningJob ? "Declining..." : "Yes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={acceptModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-8 w-[90%]">
            <Text className="text-[24px] font-bold text-center">
              Are you sure Accept the Job?
            </Text>

            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={() => setAcceptModal(false)}
                className="flex-1 border-[2px] border-red-500 rounded-xl py-3"
              >
                <Text className="text-center text-lg text-red-500 font-bold">
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAcceptJob}
                disabled={isAcceptingJob}
                className="flex-1 bg-blue-500 rounded-xl py-3"
              >
                <Text className="text-white text-lg text-center font-semibold">
                  {isAcceptingJob ? "Accepting..." : "Yes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
