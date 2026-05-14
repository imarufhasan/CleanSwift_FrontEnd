import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/color';
import RatingStars from '@/components/home/RatingStars';
import ShowMessage from '@/constants/toast';
import { useOrderSocket } from '@/src/hooks/useOrderSocket';
import {
  useAcceptJobMutation,
  useDeclineJobMutation,
  useGetAvailableJobsQuery,
  useGetMyDriverJobsQuery,
} from '@/src/services/driverApi';
import type { Order } from '@/src/services/orderApi';
import { useGetPricingQuery } from '@/src/services/pricingApi';

type JobTab = 'Available' | 'Active' | 'Completed';
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

const formatStatus = (status?: string) => (status ?? '').replaceAll('_', ' ');

const mapOrderToJob = (order: Order): JobCardData => ({
  id: order._id,
  address: order.address ?? 'Pickup address',
  time: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recently posted',
  price: `$${Number(order.total ?? 0).toFixed(2)}`,
  bags: `${order.bags} Bags`,
  distance: order.pickupType === 'ASAP' ? 'ASAP' : 'Scheduled',
  quantity: order.bags,
  status: order.status,
});

const TopTab = ({ label, active, onPress }: { label: JobTab; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-1 rounded-xl py-2"
    style={{ backgroundColor: active ? Colors.primary : 'transparent' }}
  >
    <Text className={`py-1 text-center text-base font-semibold ${active ? 'text-white' : 'text-gray-500'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

/* -------------------- Job Card -------------------- */
const JobCard = ({
  item,
  driverEarningPercentage,
  showActions,
  onAccept,
  onDecline,
  onDetails,
}: {
  item: JobCardData;
  driverEarningPercentage: number;
  showActions?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onDetails?: () => void;
}) => (
  <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
    {/* Header */}
    <View className="mb-2 flex-row items-start justify-between">
      <View className="flex-1 pr-3">
        <View className="flex-row items-center gap-2">
          <Text className="font-semibold text-black">Order #{item.id.slice(-6)}</Text>
          {showActions && (
            <Text className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">New</Text>
          )}
        </View>

        <View className="mt-1 flex-row items-center">
          <Feather name="map-pin" size={14} color="#6B7280" />
          <Text className="ml-1 flex-1 text-xs text-gray-500">{item.address}</Text>
        </View>

        <Text className="mt-1 text-xs text-gray-400">{item.time}</Text>
      </View>

      <View className="items-end">
        <Text className="text-lg font-bold text-green-600">{item.price}</Text>
        <Text className="text-xs text-gray-400">You earn {driverEarningPercentage}%</Text>
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
        <TouchableOpacity onPress={onDecline} className="flex-1 rounded-xl border border-red-400 py-2">
          <Text className="py-1 text-center text-lg font-medium text-red-500">Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onAccept} className="flex-1 rounded-xl bg-blue-500 py-2">
          <Text className="py-1 text-center text-lg font-medium text-white">Accept</Text>
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

export default function JobsScreen() {
  const { tab } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<JobTab>('Available');
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);
  const [acceptModal, setAcceptModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const {
    data: availableRes,
    isFetching: isAvailableLoading,
    refetch: refetchAvailableJobs,
  } = useGetAvailableJobsQuery();
  const { data: myJobsRes, isFetching: isMyJobsLoading, refetch: refetchMyJobs } = useGetMyDriverJobsQuery();
  const { data: pricingRes } = useGetPricingQuery();
  const [acceptJob, { isLoading: isAccepting }] = useAcceptJobMutation();
  const [declineJob, { isLoading: isDeclining }] = useDeclineJobMutation();
  const driverEarningPercentage = pricingRes?.data?.driverEarningPercentage ?? 70;

  const refreshJobs = useCallback(() => {
    refetchAvailableJobs();
    refetchMyJobs();
  }, [refetchAvailableJobs, refetchMyJobs]);

  useOrderSocket({
    role: 'DRIVER',
    onDriverJobsUpdate: refreshJobs,
  });

  const availableJobs = (availableRes?.data ?? []).map(mapOrderToJob);
  const myJobs = (myJobsRes?.data ?? []).map(mapOrderToJob);
  const activeJobs = myJobs.filter(job => !['DELIVERED', 'COMPLETED', 'CANCELED'].includes(job.status));
  const completedJobs = myJobs.filter(job => ['DELIVERED', 'COMPLETED'].includes(job.status));

  useEffect(() => {
    if (tab === 'Active') setActiveTab('Active');
    else if (tab === 'Completed') setActiveTab('Completed');
    else if (tab === 'Available') setActiveTab('Available');
  }, [tab]);

  const handleAccept = async () => {
    if (!selectedJob) return;

    try {
      const res = await acceptJob(selectedJob.id).unwrap();
      ShowMessage.success(res?.message ?? 'Job accepted successfully');
      setAcceptModal(false);
      setSelectedJob(null);
      router.setParams({ tab: 'Active' });
    } catch (error: any) {
      ShowMessage.error(error?.data?.message ?? 'Failed to accept job');
    }
  };

  const handleDecline = async () => {
    if (!selectedJob) return;

    try {
      const res = await declineJob(selectedJob.id).unwrap();
      ShowMessage.success(res?.message ?? 'Job declined successfully');
      setDeclineModal(false);
      setSelectedJob(null);
    } catch (error: any) {
      ShowMessage.error(error?.data?.message ?? 'Failed to decline job');
    }
  };

  const renderJobs = () => {
    if (activeTab === 'Available') {
      return (
        <>
          <Text className="mb-3 text-lg font-bold text-black">Available Jobs ({availableJobs.length})</Text>
          {isAvailableLoading && <Text className="mb-3 text-gray-500">Loading jobs...</Text>}
          {availableJobs.map(item => (
            <JobCard
              key={item.id}
              item={item}
              driverEarningPercentage={driverEarningPercentage}
              showActions
              onAccept={() => {
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

    if (activeTab === 'Active') {
      return (
        <>
          <Text className="mb-3 text-lg font-bold text-black">Active Jobs ({activeJobs.length})</Text>
          {isMyJobsLoading && <Text className="mb-3 text-gray-500">Loading jobs...</Text>}
          {activeJobs.map(item => (
            <JobCard
              key={item.id}
              item={item}
              driverEarningPercentage={driverEarningPercentage}
              onDetails={() =>
                router.push({
                  pathname: '/(common)/OrderDetailsDriver',
                  params: { id: item.id },
                })
              }
            />
          ))}
        </>
      );
    }

    return (
      <>
        <Text className="mb-3 text-lg font-bold">Completed ({completedJobs.length})</Text>
        {completedJobs.map(order => (
          <View key={order.id} className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">
            <View className="flex-row items-center justify-center">
              <View className="mb-1 ml-2 flex-1 justify-between">
                <Text className="font-semibold">Order #{order.id.slice(-6)}</Text>
                <Text className="mb-2 text-sm text-gray-500">{order.quantity} bags</Text>
              </View>

              <View className="items-end justify-center">
                <Text className="text-lg font-bold text-green-600">{order.price}</Text>
                <View className="flex-row items-center">
                  <RatingStars rating={5} />
                  <Text className="ml-1 text-sm">5.00</Text>
                </View>
              </View>
            </View>

            <View className="mt-3 h-[1px] w-full bg-gray-100" />
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle-outline" size={16} color="green" />
                <Text className="ml-1 text-sm text-green-600">{formatStatus(order.status)}</Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/(common)/OrderDetailsDriver',
                    params: { id: order.id },
                  })
                }
                className="my-2"
              >
                <Text style={{ color: Colors.primary }} className="font-semibold">
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </>
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary }} className="rounded-b-[32px] px-5 pb-[60px] pt-14">
        <Text className="text-[26px] font-bold text-white">Jobs</Text>
        <Text className="mt-1 text-sm text-blue-100">Manage your delivery jobs</Text>
      </View>

      {/* Tabs */}
      <View
        className="z-10 mx-4 -mt-8 flex-row rounded-2xl bg-white px-3 py-4"
        style={{
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
        }}
      >
        {(['Available', 'Active', 'Completed'] as const).map(item => (
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
            <Text className="text-center text-[24px] font-bold">Are you sure Decline the Job?</Text>

            <View className="mt-6 flex-row gap-4">
              <TouchableOpacity
                onPress={() => setDeclineModal(false)}
                className="flex-1 rounded-xl border-[2px] border-red-500 py-3"
              >
                <Text className="text-center text-lg font-bold text-red-500">No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDecline}
                disabled={isDeclining}
                className="flex-1 rounded-xl bg-blue-500 py-3"
              >
                <Text className="text-center text-lg font-semibold text-white">
                  {isDeclining ? 'Declining...' : 'Yes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={acceptModal} animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-[90%] rounded-2xl bg-white p-8">
            <Text className="text-center text-[24px] font-bold">Are you sure Accept the Job?</Text>

            <View className="mt-6 flex-row gap-4">
              <TouchableOpacity
                onPress={() => setAcceptModal(false)}
                className="flex-1 rounded-xl border-[2px] border-red-500 py-3"
              >
                <Text className="text-center text-lg font-bold text-red-500">No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAccept}
                disabled={isAccepting}
                className="flex-1 rounded-xl bg-blue-500 py-3"
              >
                <Text className="text-center text-lg font-semibold text-white">
                  {isAccepting ? 'Accepting...' : 'Yes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
