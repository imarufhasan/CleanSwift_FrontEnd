import React, { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/shared/Button";
import BaseContainer from "@/components/shared/BaseContainer";
import CustomerIcon from "@/assets/images/auth/Customer.svg";
import DriverIcon from "@/assets/images/auth/Driver.svg";
import { useRouter } from "expo-router"; // Import useRouter from expo-router
import { SafeAreaView } from "react-native-safe-area-context";
import AuthText from "../components/AuthText";
import RoleContainer from "../components/RoleContainer";

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState<"customer" | "driver">(
    "customer",
  );
  const router = useRouter(); // Get router instance

  const handleContinue = () => {
    //
    console.log("Proceeding as:", selectedRole);
    if (selectedRole === "driver") {
      router.push("./driverRegistration");
    } else {
      router.push("/(auth)/enableLocation");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <View className="flex-1">
        <AuthText
          title="How will you use our app?"
          subtitle="Select your role to get started"
        />

        <View className="mt-[50px] space-y-4">
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

      <View className="mb-4">
        <Button label="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
};

export default SelectRole;
