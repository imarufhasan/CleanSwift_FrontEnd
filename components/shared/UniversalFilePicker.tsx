import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import SvgIcon from "./svgIcon";
import { Upload } from "lucide-react-native";
interface PickedFile {
  uri: string;
  name: string;
  mimeType: string | null | undefined;
  size: number | undefined;
}

const DriverLicenseCard = () => {
  const [selectedFile, setSelectedFile] = useState<PickedFile | null>(null);

  // Handle the file selection from the document picker
  const handleFileSelected = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*", // Limit file selection to images
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

  // Handle opening the camera (use expo-image-picker for this)
  const handleCameraPress = () => {
    console.log("Open camera - implement with expo-image-picker");
  };

  return (
    <View className="bg-white rounded-2xl p-6 mx-4 my-2 shadow-sm border border-gray-100">
      {/* Header */}
      
      <Text className="text-gray-800 text-lg font-semibold mb-6">
        Driver's License
      </Text>

      {/* Initial State - Upload Section */}
      {!selectedFile && (
        <>
          {/* Upload Icon */}
          <View className="items-center mb-4">
            <TouchableOpacity
              onPress={handleFileSelected}
              className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-3"
              activeOpacity={0.7}
            >
              <SvgIcon SvgComponent={Upload} height={24} width={24}></SvgIcon>
            </TouchableOpacity>
          </View>

          {/* Upload Text */}
          <Text className="text-center text-gray-700 font-medium mb-1">
            Tap to upload driver's license
          </Text>
          <TouchableOpacity onPress={handleCameraPress} activeOpacity={0.7}>
            <Text className="text-center text-gray-500 text-sm">
              or use camera to take a photo
            </Text>
          </TouchableOpacity>

          {/* Requirements Box */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
            <Text className="text-blue-600 font-semibold mb-2">
              📋 Requirements:
            </Text>
            <Text className="text-blue-600 text-sm mb-1">
              Clear photo showing all information
            </Text>
            <Text className="text-blue-600 text-sm mb-1">
              Valid and not expired
            </Text>
            <Text className="text-blue-600 text-sm">All corners visible</Text>
          </View>
        </>
      )}

      {/* Selected File Preview State */}
      {selectedFile && (
        <View className="mt-4">
          {/* Success Message */}
          <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
            <Text className="text-green-600 font-semibold mb-2">
              ✓ License Uploaded
            </Text>
            <Text className="text-green-600 text-sm" numberOfLines={1}>
              {selectedFile.name}
            </Text>
          </View>

          {/* Preview Image */}
          {selectedFile.mimeType?.startsWith("image/") && (
            <Image
              source={{ uri: selectedFile.uri }}
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
          )}

          {/* Change Document Button */}
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
