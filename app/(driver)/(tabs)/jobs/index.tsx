import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import RatingStars from "@/components/home/RatingStars";
import ShowMessage from "@/constants/toast";
import { useRouter } from "expo-router";

const JOBS = {
  Available: [
    {
      id: "1251",
      address: "123 Elm St",
      time: "Posted 2 mins ago",
      price: "$45",
      bags: "1 Bags",
      distance: "1.2 mi",
    },
    {
      id: "1250",
      address: "789 Pine Rd",
      time: "Posted 30 mins ago",
      price: "$90",
      bags: "2 Bags",
      distance: "2.2 mi",
    },
  ],
  Active: [
    {
      id: "1248",
      address: "456 Oak Ave",
      time: "Pickup in progress",
      price: "$60",
      bags: "1 Bags",
      distance: "3.1 mi",
    },
  ],
  Completed: [
    {
      id: "1240",
      address: "902 Maple St",
      time: "Completed today",
      price: "$75",
      bags: "3 Bags",
      distance: "1.8 mi",
    },
  ],
  data: {
    user: {
      name: "Ali Amin",
    },

    location: {
      title: "Current Location",
      street: "123 Main Street, Apt 4B",
      city: "San Francisco",
      state: "CA 94102",
    },

    activeOrder: {
      id: 1248,
      status: "Washing",
      quantity: 2,
      price: 90,
      progress: 50,
      estimatedDelivery: "Today, 6:00 PM",
      steps: ["Picked Up", "Washing", "Delivery"],
      currentStep: 1,
    },

    recentOrders: [
      {
        id: 1247,
        quantity: 1,
        price: 45,
        rating: 5.0,
        status: "Delivered",
        date: "Jan 24, 2026",
      },
      {
        id: 1246,
        quantity: 2,
        price: 80,
        rating: 4.8,
        status: "Delivered",
        date: "Jan 18, 2026",
      },
      {
        id: 1248,
        quantity: 2,
        price: 90,
        rating: 5.0,
        status: "Delivered",
        date: "Today",
      },
    ],
  },
};

const TopTab = ({
  label,
  active,
  onPress,
}: {
  label: "Available" | "Active" | "Completed";
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 py-2 rounded-xl ${
      active ? "bg-blue-500" : "bg-transparent"
    }`}
  >
    <Text
      className={`text-center py-1 text-sm font-medium ${
        active ? "text-white" : "text-gray-500"
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* -------------------- Job Card -------------------- */
const JobCard = ({
  item,
  showActions,
  onAccept,
  onDecline,
}: {
  item: any;
  showActions?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}) => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <View className="flex-row items-center gap-2">
            <Text className="font-semibold text-black">Order #{item.id}</Text>
            {showActions && (
              <Text className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                New
              </Text>
            )}
          </View>

          <View className="flex-row items-center mt-1">
            <Feather name="map-pin" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-500 ml-1">{item.address}</Text>
          </View>

          <Text className="text-xs text-gray-400 mt-1">{item.time}</Text>
        </View>

        <View className="items-end">
          <Text className="text-green-600 font-bold text-lg">{item.price}</Text>
          <Text className="text-xs text-gray-400">You earn 70%</Text>
        </View>
      </View>

      {/* Info */}
      <View className="flex-row bg-gray-50 rounded-xl p-3 mt-2">
        <View className="flex-1">
          <Text className="text-xs text-gray-400">Bags</Text>
          <Text className="font-semibold text-black">{item.bags}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-xs text-gray-400">Distance</Text>
          <Text className="font-semibold text-black">{item.distance}</Text>
        </View>
      </View>

      {/* Actions */}
      {showActions && (
        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            onPress={onDecline}
            className="flex-1 border border-blue-400 py-2 rounded-xl"
          >
            <Text className="text-center text-blue-500 font-medium">
              Decline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onAccept}
            className="flex-1 bg-blue-500 py-2 rounded-xl"
          >
            <Text className="text-center text-white font-medium">Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const AvailableScreen = ({ setAcceptModal, setDeclineModal }: any) => (
  <>
    <Text className="text-lg font-bold text-black mb-3">
      Available Jobs ({JOBS.Available.length})
    </Text>

    {JOBS.Available.map((item) => (
      <JobCard
        key={item.id}
        item={item}
        showActions
        onAccept={() => setAcceptModal(true)}
        onDecline={() => setDeclineModal(true)}
      />
    ))}
  </>
);

const ActiveScreen = () => {
  const router = useRouter();
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
  return (
    <>
      <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-safe">
            <View
              className="w-9 h-9 rounded-full justify-center items-center"
              style={{ backgroundColor: "rgba(37, 99, 235, 0.2)" }}
            >
              <Ionicons name="cube-outline" size={20} color={Colors.primary} />
            </View>

            <View className="ml-2">
              <Text className="font-semibold">
                Order #{JOBS.data.activeOrder.id}
              </Text>
              <Text className="text-sm text-gray-500 mb-3">
                {JOBS.data.activeOrder.quantity} bags • $
                {JOBS.data.activeOrder.price}
                .00
              </Text>
            </View>
          </View>

          <Text
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
              JOBS.data.activeOrder.status,
            )}`}
          >
            In Progress
          </Text>
        </View>

        {/* Steps */}
        <View className="flex-row justify-between mb-2">
          {JOBS.data.activeOrder.steps.map((step, index) => (
            <Text
              key={step}
              className={`text-xs ${
                index <= JOBS.data.activeOrder.currentStep
                  ? "text-blue-500"
                  : "text-gray-400"
              }`}
            >
              {step}
            </Text>
          ))}
        </View>

        {/* Progress Bar */}
        <View className="h-2 bg-gray-200 rounded-full mb-3">
          <View
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${JOBS.data.activeOrder.progress}%` }}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-gray-500">
            Estimated delivery: {JOBS.data.activeOrder.estimatedDelivery}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/LiveTrackingScreen")}
            className="flex-row gap-3 items-center"
          >
            <Text
              style={{ color: Colors.primary }}
              className="text-[14px] font-bold"
            >
              Track Live
            </Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const CompletedScreen = () => {
  const router = useRouter();
  return (
    <View>
      <Text className="text-lg font-bold mb-3">
        Completed Today ({JOBS.data.recentOrders.length})
      </Text>

      {JOBS.data.recentOrders.map((order) => (
        <TouchableOpacity
          key={order.id}
          className="bg-white flex-row items-safe justify-center rounded-2xl p-4 mb-4 border border-gray-100"
        >
          <View className="justify-between flex-1 mb-1 ml-2">
            <Text className="font-semibold">Order #{order.id}</Text>
            <Text className="text-sm text-gray-500 mb-2">
              {order.quantity} bags
            </Text>
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="green"
              />
              <Text className="ml-1 text-green-600 text-sm">{order.date}</Text>
            </View>
          </View>

          <View className="items-end justify-center">
            <Text className="text-green-600 text-lg font-bold">
              $ {order.price}
            </Text>
            <View className="flex-row items-center">
              <RatingStars rating={order.rating} />
              <Text className="ml-1 text-sm">{order.rating.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                console.log("recet_item: ", order);
                router.push("/(common)/OrderDetails");
              }}
              className="my-2"
            >
              <Text style={{ color: Colors.primary }} className="font-semibold">
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/* -------------------- Main Screen -------------------- */
export default function JobsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "Available" | "Active" | "Completed"
  >("Available");

  const [acceptModal, setAcceptModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-blue-500 px-5 pt-14 pb-12 rounded-b-[32px]">
        <Text className="text-white text-2xl font-bold">Jobs</Text>

        <Text className="text-blue-100 text-sm mt-1">
          Manage your delivery jobs
        </Text>
      </View>

      {/* Tabs */}
      <View
        className="mx-4 -mt-8 z-10 bg-white rounded-2xl flex-row px-3 py-4"
        style={{
          elevation: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
        }}
      >
        <TopTab
          label="Available"
          active={activeTab === "Available"}
          onPress={() => setActiveTab("Available")}
        />
        <TopTab
          label="Active"
          active={activeTab === "Active"}
          onPress={() => setActiveTab("Active")}
        />
        <TopTab
          label="Completed"
          active={activeTab === "Completed"}
          onPress={() => setActiveTab("Completed")}
        />
      </View>

      {/* Content */}
      <ScrollView className="px-4 mt-6" showsVerticalScrollIndicator={false}>
        {activeTab === "Available" && (
          <AvailableScreen
            setAcceptModal={setAcceptModal}
            setDeclineModal={setDeclineModal}
          />
        )}
        {activeTab === "Active" && <ActiveScreen />}
        {activeTab === "Completed" && <CompletedScreen />}

        <View className="h-24" />
      </ScrollView>

      <Modal transparent visible={declineModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-[90%]">
            <Text className="text-[24px] font-bold text-center">
              Are you sure Decline the Job?
            </Text>

            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={() => setDeclineModal(false)}
                className="flex-1 border-[2px] border-red-500 rounded-xl py-3"
              >
                <Text className="text-center text-red-500 font-bold">No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setDeclineModal(false);
                  ShowMessage.show("Job Decline successfully");
                }}
                className="flex-1 bg-blue-500 rounded-xl py-3"
              >
                <Text className="text-white text-center font-semibold">
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={acceptModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-[90%]">
            <Text className="text-[24px] font-bold text-center">
              Are you sure Accept the Job?
            </Text>

            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={() => setAcceptModal(false)}
                className="flex-1 border-[2px] border-red-500 rounded-xl py-3"
              >
                <Text className="text-center text-red-500 font-bold">No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setAcceptModal(false);
                  ShowMessage.show("Job accepted successfully");
                }}
                className="flex-1 bg-blue-500 rounded-xl py-3"
              >
                <Text className="text-white text-center font-semibold">
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
