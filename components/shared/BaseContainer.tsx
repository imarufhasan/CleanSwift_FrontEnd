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
  padding?: boolean | number; // Optional padding for content (can be a boolean or a number)
  margin?: boolean | number; // Optional margin for content (can be a boolean or a number)
  additionalStyles?: object; // Optional to pass additional custom styles
  keyboardVerticalOffset?: number; // Custom vertical offset for keyboard avoidance
  backgroundColor?: string; // Optional background color for the container
}

const BaseContainer: React.FC<BaseContainerProps> = ({
  children,
  padding = true, // Default padding is true
  margin = false, // Default margin is false
  additionalStyles = {},
  keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 20,
  backgroundColor = "white", // Default background color is white
}) => {
  // Calculate padding and margin values based on the provided props
  const paddingStyle = padding
    ? typeof padding === "boolean"
      ? 16
      : padding
    : 0;
  const marginStyle = margin ? (typeof margin === "boolean" ? 16 : margin) : 0;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor, margin: marginStyle }} // Apply background color and margin
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: paddingStyle, // Apply padding if defined
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
