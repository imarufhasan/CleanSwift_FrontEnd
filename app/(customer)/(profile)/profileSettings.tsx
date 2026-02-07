import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/color";
import { SafeAreaView } from "react-native-safe-area-context";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { useRouter } from "expo-router";
import Toast from "@/constants/toast";

export default function ProfileSettings() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState<CountryCode>("PK");
  const [callingCode, setCallingCode] = useState("92");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("Ali Amin");

  const getPhonePlaceholder = (code: CountryCode) => {
    switch (code) {
      case "PK":
        return "301 1234567";
      case "IN":
        return "98765 43210";
      case "US":
        return "(201) 555-0123";
      case "GB":
        return "7400 123456";
      case "BD":
        return "01712 345678";
      default:
        return "Phone number";
    }
  };

  return (
    <SafeAreaView className="flex-1 mt-3 bg-white px-5">
      {/* Header */}
      <View className="flex-row items-center mb-8 relative">
        {/* Left Icon */}
        <TouchableOpacity onPress={() => router.back()} className="ml-4 bg-blue-100 p-2 rounded-full">
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
          <Image
            source={require("../../../assets/images/profile.png")}
            className="w-24 h-24 rounded-full"
          />
          <TouchableOpacity
            onPress={() => {}}
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
      <View className="mb-10">
        <Text className="text-sm text-gray-500 mb-2">Mobile Number</Text>

        <View className="flex-row items-center border border-blue-400 rounded-xl px-3 py-2">
          {/* Country Picker */}
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

          {/* Divider */}
          <View className="h-6 w-[1px] bg-gray-300 mx-2" />

          {/* Phone Input */}
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder={getPhonePlaceholder(countryCode)}
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            className="flex-1 text-base"
          />
        </View>

        {/* Preview */}
        <Text className="text-xs text-gray-400 mt-2">
          Full number: +{callingCode} {phone}
        </Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity onPress={() => Toast.show("profile saved")} className="bg-blue-500 py-4 rounded-xl mt-auto mb-10">
        <Text className="text-white text-center font-semibold text-lg">
          Save
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
