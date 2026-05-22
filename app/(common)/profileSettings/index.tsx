import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ShowMessage from "../../../constants/toast";
import { MobileNumberInput } from "@/components/shared/PhoneNumberField";
import {
  useProfileInfoQuery,
  useUpdateProfilePhotoMutation,
  useUpdateUserDataMutation,
} from "@/src/services/userApi";
import Colors from "@/constants/color";
import { PhoneNumberUtil } from "google-libphonenumber";
import AppLoader from "@/components/shared/AppLoader";

export default function ProfileSettings() {
  const router = useRouter();
  const [updateProfilePhoto, { isLoading: photoLoading }] =
    useUpdateProfilePhotoMutation();

  const {
    data: profileInfo,
    error,
    isLoading,
    refetch,
  } = useProfileInfoQuery();
  // const [mobileNumber, setMobileNumber] = useState("");
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [imageLoading, setImageLoading] = useState(false);
  const [country, setCountry] = useState("US");
  const phoneUtil = PhoneNumberUtil.getInstance();
  const [countryName, setCountryName] = useState("");

  const [updateUserData, { isLoading: updateLoading }] =
    useUpdateUserDataMutation();
  const [countryCode, setCountryCode] = useState("+1");
  const [fullName, setFullName] = useState(profileInfo?.data?.name || "");
  const [mobileNumber, setMobileNumber] = useState(
    profileInfo?.data?.phone || "",
  );

  const [address, setAddress] = useState(profileInfo?.data?.address || "");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (profileInfo?.data) {
      setFullName(profileInfo?.data?.name || "");
      setMobileNumber(profileInfo?.data?.phone || "");
      setAddress(profileInfo?.data?.address || "");
    }
  }, [profileInfo]);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        ShowMessage.error("Gallery permission required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled) return;

      const image = result.assets[0];

      const formData = new FormData();

      formData.append("user", {
        uri: image.uri,
        name: image.fileName || "profile.jpg",
        type: image.mimeType || "image/jpeg",
      } as any);

      const res = await updateProfilePhoto(formData).unwrap();
      if (res?.success) {
        console.log("upload response:", res);
        setImageVersion(Date.now());
        ShowMessage.show("Profile photo updated");
        await refetch();
      } else {
        console.log("upload failed response:", res);
        ShowMessage.error(res?.message || "Failed to update photo");
      }
    } catch (error) {
      console.log("PHOTO UPDATE ERROR:", error);
      ShowMessage.error("Failed to update photo");
    }
  };

  const validatePhone = (phone: string, country: string) => {
    try {
      const number = phoneUtil.parse(phone, country);

      const isValid = phoneUtil.isValidNumberForRegion(number, country);
      const regionMatch = phoneUtil.getRegionCodeForNumber(number) === country;

      console.log("isValid:", isValid, "regionMatch:", regionMatch);

      return isValid && regionMatch;
    } catch (err) {
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!fullName.trim()) {
        ShowMessage.error("Full name is required");
        return;
      }

      if (!validatePhone(mobileNumber, country)) {
        ShowMessage.error("Enter a valid phone number!");
        return;
      }

      if (!validatePhoneNumber()) return;
      const fullPhoneNumber = `${mobileNumber}`;

      const body = {
        name: fullName.trim(),
        address: address.trim(),
        phone: fullPhoneNumber,
      };

      console.log("UPDATE BODY:", body);

      const res = await updateUserData(body).unwrap();
      if (res?.success) {
        console.log("UPDATE RESPONSE:", res);
        await refetch();
        ShowMessage.show(res?.message || "Profile updated");
        router.back();
      } else {
        console.log("UPDATE FAILED RESPONSE:", res);
        ShowMessage.error(res?.message || "Failed to update profile");
      }
    } catch (error) {
      console.log("UPDATE ERROR:", error);
      ShowMessage.error("Failed to update profile");
    }
  };

  const validatePhoneNumber = () => {
    const cleaned = mobileNumber.replace(/\s/g, "");

    // Empty check
    if (!cleaned) {
      ShowMessage.error("Phone number is required");
      return false;
    }

    // Only numbers
    if (!/^\d+$/.test(cleaned)) {
      ShowMessage.error("Phone number must contain only numbers");
      return false;
    }

    // Length check
    if (cleaned?.length < 7 || cleaned?.length > 15) {
      ShowMessage.error("Invalid phone number length");
      return false;
    }

    return true;
  };

  return (
    <SafeAreaView className="flex-1 mt-3 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="flex-row items-center mb-8 relative px-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-blue-100 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View className="absolute left-0 right-0 items-center">
            <Text className="text-[24px] font-semibold">Profile Setting</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 220,
          }}
        >
          {/* Profile Image */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={pickImage}
            className="items-center mb-10"
            disabled={photoLoading}
          >
            <View className="relative w-24 h-24">
              {imageLoading && (
                <View className="absolute inset-0 items-center justify-center z-10">
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              )}

              <Image
                source={
                  profileInfo?.data?.image
                    ? {
                        uri: `${profileInfo?.data?.image}?v=${imageVersion}`,
                      }
                    : require("../../../assets/images/profile.png")
                }
                className="w-24 h-24 rounded-full"
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />

              <View className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                <Ionicons name="camera" size={22} color={Colors.primary} />
              </View>
            </View>
          </TouchableOpacity>

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

          {/* Address */}
          <View className="mb-5">
            <Text className="text-sm text-gray-500 mb-2">Address</Text>

            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="border border-blue-400 rounded-xl px-4 py-3 text-base min-h-[100px]"
            />
          </View>

          {/* Phone */}
          {/* <MobileNumberInput
            label="Phone Number"
            placeholder="123456789"
            value={mobileNumber}
             country={country}
            onChangeText={setMobileNumber}
            setCountryCode={setCountryCode}
          /> */}

          <MobileNumberInput
            label="Phone Number"
            placeholder="123456789"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            setCountryCode={setCountryCode}
            country={country}
            setCountry={setCountry}
            setCountryName={setCountryName}
          />
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View className="px-5 pb-8 pt-3 bg-white">
          <TouchableOpacity
            onPress={handleUpdateProfile}
            disabled={updateLoading}
            className="bg-blue-500 py-4 rounded-xl items-center justify-center"
          >
            {updateLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Update Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <AppLoader visible={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
