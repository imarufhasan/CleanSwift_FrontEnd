import React from "react";
import { View, Image } from "react-native";
import { SvgProps } from "react-native-svg";

interface IllustrationProps {
  SvgComponent?: React.FC<SvgProps>;
  imageSrc?: any;
}

const OnboardingIllustration: React.FC<IllustrationProps> = ({
  SvgComponent,
  imageSrc,
}) => (
  <View className="w-full h-80 items-center justify-center relative">
    <View className="absolute top-10 right-10 w-10 h-10 bg-yellow-400 rounded-full opacity-60" />
    <View className="absolute bottom-10 left-10 w-8 h-12 bg-green-500 rounded-full opacity-20" />
    <View className="absolute bottom-5 right-10 w-10 h-16 bg-green-600 rounded-full opacity-10" />
    <View className="w-72 h-72 items-center justify-center">
      {SvgComponent ? (
        <SvgComponent width="100%" height="100%" />
      ) : (
        <Image
          source={imageSrc}
          className="w-full h-full"
          resizeMode="contain"
        />
      )}
    </View>
  </View>
);

export default OnboardingIllustration;
