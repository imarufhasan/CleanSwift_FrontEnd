import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingIllustration from "@/components/onboarding/OnboardingIllustration";
import { OnboardingText } from "@/components/onboarding/OnboardingText";
import { PaginationDots } from "@/components/onboarding/PaginationDots";
import { PrimaryButton } from "@/components/shared/PrimaryButton";
import { ONBOARDING_DATA } from "@/constants/onboarding";
import { router } from "expo-router";

const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const totalSteps = ONBOARDING_DATA.length;
  const content = ONBOARDING_DATA[currentStep];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    scaleAnim.setValue(0.9);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const handleNext = (): void => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push("/(auth)/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View
        style={{
          flex: 5,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="justify-center items-center"
      >
        <OnboardingIllustration SvgComponent={content.Svg} />
      </Animated.View>

      <Animated.View
        style={{
          flex: 4,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="px-[30px]"
      >
        <OnboardingText
          title={content.title}
          description={content.description}
        />

        <View className="items-center pb-20 mt-auto">
          <PaginationDots total={totalSteps} activeIndex={currentStep} />

          <PrimaryButton
            label={currentStep === totalSteps - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-5"
          >
            <Text className="text-[#7d848d] text-base font-medium">Skip</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
