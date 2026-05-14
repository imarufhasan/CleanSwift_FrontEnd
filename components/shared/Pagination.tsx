import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SvgIcon from "./svgIcon";
import backIcon from "@/assets/images/arrow-left.svg";

interface PaginationProps {
  currentStep: number;
  totalSteps: number;
  onBackPress?: () => void;
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
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            className="flex-row items-center"
          >
            <SvgIcon SvgComponent={backIcon} width={20} height={20} />
            <Text className="text-[18px] font-bold text-black ml-2">Back</Text>
          </TouchableOpacity>
        )}

        <Text className="text-[13px] text-gray-500 font-medium">
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      <View className="flex-row justify-between w-full">
        {[...Array(totalSteps)]?.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${index < currentStep ? "bg-[#1da1f2]" : "bg-gray-200"}`}
            style={{ width: "23.5%" }}
          />
        ))}
      </View>
    </View>
  );
};

export default Pagination;
