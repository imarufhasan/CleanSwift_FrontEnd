import { ActivityIndicator, View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ExpoLocation from "expo-location";
import ShowMessage from "@/constants/toast";
import {
  useProfileInfoQuery,
  useUpdateAddressMutation,
} from "@/src/services/userApi";

export default function ChangeLocation() {
  const router = useRouter();
  const { data: profileInfo, refetch } = useProfileInfoQuery();
  const [updateAddress, { isLoading: isSaving }] = useUpdateAddressMutation();
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setAddress(profileInfo?.data?.address ?? "");
  }, [profileInfo?.data?.address]);

  const handleSave = async () => {
    const nextAddress = address.trim();

    if (!nextAddress) {
      ShowMessage.error("Address is required");
      return;
    }

    try {
      const res = await updateAddress({ address: nextAddress }).unwrap();
      await refetch();
      ShowMessage.show(res?.message || "Address updated");
      router.back();
    } catch (error: any) {
      ShowMessage.error(error?.data?.message || "Failed to update address");
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsLocating(true);
      const permission = await ExpoLocation.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        ShowMessage.error("Location permission required");
        return;
      }

      const position = await ExpoLocation.getCurrentPositionAsync({});
      const [place] = await ExpoLocation.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const formattedAddress = [
        place?.name,
        place?.street,
        place?.city,
        place?.region,
        place?.postalCode,
        place?.country,
      ]
        .filter(Boolean)
        .join(", ");

      if (!formattedAddress) {
        ShowMessage.error("Unable to detect address");
        return;
      }

      setAddress(formattedAddress);
    } catch (error) {
      ShowMessage.error("Unable to get current location");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      {/* Title */}

      <TouchableOpacity className="mt-5" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>
      <Text className="text-[28px] font-bold text-gray-900 mt-6 mb-2">
        Set Your Location
      </Text>

      {/* Description */}
      <Text className="text-sm text-gray-700 leading-5 mb-6">
        Update your pickup location directly from the map to get faster laundry
        service. This helps us match you with nearby drivers for quick and
        reliable pickup and delivery.
      </Text>

      {/* Input */}
      <Text className="text-[16px] text-black font-semibold mt-4 mb-2">
        Enter your address
      </Text>

      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        placeholderTextColor="#000"
        className="h-12 border bg-blue-100 border-blue-200 rounded-lg px-4 text-[15px] text-gray-900 mb-4"
      />

      {/* Use current location */}
      <TouchableOpacity
        onPress={handleUseCurrentLocation}
        disabled={isLocating || isSaving}
        className="h-12 flex-row border gap-2 border-blue-500 rounded-lg items-center justify-center mt-4 mb-6"
      >
        {isLocating ? (
          <ActivityIndicator color="#3B82F6" />
        ) : (
          <>
            <FontAwesome5 name="location-arrow" size={17} color="#3B82F6" />
            <Text className="text-blue-500 text-[16px] font-semibold">
              Use my current location
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Save button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={isSaving || isLocating}
        className="h-[50px] bg-blue-500 rounded-xl items-center justify-center mt-auto mb-4"
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-[18px] font-semibold">Save</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
