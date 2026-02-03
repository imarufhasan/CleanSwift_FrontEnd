import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface BaseContainerProps {
  children: React.ReactNode;
  padding?: boolean; // Optional padding for content
  additionalStyles?: object; // Optional to pass additional custom styles
  keyboardVerticalOffset?: number; // Custom vertical offset for keyboard avoidance
}

const BaseContainer: React.FC<BaseContainerProps> = ({
  children,
  padding = true,
  additionalStyles = {},
  keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 20,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingVertical: 32,
              paddingHorizontal: padding ? 16 : 0,
              ...additionalStyles, // Merge any custom styles passed
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BaseContainer;
