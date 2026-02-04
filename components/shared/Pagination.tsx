import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SvgIcon from "./svgIcon"; // Import your SvgIcon component
import backIcon from "@/assets/images/arrow-left.svg";

interface PaginationProps {
  currentStep: number;
  totalSteps: number;
  onBackPress?: () => void; // Make onBackPress optional
}

const Pagination: React.FC<PaginationProps> = ({
  currentStep,
  totalSteps,
  onBackPress,
}) => {
  return (
    <View className="w-full px-4 pt-2 bg-white">
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-5">
        {onBackPress && ( // Only render the Back button if onBackPress is passed
          <TouchableOpacity
            onPress={onBackPress} // Back button functionality
            className="flex-row items-center"
          >
            {/* Use SvgIcon to display the BackIcon */}
            <SvgIcon SvgComponent={backIcon} width={20} height={20} />
            <Text className="text-[18px] font-bold text-black ml-2">Back</Text>
          </TouchableOpacity>
        )}

        <Text className="text-[13px] text-gray-500 font-medium">
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      {/* Progress Segments Row */}
      <View className="flex-row justify-between w-full">
        {[...Array(totalSteps)].map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${index < currentStep ? "bg-[#1da1f2]" : "bg-gray-200"}`}
            style={{ width: "23.5%" }} // Ensures exact spacing for the progress bar
          />
        ))}
      </View>
    </View>
  );
};

export default Pagination;
