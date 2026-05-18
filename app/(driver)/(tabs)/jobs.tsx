import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import ShowMessage from "@/constants/toast";
import { useOrderSocket } from "@/src/hooks/useOrderSocket";
import {
  useAcceptJobMutation,
  useDeclineJobMutation,
  useGetAvailableJobsQuery,
  useGetMyDriverJobsQuery,
  useGetMyDriverProfileQuery,
} from "@/src/services/driverApi";
import type { Order } from "@/src/services/orderApi";
import { useGetPricingQuery } from "@/src/services/pricingApi";
import { formatOrderNumber } from "@/src/utils/orderNumber";
import RecentOrdersList from "@/components/home/components/RecentOrdersList";

type JobTab = "Available" | "Active" | "Completed";
type JobCardData = {
  id: string;
  address: string;
  time: string;
  price: string;
  bags: string;
  distance: string;
  quantity: number;
  status: string;
};

const formatStatus = (status?: string) => (status ?? "").replaceAll("_", " ");

const mapOrderToJob = (order: Order): JobCardData => ({
  id: order._id,
  address: order.address ?? "Pickup address",
  time: order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : "Recently posted",
  price: `$${Number(order.total ?? 0).toFixed(2)}`,
  bags: `${order.bags} Bags`,
  distance: order.pickupType === "ASAP" ? "ASAP" : "Scheduled",
  quantity: order.bags,
  status: order.status,
});

const TopTab = ({
  label,
  active,
  onPress,
}: {
  label: JobTab;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-1 rounded-xl py-2"
    style={{ backgroundColor: active ? Colors.primary : "transparent" }}
  >
    <Text
      className={`py-1 text-center text-base font-semibold ${active ? "text-white" : "text-gray-500"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* -------------------- Job Card -------------------- */
const JobCard = ({
  item,
  driverEarningPercentage,
  showActions,
  acceptDisabled,
  onAccept,
  onDecline,
  onDetails,
}: {
  item: JobCardData;
  driverEarningPercentage: number;
  showActions?: boolean;
  acceptDisabled?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onDetails?: () => void;
}) => (
  <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
    {/* Header */}
    <View className="mb-2 flex-row items-start justify-between">
      <View className="flex-1 pr-3">
        <View className="flex-row items-center gap-2">
          <Text className="font-semibold text-black">
            Order #{formatOrderNumber(item.id)}
          </Text>
          {showActions && (
            <Text className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
              New
            </Text>
          )}
        </View>

        <View className="mt-1 flex-row items-center">
          <Feather name="map-pin" size={14} color="#6B7280" />
          <Text className="ml-1 flex-1 text-xs text-gray-500">
            {item.address}
          </Text>
        </View>

        <Text className="mt-1 text-xs text-gray-400">{item.time}</Text>
      </View>

      <View className="items-end">
        <Text className="text-lg font-bold text-green-600">{item.price}</Text>
        <Text className="text-xs text-gray-400">
          You earn {driverEarningPercentage}%
        </Text>
      </View>
    </View>

    {/* Info */}
    <View className="mt-2 flex-row rounded-xl bg-gray-50 p-3">
      <View className="flex-1">
        <Text className="text-xs text-gray-400">Bags</Text>
        <Text className="font-semibold text-black">{item.bags}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-xs text-gray-400">Pickup</Text>
        <Text className="font-semibold text-black">{item.distance}</Text>
      </View>
    </View>

    {/* Actions */}
    {showActions ? (
      <View className="mt-4 flex-row gap-3">
        <TouchableOpacity
          onPress={onDecline}
          className="flex-1 rounded-xl border border-red-400 py-2"
        >
          <Text className="py-1 text-center text-lg font-medium text-red-500">
            Decline
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onAccept}
          className="flex-1 rounded-xl bg-blue-500 py-2"
        >
          <Text className="py-1 text-center text-lg font-medium text-white">
            Accept
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity onPress={onDetails} className="mt-3 self-end">
        <Text style={{ color: Colors.primary }} className="font-semibold">
          View Details
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

function ActiveOrderCard({
  order,
  router,
  getOrderProgress,
  getOrderStep,
  getStatusStyle,
}: {
  order: JobCardData;
  router: any;
  getOrderProgress: (status: JobCardData["status"]) => number;
  getOrderStep: (status: JobCardData["status"]) => number;
  getStatusStyle: (status: any) => string;
}) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: getOrderProgress(order.status),
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [order.status]);

  return (
    <View className="bg-white rounded-2xl px-4 py-6 shadow-sm mb-4 border border-gray-100">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-safe">
          <View
            className="w-9 h-9 rounded-full justify-center items-center"
            style={{ backgroundColor: "rgba(37, 99, 235, 0.2)" }}
          >
            <Ionicons name="cube-outline" size={20} color={Colors.primary} />
          </View>

          <View className="ml-2">
            <Text className="font-semibold">
              Order #{formatOrderNumber(order.id)}
            </Text>
            <Text className="text-sm text-gray-500 mb-3">
              {order.bags} • {order.price}
            </Text>
          </View>
        </View>

        <Text
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
            order.status,
          )}`}
        >
          {order.status.replaceAll("_", " ")}
        </Text>
      </View>

      {/* Steps */}
      <View className="flex-row justify-between mb-2">
        {["Picked Up", "Washing", "Delivery"].map((step, index) => (
          <Text
            key={step}
            className={`text-xs ${
              index <= getOrderStep(order.status)
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
          <Text className="text-xs text-gray-500">
            {order.address || "Pickup address unavailable"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname:
                "/(common)/LiveTrackScreenDriver/LiveTrackScreenDriverMain" as any,
              params: { id: order.id },
            })
          }
          className="flex-row gap-3 items-center"
        >
          <Text
            style={{ color: Colors.primary }}
            className="text-[14px] font-bold"
          >
            Live Track
          </Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function JobsScreen() {
  const { tab } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<JobTab>("Available");
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);
  const [acceptModal, setAcceptModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const {
    data: availableRes,
    isFetching: isAvailableLoading,
    refetch: refetchAvailableJobs,
  } = useGetAvailableJobsQuery();
  const {
    data: myJobsRes,
    isFetching: isMyJobsLoading,
    refetch: refetchMyJobs,
  } = useGetMyDriverJobsQuery();
  const { data: driverProfileRes } = useGetMyDriverProfileQuery();
  const { data: pricingRes } = useGetPricingQuery();
  const [acceptJob, { isLoading: isAccepting }] = useAcceptJobMutation();
  const [declineJob, { isLoading: isDeclining }] = useDeclineJobMutation();
  const driverEarningPercentage =
    pricingRes?.data?.driverEarningPercentage ?? 70;

  const refreshJobs = useCallback(() => {
    refetchAvailableJobs();
    refetchMyJobs();
  }, [refetchAvailableJobs, refetchMyJobs]);

  useOrderSocket({
    role: "DRIVER",
    onDriverJobsUpdate: refreshJobs,
  });

  const availableJobs = (
    availableRes && availableRes.data ? availableRes.data : []
  ).map(mapOrderToJob);
  const myJobs = (myJobsRes && myJobsRes.data ? myJobsRes.data : []).map(
    mapOrderToJob,
  );
  const activeJobs = myJobs.filter(
    (job) => !["DELIVERED", "COMPLETED", "CANCELED"].includes(job.status),
  );
  const completedJobs = myJobs.filter((job) =>
    ["DELIVERED", "COMPLETED"].includes(job.status),
  );
  const capacityLimit = Math.max(
    1,
    Number(driverProfileRes?.data?.capacityLimit ?? 3),
  );
  const isAtCapacity =
    (driverProfileRes?.data?.status ?? "PENDING") === "APPROVED" &&
    activeJobs.length >= capacityLimit;

  useEffect(() => {
    if (tab === "Active") setActiveTab("Active");
    else if (tab === "Completed") setActiveTab("Completed");
    else if (tab === "Available") setActiveTab("Available");
  }, [tab]);

  const getOrderProgress = (status: JobCardData["status"]) => {
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

  const getOrderStep = (status: JobCardData["status"]) => {
    if (status === "REQUESTED" || status === "DRIVER_ASSIGNED") return 0;
    if (status === "PICKED_UP" || status === "WASHING_DRYING") return 1;
    return 2;
  };

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

  const handleAccept = async () => {
    if (isAtCapacity) {
      ShowMessage.error("Capacity full. Finish one active order first.");
      return;
    }

    if (!selectedJob) return;

    try {
      const res = await acceptJob(selectedJob.id).unwrap();
      ShowMessage.success(
        res && res.message ? res.message : "Job accepted successfully",
      );
      setAcceptModal(false);
      setSelectedJob(null);
      router.setParams({ tab: "Active" });
    } catch (error: any) {
      ShowMessage.error(
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to accept job",
      );
    }
  };

  const handleDecline = async () => {
    if (!selectedJob) return;

    try {
      const res = await declineJob(selectedJob.id).unwrap();
      ShowMessage.success(
        res && res.message ? res.message : "Job declined successfully",
      );
      setDeclineModal(false);
      setSelectedJob(null);
    } catch (error: any) {
      ShowMessage.error(
        error && error.data && error.data.message
          ? error.data.message
          : "Failed to decline job",
      );
    }
  };

  const handleOrderPress = (order: any) => {
    router.push({
      pathname: "/(common)/OrderDetails",
      params: { id: String(order.id) },
    });
  };

  const renderJobs = () => {
    if (activeTab === "Available") {
      return (
        <>
          <Text className="mb-3 text-lg font-bold text-black">
            Available Jobs ({availableJobs.length})
          </Text>
          {isAvailableLoading && (
            <Text className="mb-3 text-gray-500">Loading jobs...</Text>
          )}
          {availableJobs.map((item) => (
            <JobCard
              key={item.id}
              item={item}
              driverEarningPercentage={Number(driverEarningPercentage)}
              showActions
              acceptDisabled={isAtCapacity}
              onAccept={() => {
                if (isAtCapacity) return;
                setSelectedJob(item);
                setAcceptModal(true);
              }}
              onDecline={() => {
                setSelectedJob(item);
                setDeclineModal(true);
              }}
            />
          ))}
        </>
      );
    }

    if (activeTab === "Active") {
      return (
        <>
          <Text className="mb-3 text-lg font-bold text-black">
            Active Jobs ({activeJobs.length})
          </Text>
          {isMyJobsLoading && (
            <Text className="mb-3 text-gray-500">Loading jobs...</Text>
          )}
          {activeJobs.map((item) => (
            // <JobCard
            //   key={item.id}
            //   item={item}
            //   driverEarningPercentage={Number(driverEarningPercentage)}
            //   onDetails={() =>
            //     router.push({
            //       pathname: "/(common)/OrderDetailsDriver",
            //       params: { id: item.id },
            //     })
            //   }
            // />

            <ActiveOrderCard
              key={item.id}
              order={item}
              router={router}
              getOrderProgress={getOrderProgress}
              getOrderStep={getOrderStep}
              getStatusStyle={getStatusStyle}
            />
          ))}
        </>
      );
    }
    return (
      <>
        <Text className="mb-3 text-lg font-bold">
          Completed ({completedJobs.length})
        </Text>
        {/* {completedJobs.map((order) => (
          <View
            key={order.id}
            className="mb-4 rounded-2xl border border-gray-200 bg-white p-4"
          >
            <View className="flex-row items-center justify-center">
              <View className="mb-1 ml-2 flex-1 justify-between">
                <Text className="font-semibold">
                  Order #{formatOrderNumber(order.id)}
                </Text>
                <Text className="mb-2 text-sm text-gray-500">
                  {order.quantity} bags
                </Text>
              </View>

              <View className="items-end justify-center">
                <Text className="text-lg font-bold text-green-600">
                  {order.price}
                </Text>
                <View className="flex-row items-center">
                  <RatingStars rating={5} />
                  <Text className="ml-1 text-sm">5.00</Text>
                </View>
              </View>
            </View>

            <View className="mt-3 h-[1px] w-full bg-gray-100" />
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="green"
                />
                <Text className="ml-1 text-sm text-green-600">
                  {formatStatus(order.status)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(common)/OrderDetailsDriver",
                    params: { id: order.id },
                  })
                }
                className="my-2"
              >
                <Text
                  style={{ color: Colors.primary }}
                  className="font-semibold"
                >
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))} */}
        <RecentOrdersList
          orders={completedJobs.map((job) => ({
            id: job.id,
            quantity: job.quantity,
            price: Number(job.price.replace("$", "")),
            rating: 5,
            status: formatStatus(job.status),
            date: job.time,
          }))}
          onOrderPress={handleOrderPress}
        />
      </>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View
        style={{ backgroundColor: Colors.primary }}
        className="rounded-b-[32px] px-5 pb-[60px] pt-14"
      >
        <Text className="text-[26px] font-bold text-white">Jobs</Text>
        <Text className="mt-1 text-sm text-blue-100">
          Manage your delivery jobs
        </Text>
      </View>

      {/* Tabs */}
      <View
        className="z-10 mx-4 -mt-8 flex-row rounded-2xl bg-white px-3 py-4"
        style={{
          elevation: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
        }}
      >
        {(["Available", "Active", "Completed"] as const).map((item) => (
          <TopTab
            key={item}
            label={item}
            // onPress={() => setActiveTab(item)}
            active={activeTab === item}
            onPress={() => router.setParams({ tab: item })}
          />
        ))}
      </View>

      {/* Content */}
      <ScrollView className="mt-6 px-4" showsVerticalScrollIndicator={false}>
        {renderJobs()}
        <View className="h-24" />
      </ScrollView>

      <Modal transparent visible={declineModal} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[90%] rounded-2xl bg-white p-8">
            <Text className="text-center text-[24px] font-bold">
              Are you sure Decline the Job?
            </Text>

            <View className="mt-6 flex-row gap-4">
              <TouchableOpacity
                onPress={() => setDeclineModal(false)}
                className="flex-1 rounded-xl border-[2px] border-red-500 py-3"
              >
                <Text className="text-center text-lg font-bold text-red-500">
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDecline}
                disabled={isDeclining}
                className="flex-1 rounded-xl bg-blue-500 py-3"
              >
                <Text className="text-center text-lg font-semibold text-white">
                  {isDeclining ? "Declining..." : "Yes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={acceptModal} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[90%] rounded-2xl bg-white p-8">
            <Text className="text-center text-[24px] font-bold">
              Are you sure Accept the Job?
            </Text>

            <View className="mt-6 flex-row gap-4">
              <TouchableOpacity
                onPress={() => setAcceptModal(false)}
                className="flex-1 rounded-xl border-[2px] border-red-500 py-3"
              >
                <Text className="text-center text-lg font-bold text-red-500">
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAccept}
                disabled={isAccepting || isAtCapacity}
                className={`flex-1 rounded-xl py-3 ${isAccepting || isAtCapacity ? "bg-blue-300" : "bg-blue-500"}`}
              >
                <Text className="text-center text-lg font-semibold text-white">
                  {isAccepting ? "Accepting..." : "Yes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
