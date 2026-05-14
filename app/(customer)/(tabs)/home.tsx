import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/color';
import Toast from '@/constants/toast';
import { useFocusEffect, useRouter } from 'expo-router';
import RequestPickupModal from '@/components/home/RequestPickupModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import ShowMessage from '@/constants/toast';
import RequestPickupCard from '@/components/home/components/RequestPickupCard';
import HeaderSection from '@/components/home/components/HeaderSection';
import ActiveOrderCard from '@/components/home/components/ActiveOrderCard';
import RecentOrdersList from '@/components/home/components/RecentOrdersList';
import { useProfileInfoQuery } from '@/src/services/userApi';
import { useCreateOrderMutation, useGetMyOrdersQuery, type Order } from '@/src/services/orderApi';
import { useGetPricingQuery } from '@/src/services/pricingApi';
import { useOrderSocket } from '@/src/hooks/useOrderSocket';

const getOrderProgress = (status?: string) => {
  const steps = ['Requested', 'Picked Up', 'Washing', 'Delivery'];
  const indexByStatus: Record<string, number> = {
    REQUESTED: 0,
    DRIVER_ASSIGNED: 0,
    PICKED_UP: 1,
    WASHING_DRYING: 2,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 3,
    COMPLETED: 3,
  };
  const currentStep = indexByStatus[status ?? 'REQUESTED'] ?? 0;

  return {
    steps,
    currentStep,
    progress: Math.min(100, Math.max(15, (currentStep + 1) * 25)),
  };
};

const mapOrderToCard = (order: Order) => {
  const progress = getOrderProgress(order.status);

  return {
    id: order._id,
    status: order.status.replaceAll('_', ' '),
    quantity: order.bags,
    price: order.total,
    estimatedDelivery: order.scheduledPickupAt
      ? new Date(order.scheduledPickupAt).toLocaleString()
      : 'As soon as possible',
    ...progress,
  };
};

const mapOrderToRecent = (order: Order) => ({
  id: order._id,
  quantity: order.bags,
  price: order.total,
  rating: 5,
  status: order.status.replaceAll('_', ' '),
  date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
});

const parseAddress = (address?: string) => {
  const parts = (address ?? '')
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);

  return {
    title: 'Current Location',
    street: parts[0] ?? address ?? 'No address available',
    city: parts[1] ?? '',
    state: parts.slice(2).join(', ') ?? '',
  };
};

export default function HomeScreen() {
  const router = useRouter();
  const { data: profileInfo, error, isLoading, isFetching, refetch } = useProfileInfoQuery();
  const { data: ordersRes, isFetching: isOrdersFetching, refetch: refetchOrders } = useGetMyOrdersQuery();
  const { data: pricingRes } = useGetPricingQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  console.log('profileInfo api home: ', profileInfo?.data?.role);

  const [refreshing, setRefreshing] = useState(false);
  const [bottomModal, setBottomModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickupData, setPickupData] = useState({
    asap: true,
    date: null as Date | null,
    time: null as Date | null,
    bags: 1,
  });
  const orders = ordersRes?.data ?? [];
  const activeOrders = orders.filter(order => !['DELIVERED', 'COMPLETED', 'CANCELED'].includes(order.status));
  const completedOrders = orders.filter(order => ['DELIVERED', 'COMPLETED'].includes(order.status));
  const activeOrder = activeOrders[0] ? mapOrderToCard(activeOrders[0]) : null;
  const recentOrders = (completedOrders.length ? completedOrders : orders).slice(0, 5).map(mapOrderToRecent);
  const pricePerBag = pricingRes?.data?.pricePerBag ?? 0;
  const location = parseAddress(profileInfo?.data?.address);

  useOrderSocket({
    role: 'CUSTOMER',
    orderId: activeOrder?.id,
    onCustomerUpdate: refetchOrders,
  });

  useEffect(() => {
    if (!pickupData.asap && !pickupData.date) {
      setShowDatePicker(true);
    }
  }, [pickupData.asap]);

  // Refresh logic
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
      refetchOrders();
      ShowMessage.show('updated');
    }, 1500);
  }, [refetch, refetchOrders]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchOrders();
    }, [refetch, refetchOrders]),
  );

  const onDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setPickupData(prev => ({
        ...prev,
        date,
        asap: false,
      }));
    }
  };

  const onTimeChange = (_: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setPickupData(prev => ({
        ...prev,
        time,
        asap: false,
      }));
    }
  };

  const handleOrderPress = (order: any) => {
    console.log('Clicked order: ', order);
    router.push({
      pathname: '/(common)/OrderDetails',
      params: { id: String(order.id) },
    });
  };

  const handleCreateOrder = async (payload: {
    bags: number;
    pickupType: 'ASAP' | 'SCHEDULED';
    scheduledPickupAt?: string;
    specialInstructions?: string;
  }) => {
    try {
      const res = await createOrder({
        serviceType: 'WASH_DRY',
        pickupType: payload.pickupType,
        scheduledPickupAt: payload.scheduledPickupAt,
        bags: payload.bags,
        specialInstructions: payload.specialInstructions,
      }).unwrap();

      ShowMessage.success(res?.message ?? 'Pickup request confirmed');
      setBottomModal(false);
      setConfirmed(false);
      refetchOrders();
    } catch (error: any) {
      ShowMessage.error(error?.data?.message ?? 'Failed to create order');
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        className="flex-1 bg-white"
      >
        {/* Header Section */}
        <HeaderSection
          userName={profileInfo?.data?.name || 'User'}
          notificationCount={0}
          location={location}
          profileInfo={profileInfo}
        />

        {/* Request Pickup Card */}
        <RequestPickupCard onPressAdd={() => setBottomModal(true)} />

        {/* Active & Recent Orders */}
        <View className="px-5 mt-6">
          {activeOrder ? (
            <ActiveOrderCard data={activeOrder} />
          ) : (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-gray-100">
              <Text className="text-lg font-bold mb-1">Active Order</Text>
              <Text className="text-gray-500">
                {isOrdersFetching ? 'Loading orders...' : 'No active order'}
              </Text>
            </View>
          )}

          <RecentOrdersList orders={recentOrders} onOrderPress={handleOrderPress} />
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
        pricePerBag={pricePerBag}
        isSubmitting={isCreatingOrder}
        onConfirmRequest={handleCreateOrder}
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
        <DateTimePicker value={pickupData.time || new Date()} mode="time" onChange={onTimeChange} />
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
                  <Text className="text-red-500 text-[20px] text-center font-semibold">No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setConfirmed(false);
                    setBottomModal(false);
                    ShowMessage.show('Pickup request confirmed');
                  }}
                  className="flex-1 bg-green-500 rounded-2xl py-3"
                >
                  <Text className="text-white text-[20px] text-center font-semibold">Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
