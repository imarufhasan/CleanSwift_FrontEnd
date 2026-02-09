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
  padding?: boolean | number;
  margin?: boolean | number;
  additionalStyles?: object;
  keyboardVerticalOffset?: number;
  backgroundColor?: string;
}

const BaseContainer: React.FC<BaseContainerProps> = ({
  children,
  padding = true,
  margin = false,
  additionalStyles = {},
  keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 20,
  backgroundColor = "white",
}) => {
  const paddingStyle = padding
    ? typeof padding === "boolean"
      ? 16
      : padding
    : 0;
  const marginStyle = margin ? (typeof margin === "boolean" ? 16 : margin) : 0;

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor, margin: marginStyle }}
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
              paddingHorizontal: paddingStyle,
              ...additionalStyles,
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
