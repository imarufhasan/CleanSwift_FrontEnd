import React, { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/shared/Button";
import BaseContainer from "@/components/shared/BaseContainer";
import AuthText from "./components/AuthText";
import RoleContainer from "./components/RoleContainer";
import CustomerIcon from "@/assets/images/auth/Customer.svg";
import DriverIcon from "@/assets/images/auth/Driver.svg";
import { useRouter } from "expo-router";  // Import useRouter from expo-router

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState<"customer" | "driver">("customer");
  const router = useRouter();  // Get router instance

  const handleContinue = () => {
  
router.push("./driverRegistration")
    console.log("Proceeding as:", selectedRole); 
  };

  return (
    <BaseContainer>
      <View className="flex-1 justify-between py-10 px-5">
        <View>
          <AuthText
            title="How will you use our app?"
            subtitle="Select your role to get started"
          />

          <View className="mt-8">
            <RoleContainer
              variant="customer"
              title="I'm a Customer"
              description="Schedule pickups and track your laundry"
              isSelected={selectedRole === "customer"}
              onSelect={() => setSelectedRole("customer")}
              SvgComponent={CustomerIcon}
            />

            <RoleContainer
              variant="driver"
              title="I'm a Driver"
              description="Accept jobs and earn money"
              isSelected={selectedRole === "driver"}
              onSelect={() => setSelectedRole("driver")}
              SvgComponent={DriverIcon}
            />
          </View>
        </View>

        <Button
          label="Continue"
          onPress={handleContinue}  // Trigger navigation with router.push
        />
      </View>
    </BaseContainer>
  );
};

export default SelectRole;
