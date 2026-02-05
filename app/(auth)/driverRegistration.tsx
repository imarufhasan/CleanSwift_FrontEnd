import React, { useState } from "react";
import { View, Text } from "react-native";
import DriverLicense from "./components/DriverLicense";
import SelfiePhoto from "./components/SelfiePhoto";
import CarInsurance from "./components/CarInsurance";
import VehicleDetails from "./components/VehicleDetails";
import Pagination from "@/components/shared/Pagination";
import BaseContainer from "@/components/shared/BaseContainer";
import { Button } from "@/components/shared/Button";

const DriverRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  return (
    <BaseContainer padding={0} margin={0}>
      <View className="pb-6">
        <Pagination
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBackPress={previousStep}
        />
      </View>
      <View style={{}}>
        {renderStep()}
        <View
          style={{ marginHorizontal: 50 }}
          className="mt-20  items-center justify-center"
        >
          <Button
            label={isLastStep ? "Submit" : "Next"}
            onPress={isLastStep ? () => {} : nextStep}
            disabled={false}
          />
        </View>
      </View>
    </BaseContainer>
  );
};

export default DriverRegistration;
