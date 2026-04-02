import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ShowMessage from "../../../constants/toast";
import { MobileNumberInput } from "@/components/shared/PhoneNumberField";

export default function ProfileSettings() {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState("");
  const [fullName, setFullName] = useState("Ali Amin");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      ShowMessage.show("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 mt-3 bg-white px-5">
      {/* Header */}
      <View className="flex-row items-center mb-8 relative">
        {/* Left Icon */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-100 p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Center Title */}
        <View className="absolute left-0 right-0 items-center">
          <Text className="text-[24px] font-semibold">Profile Setting</Text>
        </View>
      </View>

      {/* Profile Image */}
      <View className="items-center mb-10">
        <View className="relative">
          {/* <Image
            source={require("../../../assets/images/profile.png")}
            className="w-24 h-24 rounded-full"
          /> */}
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../../assets/images/profile.png")
            }
            className="w-24 h-24 rounded-full"
          />

          <TouchableOpacity
            onPress={pickImage}
            className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
          >
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Name */}
      <View className="mb-5">
        <Text className="text-sm text-gray-500 mb-2">Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          className="border border-blue-400 rounded-xl px-4 py-3 text-base"
        />
      </View>

      {/* Mobile Number */}

      {/* Mobile Number */}
      {/* <View className="mb-10">
        <Text className="text-sm text-gray-500 mb-2">Mobile Number</Text>

        <View className="flex-row items-center border border-blue-400 rounded-xl px-3 py-2">
          <CountryPicker
            countryCode={countryCode}
            withFlag
            withCallingCode
            withFilter
            withCallingCodeButton
            onSelect={(country: Country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
          />

          <View className="h-6 w-[1px] bg-gray-300 mx-2" />

          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder={getPhonePlaceholder(countryCode)}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            className="flex-1 text-base"
          />
        </View>
      </View> */}
      <MobileNumberInput
              label="Phone Number"
              placeholder="123456789"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />

      {/* Save Button */}
      <TouchableOpacity
        onPress={() => ShowMessage.show("profile saved")}
        className="bg-blue-500 py-4 rounded-xl mt-auto mb-10"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Save
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
