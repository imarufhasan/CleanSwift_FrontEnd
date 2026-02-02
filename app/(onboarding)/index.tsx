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

  // 1. Setup Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; // Slide up from 30px
  const scaleAnim = useRef(new Animated.Value(0.9)).current; // Pop from 90% size

  useEffect(() => {
    // Reset values before starting
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    scaleAnim.setValue(0.9);

    // 2. Run animations in parallel for a smooth "arrival"
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
      router.push("/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Container for Illustration - Slightly different animation for depth */}
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

      {/* Container for Content - Sliding Up */}
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
            onPress={() => router.push("/login")}
            className="mt-5"
          >
            <Text className="text-[#7d848d] text-sm font-medium">Skip</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
