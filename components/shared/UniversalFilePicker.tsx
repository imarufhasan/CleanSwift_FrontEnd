import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import SvgIcon from "./svgIcon";
import { Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

interface PickedFile {
  uri: string;
  name: string;
  mimeType: string | null | undefined;
  size: number | undefined;
}

const DriverLicenseCard = () => {
  const [selectedFile, setSelectedFile] = useState<PickedFile | null>(null);

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
      console.log('permission: ', permission);
      
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

  return (
    <View className="bg-white rounded-2xl p-5 mx-4 shadow-sm border border-gray-100">
      <Text className="text-gray-800 text-lg font-semibold mb-2">
        Driver's License
      </Text>

      {!selectedFile && (
        <>
          <View className="items-center border border-gray-100 rounded-2xl py-4">
            <TouchableOpacity
              onPress={handleFileSelected}
              className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3"
              activeOpacity={0.7}
            >
              <SvgIcon SvgComponent={Upload} height={24} width={24}></SvgIcon>
            </TouchableOpacity>

            <Text className="text-center text-gray-700 font-medium mb-1">
              Tap to upload driver's license
            </Text>
            <TouchableOpacity onPress={handleCameraPress} activeOpacity={0.7}>
              <Text className="text-center text-gray-500 text-base font-bold mt-2">
                or use camera to take a photo
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-blue-50 border-[2px] border-blue-300 rounded-2xl p-4 mt-6">
            <Text className="text-blue-500 font-semibold mb-2">
              📋 Requirements:
            </Text>
            <Text className="text-blue-500 text-sm mb-1">
              Clear photo showing all information
            </Text>
            <Text className="text-blue-500 text-sm mb-1">
              Valid and not expired
            </Text>
            <Text className="text-blue-500 text-sm">All corners visible</Text>
          </View>
        </>
      )}

      {selectedFile && (
        <View className="mt-4">
          <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
            <Text className="text-green-600 font-semibold mb-2">
              ✓ License Uploaded
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
  );
};

export default DriverLicenseCard;
