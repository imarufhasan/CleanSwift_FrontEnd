import React, { useEffect, useState } from "react";
import { View, Alert, AppState, Platform } from "react-native";
import BaseContainer from "@/components/shared/BaseContainer";
import { Button } from "@/components/shared/Button";
import { GeneralText } from "@/components/shared/GeneralText";
import SvgIcon from "@/components/shared/svgIcon";
import enableLocationSvg from "@/assets/images/auth/enable-location.svg";
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserRole, useUserInfo } from "@/src/core/store/userInfo";
import { useProfileInfoQuery } from "@/src/services/authApi";
import SelectRole from "./selectRole";
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY, REFRESH_KEY } from "@/src/services/storage/tokenStorage";

const EnableLocation: React.FC = () => {
  const router = useRouter();
  const role = useUserInfo((state) => state.role);
  const token = useUserInfo((state) => state.accessToken);
  const [roleData, setRoleData] = useState("");
  const [tokenData, setTokenData] = useState("");
  const setRole = useUserInfo((state) => state.setRole);

  const { data: profileInfo, error, isLoading } = useProfileInfoQuery();

  const { width } = Dimensions.get("window");
  const { height } = Dimensions.get("window");
  const [buttonLabel, setButtonLabel] = useState("Give Permissions");

  // FIXED: Platform check was reversed!
  const LOCATION_PERMISSION =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  useEffect(() => {

    const getRoleAndToken = async () => {
      const role = await SecureStore.getItemAsync(ACCESS_KEY);
      const token = await SecureStore.getItemAsync(REFRESH_KEY);
      setRoleData(role as string);
      setTokenData(token as string);
    }
    const checkPermission = async () => {
      const result = await check(LOCATION_PERMISSION);
      if (result === RESULTS.GRANTED) {
        setButtonLabel("Permission Already Granted ✓");
        // setTimeout(() => {
        //   router.replace("/(tabs)/home");
        // }, 300);
      } else if (result === RESULTS.BLOCKED) {
        setButtonLabel("Open Settings");
      } else {
        setButtonLabel("Give Permissions");
      }
    };

    checkPermission();

    getRoleAndToken();

    // Re-check when app comes back to foreground
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkPermission();
      }
    });

    return () => subscription.remove();
  }, []);

  const requestPermission = async () => {
    try {
      const currentStatus = await check(LOCATION_PERMISSION);

      if (currentStatus === RESULTS.BLOCKED) {
        Alert.alert(
          "Permission Blocked",
          "Location access has been permanently denied. Please enable it manually in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openSettings() },
          ],
        );
        return;
      }

      if (currentStatus === RESULTS.GRANTED) {

        console.log("role local: ", role);
        //console.log("token local: ", token);
        
        
        //console.log("profile user role: ", profileInfo);

        if (role === "CUSTOMER") {
          setRole("CUSTOMER");
          router.push("/(customer)/(tabs)/home");
        }
        if (role === "DRIVER") {
          setRole("DRIVER");
          router.push("/(driver)/(tabs)/home");
        }
        return;
      }

      const result = await request(LOCATION_PERMISSION);

      if (result === RESULTS.GRANTED) {
        setButtonLabel("Permission Already Granted ✓");
      } else if (result === RESULTS.DENIED) {
        setButtonLabel("Give Permissions");
        Alert.alert(
          "Permission Denied",
          "Location permission is required. Please tap the button again to grant it.",
        );
      } else if (result === RESULTS.BLOCKED) {
        setButtonLabel("Open Settings");
        Alert.alert(
          "Permission Blocked",
          "Location access has been permanently denied. Please enable it manually in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => openSettings() },
          ],
        );
      }
    } catch (error) {
      console.error("Permission request failed", error);
      Alert.alert("Error", "Failed to request location permission");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      {/* Center content */}
      <View className="flex-1 justify-center items-center">
        <SvgIcon
          SvgComponent={enableLocationSvg}
          width={width}
          height={width * 0.6}
        />

        <View className="mt-6">
          <GeneralText
            title="Enable Location Permission"
            description="Allow location access to find nearby drivers and ensure accurate pickup and delivery for a smooth laundry experience"
          />
        </View>
      </View>

      {/* Bottom button */}
      <View className="pb-6">
        <Button label={buttonLabel} onPress={requestPermission} />
      </View>
    </SafeAreaView>
  );
};

export default EnableLocation;
