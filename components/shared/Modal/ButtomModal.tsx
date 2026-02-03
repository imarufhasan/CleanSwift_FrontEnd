import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

interface BottomModalProps {
  isVisible: boolean;
  onClose: () => void;
  bottomPadding?: string;
  children: React.ReactNode;
}

const BottomModal: React.FC<BottomModalProps> = ({
  isVisible,
  onClose,
  bottomPadding = "pb-6",
  children,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* 1. This View acts as the container that pins content to the bottom */}
      <View className="flex-1 justify-end">
        {/* 2. Background overlay stays behind everything */}
        <TouchableOpacity
          className="absolute inset-0 bg-black/45"
          activeOpacity={1}
          onPress={onClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "android" ? "padding" : "height"}
        >
          <View
            className={`bg-white rounded-t-3xl px-6 ${bottomPadding} items-center`}
          >
            {/* Drag handle */}
            <View className="w-10 h-1 bg-gray-300 rounded-full mt-2.5 mb-5" />

            {children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default BottomModal;
