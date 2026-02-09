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
import SelfiePhotoIcon from "@/assets/images/auth/SelfiePhoto.svg";
import UniversalFilePicker from "@/components/shared/UniversalFilePicker";
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
const CarInsurance = () => {
  const [selectedFile, setSelectedFile] = useState<PickedFile | null>(null);
  const [insuranceProver, setInsuranceProver] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  // const [expirationDate, setExpirationDate] = useState("mm/dd/yyyy");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleFileSelected = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          mimeType: file.mimeType ?? null,
          size: file.size,
        });
      }
    } catch (error) {
      console.log("Error selecting file:", error);
    }
  };

  const handleCameraPress = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      console.log("permission: ", permission);

      if (!permission.granted) {
        alert("Camera permission is required to take a photo");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const photo = result.assets[0];

        setSelectedFile({
          uri: photo.uri,
          name: `license_${Date.now()}.jpg`,
          mimeType: "image/jpeg",
          size: photo.fileSize,
        });
      }
    } catch (error) {
      console.log("Camera error:", error);
    }
  };

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <BaseContainer backgroundColor="#E6F6FF" padding={0} margin={0}>
      <View className="flex-1 items-center ">
        <SvgIcon SvgComponent={SelfiePhotoIcon} />
      </View>
      <GeneralText
        title="Car Insurance"
        description="Provide your car insurance informatin"
      />
      <View>
        <View className="bg-white rounded-2xl p-5 mx-4 shadow-sm border border-gray-100">
          <Text className="text-gray-800 text-lg font-semibold mb-2">
            Insurance Document Photo
          </Text>

          {!selectedFile && (
            <>
              <View className="items-center border border-gray-100 rounded-2xl py-4">
                <TouchableOpacity
                  onPress={handleFileSelected}
                  className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3"
                  activeOpacity={0.7}
                >
                  <SvgIcon
                    SvgComponent={Upload}
                    height={24}
                    width={24}
                  ></SvgIcon>
                </TouchableOpacity>

                <Text className="text-center text-gray-700 font-medium mb-1">
                  Tap to upload insurance document photo
                </Text>
                <TouchableOpacity
                  onPress={handleCameraPress}
                  activeOpacity={0.7}
                >
                  <Text className="text-center text-gray-500 text-base font-bold mt-2">
                    or use camera to take a photo
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <View className="mt-4">
                  <Text className="text-lg text-black font-medium">
                    Insurance Provider
                  </Text>
                  <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
                    <TextInput
                      value={insuranceProver}
                      onChangeText={(text) => setInsuranceProver(text)}
                      placeholder="e.g., State Farm Geico, Progressive"
                      placeholderTextColor={"gray"}
                    />
                  </View>
                </View>

                <View className="mt-4">
                  <Text className="text-lg text-black font-medium">
                    Policy Number
                  </Text>
                  <View className="bg-white border border-gray-200 rounded-2xl px-3 py-1 mt-2">
                    <TextInput
                      value={policyNumber}
                      onChangeText={(text) => setPolicyNumber(text)}
                      placeholder="Enter policy number"
                      placeholderTextColor={"gray"}
                      inputMode="numeric"
                    />
                  </View>
                </View>

                <View className="mt-4">
                  <Text className="text-lg text-black font-medium">
                    Expiration Date
                  </Text>

                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 mt-2"
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`${expirationDate ? "text-black" : "text-gray-400"}`}
                    >
                      {expirationDate
                        ? formatDate(expirationDate)
                        : "MM / DD / YYYY"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={expirationDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setExpirationDate(selectedDate);
                }
              }}
            />
          )}

          {selectedFile && (
            <View className="mt-4">
              <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
                <Text className="text-green-600 font-semibold mb-2">
                  ✓ Car Insurance photo Uploaded
                </Text>
                <Text className="text-green-600 text-sm" numberOfLines={1}>
                  {selectedFile.name}
                </Text>
              </View>

              {selectedFile.mimeType?.startsWith("image/") && (
                <Image
                  source={{ uri: selectedFile.uri }}
                  className="w-full h-48 rounded-xl"
                  resizeMode="cover"
                />
              )}

              <TouchableOpacity
                onPress={() => setSelectedFile(null)}
                className="mt-4 bg-gray-100 py-3 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-center text-gray-700 font-medium">
                  Change Document
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </BaseContainer>
  );
};

export default CarInsurance;
