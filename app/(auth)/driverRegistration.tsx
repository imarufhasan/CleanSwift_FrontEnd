import React, { useState } from "react";
import { View, Text, ScrollView, Modal, TouchableOpacity } from "react-native";
import Pagination from "../../components/shared/Pagination";
import { Button } from "../../components/shared/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import SvgIcon from "../../components/shared/svgIcon";
import doneIcon from "@/assets/images/auth/done.svg";
import DriverLicense from "./components/DriverLicense";
import SelfiePhoto from "./components/SelfiePhoto";
import CarInsurance from "./components/CarInsurance";
import VehicleDetails from "./components/VehicleDetails";

const DriverRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const totalSteps = 4;
  const router = useRouter();

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 1) {
      router.back();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <DriverLicense />;
      case 2:
        return <SelfiePhoto />;
      case 3:
        return <CarInsurance />;
      case 4:
        return <VehicleDetails />;
      default:
        return <DriverLicense />;
    }
  };

  const isLastStep = currentStep === totalSteps;

  const submit = () => {
    console.log("submit");

    setSuccessModalOpen(true);
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

      <ScrollView>{renderStep()}</ScrollView>
      <View className="m-4">
        <Button
          label={isLastStep ? "Submit" : "Continue"}
          // onPress={isLastStep ? () => submit : nextStep}
          onPress={() => {
            if (isLastStep) {
              submit();
            } else {
              nextStep();
            }
          }}
          disabled={false}
          license={true}
        />
      </View>

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
};

export default DriverRegistration;
