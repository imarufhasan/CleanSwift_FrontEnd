import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import BaseContainer from "@/components/shared/BaseContainer";
import { GeneralText } from "@/components/shared/GeneralText";
import SvgIcon from "@/components/shared/svgIcon";
import VehicleDetailsIcon from "@/assets/images/auth/VehicleDetails.svg";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Upload } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface PickedFile {
  uri: string;
  name: string;
  mimeType: string | null | undefined;
  size: number | undefined;
}
const VehicleDetails = () => {
  const [vehicleMake, setvehicleMake] = useState("");
  const [vehicleModel, setvehicleModel] = useState("");
  const [vehicleYear, setvehicleYear] = useState("");
  const [licensePlateNo, setLicensePlateNo] = useState("");

  return (
    <BaseContainer backgroundColor="#E6F6FF" padding={0} margin={0}>
      <View className="flex-1 items-center ">
        <SvgIcon SvgComponent={VehicleDetailsIcon} />
      </View>
      <GeneralText
        title="Vehicle Details"
        description="Enter your vehicle information"
      />
      <View>
        <View className="bg-white rounded-2xl p-5 mx-4 shadow-sm border border-gray-100">
          <View>
            <View>
              <Text className="text-lg text-black font-medium">
                Vehicle Make
              </Text>
              <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
                <TextInput
                  value={vehicleMake}
                  onChangeText={(text) => setvehicleMake(text)}
                  placeholder="e.g., Toyota, Honda, Ford"
                  placeholderTextColor={"gray"}
                />
              </View>
            </View>

            <View>
              <Text className="text-lg text-black font-medium">
                Vehicle Model
              </Text>
              <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
                <TextInput
                  value={vehicleModel}
                  onChangeText={(text) => setvehicleModel(text)}
                  placeholder="e.g., Camry, Civic, F-150"
                  placeholderTextColor={"gray"}
                />
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-lg text-black font-medium">
                Vehicle Year
              </Text>
              <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
                <TextInput
                  value={vehicleYear}
                  onChangeText={(text) => setvehicleYear(text)}
                  placeholder="Enter policy number"
                  placeholderTextColor={"gray"}
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
                  onChangeText={(text) => setLicensePlateNo(text)}
                  placeholder="e.g., ABC1234"
                  placeholderTextColor={"gray"}
                  inputMode="numeric"
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
              <Text className="text-blue-500 text-sm mb-1">
                Adequate storage space for laundry bags
              </Text>
            </View>
          </View>
        </View>
      </View>
    </BaseContainer>
  );
};

export default VehicleDetails;
