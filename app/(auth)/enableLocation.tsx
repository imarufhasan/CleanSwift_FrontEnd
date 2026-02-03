import React, { useEffect, useState } from "react";
import { View, Dimensions, Alert, AppState } from "react-native";
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
import { Platform } from "react-native";

const EnableLocation: React.FC = () => {
  const { width } = Dimensions.get("window");
  const [buttonLabel, setButtonLabel] = useState("Give Permissions");

  const LOCATION_PERMISSION =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  // Check current permission status on mount and when app comes back to foreground
  useEffect(() => {
    const checkPermission = async () => {
      const result = await check(LOCATION_PERMISSION);
      if (result === RESULTS.GRANTED) {
        setButtonLabel("Permission Already Granted ✓");
        // navigate to next screen here if needed
      } else if (result === RESULTS.BLOCKED) {
        setButtonLabel("Open Settings");
      }
    };

    checkPermission();

    // Re-check when app comes back to foreground (e.g. after user enables it in Settings)
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
        openSettings();
        return;
      }

      if (currentStatus === RESULTS.GRANTED) {

        return;
      }
      const result = await request(LOCATION_PERMISSION);

      if (result === RESULTS.GRANTED) {
        console.log("Location permission granted");
      } else if (result === RESULTS.DENIED) {

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
    }
  };

  return (
    <BaseContainer>
      <View className="flex-1 justify-between items-center px-5 py-10">
        <View className="flex justify-center items-center mt-5">
          <SvgIcon
            SvgComponent={enableLocationSvg}
            width={width}
            height={width}
          />
        </View>

        <View className="flex-1 justify-center items-center mt-10 mb-10">
          <GeneralText
            title="Enable Location Permission"
            description="Allow location access to find nearby drivers and ensure accurate pickup and delivery for a smooth laundry experience"
          />
        </View>

        <View className="w-full">
          <Button label={buttonLabel} onPress={requestPermission} />
        </View>
      </View>
    </BaseContainer>
  );
};

export default EnableLocation;
