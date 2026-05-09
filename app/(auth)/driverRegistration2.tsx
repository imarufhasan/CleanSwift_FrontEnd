// ─── DriverRegistration.tsx ──────────────────────────────────────────────────

import React, { useState } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/shared/Button";
import SvgIcon from "../../components/shared/svgIcon";
import doneIcon from "@/assets/images/auth/done.svg";
import ShowMessage from "../../constants/toast";
import DriverLicense from "./components/DriverLicense";
import SelfiePhoto from "./components/SelfiePhoto";
import CarInsurance from "./components/CarInsurance";
import VehicleDetails from "./components/VehicleDetails";
import { DriverFormProvider, useDriverForm } from "./DriverRegistrationContext2";
import { useUpdateProfileMutation } from "@/src/services/userApi";

// ── Inner component has access to context ────────────────────────────────────
function DriverRegistrationInner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const totalSteps = 4;
  const router = useRouter();

  const { formData } = useDriverForm();

  // ✅ updateProfile mutation
  const [updateProfile, { isLoading: isSubmitting }] = useUpdateProfileMutation();

  const nextStep = () => setCurrentStep((s) => s + 1);
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    } else {
      router.back();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <DriverLicense />;
      case 2: return <SelfiePhoto />;
      case 3: return <CarInsurance />;
      case 4: return <VehicleDetails />;
      default: return <DriverLicense />;
    }
  };

  const isLastStep = currentStep === totalSteps;

  // ✅ Build FormData and call the API on final submit
  const submit = async () => {
    const {
      driverLicenseFile,
      selfieFile,
      insuranceFile,
      insuranceProvider,
      policyNumber,
      expirationDate,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      licensePlateNo,
    } = formData;

    // Basic validation
    if (!driverLicenseFile) {
      Alert.alert("Missing", "Please upload your driver's license photo.");
      return;
    }
    if (!selfieFile) {
      Alert.alert("Missing", "Please upload your selfie photo.");
      return;
    }
    if (!insuranceFile) {
      Alert.alert("Missing", "Please upload your car insurance document.");
      return;
    }
    if (!insuranceProvider || !policyNumber || !expirationDate) {
      Alert.alert("Missing", "Please fill in all insurance details.");
      return;
    }
    if (!vehicleMake || !vehicleModel || !vehicleYear || !licensePlateNo) {
      Alert.alert("Missing", "Please fill in all vehicle details.");
      return;
    }

    try {
      // ✅ Build the `data` JSON payload sent as FormData field "data"
      const profileData = {
        driverLicense: {
          insuranceProvider,
          policyNumber,
          expirationDate: expirationDate?.toISOString(),
        },
        vehicle: {
          make: vehicleMake,
          model: vehicleModel,
          year: vehicleYear,
          licensePlate: licensePlateNo,
        },
      };

      // ✅ Send the primary selfie as the `image` field (profile image)
      // Additional files (license, insurance) are appended in the mutation
      const response = await updateProfile({
        data: profileData,
        image: {
          uri: selfieFile.uri,
          type: selfieFile.type || "image/jpeg",
          name: selfieFile.name || "selfie.jpg",
        },
        // Pass extra files if your backend supports them
        // If your API slice needs extending, see note below
      }).unwrap();

      console.log("Driver profile update response:", response);
      ShowMessage.success(response?.message || "Profile updated successfully");
      setSuccessModalOpen(true);
    } catch (error: any) {
      console.log("Driver profile update error:", error);
      ShowMessage.error(
        error?.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-4">
        <Pagination
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBackPress={previousStep}
        />
      </View>

      {/* ✅ flex-1 so ScrollView doesn't push the button off screen */}
      <ScrollView className="flex-1">{renderStep()}</ScrollView>

      <View className="m-4">
        <Button
          label={isLastStep ? (isSubmitting ? "Submitting..." : "Submit") : "Continue"}
          onPress={() => {
            if (isLastStep) {
              submit();
            } else {
              nextStep();
            }
          }}
          disabled={isSubmitting}
          license={true}
        />
      </View>

      {/* ── Success Modal ── */}
      {successModalOpen && (
        <Modal
          transparent
          visible={successModalOpen}
          animationType="fade"
          onRequestClose={() => setSuccessModalOpen(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-8 w-[90%] items-center">
              <View className="mb-4">
                <SvgIcon SvgComponent={doneIcon} />
              </View>
              <Text className="text-black text-[32px] font-bold text-center">
                Account created successfully!
              </Text>
              <View className="flex-row items-center mt-6 w-full">
                <TouchableOpacity
                  onPress={() => {
                    setSuccessModalOpen(false);
                    router.push("/(auth)/login");
                  }}
                  className="flex-1 bg-green-500 rounded-2xl py-3"
                >
                  <Text className="text-white text-[20px] text-center font-semibold">
                    Back to Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// ── Wrap with provider so all child steps share state ────────────────────────
const DriverRegistration: React.FC = () => (
  <DriverFormProvider>
    <DriverRegistrationInner />
  </DriverFormProvider>
);

export default DriverRegistration;
