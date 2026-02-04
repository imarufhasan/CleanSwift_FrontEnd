import React, { useState } from "react";
import { View, Button } from "react-native";
import DriverLicense from "./components/DriverLicense";
import SelfiePhoto from "./components/SelfiePhoto";
import CarInsurance from "./components/CarInsurance";
import VehicleDetails from "./components/VehicleDetails";
import Pagination from "@/components/shared/Pagination";
import BaseContainer from "@/components/shared/BaseContainer";

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

  return (
    <BaseContainer>
      <Pagination
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBackPress={previousStep} // Pass the onBackPress function
      />
      <View className="flex-1 justify-center items-center">
        {renderStep()}
        <Button title="Next" onPress={nextStep} />
      </View>
    </BaseContainer>
  );
};

export default DriverRegistration;
