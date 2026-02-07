import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import SvgIcon from "@/components/shared/svgIcon";

interface RoleContainerProps {
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  variant: "customer" | "driver";
  SvgComponent: any;
}

const RoleContainer: React.FC<RoleContainerProps> = ({
  title,
  description,
  isSelected,
  onSelect,
  variant,
  SvgComponent,
}) => {
  const isCustomer = variant === "customer";

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      className={`flex-row items-center p-4 mb-4 border-2 rounded-2xl ${
        isSelected
          ? isCustomer
            ? "border-blue-400 bg-blue-50"
            : "border-emerald-400 bg-emerald-50"
          : "border-blue-100 bg-[#F3F9FF]"
      }`}
    >
      {/* Radio Indicator */}
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
          isSelected
            ? isCustomer
              ? "border-blue-500 bg-blue-500"
              : "border-emerald-500 bg-emerald-500"
            : "border-sky-200 bg-white"
        }`}
      >
        {isSelected && <View className="w-2.5 h-2.5 bg-white rounded-full" />}
      </View>

      {/* Icon Circle */}
      <View
        className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${
          isCustomer ? "bg-blue-500" : "bg-emerald-500"
        }`}
      >
        <SvgIcon SvgComponent={SvgComponent} width={30} height={30} />
      </View>

      {/* Text Labels */}
      <View className="flex-1">
        <Text className="font-bold text-gray-900 text-lg leading-6">
          {title}
        </Text>
        <Text className="text-gray-500 text-sm leading-5 mt-0.5">
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RoleContainer;
