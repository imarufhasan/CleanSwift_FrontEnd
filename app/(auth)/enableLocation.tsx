import React, { useEffect, useState } from "react";
import { View, Alert, AppState, Platform } from "react-native";
import BaseContainer from "@/components/shared/BaseContainer";
import { Button } from "@/components/shared/Button";
import { GeneralText } from "@/components/shared/Text";
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

const EnableLocation: React.FC = () => {
  const router = useRouter();

  const { width } = Dimensions.get("window");
  const { height } = Dimensions.get("window");
  const [buttonLabel, setButtonLabel] = useState("Give Permissions");

  // FIXED: Platform check was reversed!
  const LOCATION_PERMISSION =
    Platform.OS === "android"
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

  // Check current permission status on mount and when app comes back to foreground
  useEffect(() => {
    const checkPermission = async () => {
      const result = await check(LOCATION_PERMISSION);
      if (result === RESULTS.GRANTED) {
        setButtonLabel("Permission Already Granted ✓");
        setTimeout(() => {
          router.replace("./HomeScreen");
        }, 300);
      } else if (result === RESULTS.BLOCKED) {
        setButtonLabel("Open Settings");
      } else {
        setButtonLabel("Give Permissions");
      }
    };

    checkPermission();

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
        router.push("./HomeScreen");
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
    <BaseContainer>
      <View className="flex-1 justify-center items-center px-5 py-10 h-full">
        {/* Location Icon */}
        <View className="justify-center items-center mb-8">
          <SvgIcon
            SvgComponent={enableLocationSvg}
            width={width} // 60% of screen width for better sizing
            height={width * 0.6}
          />
        </View>

        {/* Title and Description */}
        <GeneralText
          title="Enable Location Permission"
          description="Allow location access to find nearby drivers and ensure accurate pickup and delivery for a smooth laundry experience"
        />

        {/* Button */}
        <Button label={buttonLabel} onPress={requestPermission} />
      </View>
    </BaseContainer>
  );
};

export default EnableLocation;
