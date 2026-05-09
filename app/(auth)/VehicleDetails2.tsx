// ─── VehicleDetails.tsx ──────────────────────────────────────────────────────

import React from "react";
import { View, Text, TextInput } from "react-native";
import VehicleDetailsIcon from "@/assets/images/auth/VehicleDetails.svg";
import { useDriverForm } from "./DriverRegistrationContext2";
import BaseContainer from "@/components/shared/BaseContainer";
import SvgIcon from "@/components/shared/svgIcon";
import { GeneralText } from "@/components/shared/GeneralText";

const VehicleDetails = () => {
  const {
    formData,
    setVehicleMake,
    setVehicleModel,
    setVehicleYear,
    setLicensePlateNo,
  } = useDriverForm();

  const { vehicleMake, vehicleModel, vehicleYear, licensePlateNo } = formData;

  return (
    <BaseContainer backgroundColor="#E6F6FF" padding={0} margin={0}>
      <View className="flex-1 items-center">
        <SvgIcon SvgComponent={VehicleDetailsIcon} />
      </View>
      <GeneralText
        title="Vehicle Details"
        description="Enter your vehicle information"
      />

      <View className="bg-white rounded-2xl p-5 mx-4 shadow-sm border border-gray-100">
        <View>
          <Text className="text-lg text-black font-medium">Vehicle Make</Text>
          <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
            <TextInput
              value={vehicleMake}
              onChangeText={setVehicleMake}
              placeholder="e.g., Toyota, Honda, Ford"
              placeholderTextColor="gray"
            />
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-lg text-black font-medium">Vehicle Model</Text>
          <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
            <TextInput
              value={vehicleModel}
              onChangeText={setVehicleModel}
              placeholder="e.g., Camry, Civic, F-150"
              placeholderTextColor="gray"
            />
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-lg text-black font-medium">Vehicle Year</Text>
          <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
            <TextInput
              value={vehicleYear}
              onChangeText={setVehicleYear}
              placeholder="e.g., 2020"
              placeholderTextColor="gray"
              inputMode="numeric"
            />
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-lg text-black font-medium">
            License Plate Number
          </Text>
          <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
            <TextInput
              value={licensePlateNo}
              onChangeText={setLicensePlateNo}
              placeholder="e.g., ABC1234"
              placeholderTextColor="gray"
            />
          </View>
        </View>

        <View className="bg-blue-50 border-[2px] border-blue-300 rounded-2xl p-4 mt-6">
          <Text className="text-blue-500 font-semibold mb-2">
            📋 Vehicle Requirements:
          </Text>
          <Text className="text-blue-500 text-sm mb-1">
            Must be clean and well-maintained
          </Text>
          <Text className="text-blue-500 text-sm mb-1">
            Valid registration and insurance
          </Text>
          <Text className="text-blue-500 text-sm">
            Adequate storage space for laundry bags
          </Text>
        </View>
      </View>
    </BaseContainer>
  );
};

export default VehicleDetails;
