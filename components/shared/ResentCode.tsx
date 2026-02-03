import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ResendCodeProps {
  /** Re-triggers the timer reset whenever it flips to true */
  isVisible: boolean;
  /** How many seconds to count down before showing "Resend" */
  timerSeconds: number;
  /** Fires when the user taps "Resend" */
  onResend?: () => void;
}

const ResendCode: React.FC<ResendCodeProps> = ({
  isVisible,
  timerSeconds: initialSeconds,
  onResend,
}) => {
  const [remaining, setRemaining] = useState<number>(initialSeconds);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Reset whenever the modal opens or initialSeconds changes
  useEffect(() => {
    if (isVisible) {
      setRemaining(initialSeconds);
      setCanResend(false);
    }
  }, [isVisible, initialSeconds]);

  // Countdown tick
  useEffect(() => {
    if (!isVisible) return;

    if (remaining <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => setRemaining((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [isVisible, remaining]);

  const handleResend = () => {
    setRemaining(initialSeconds);
    setCanResend(false);
    onResend?.();
  };

  // Format as MM:SS — matches the screenshot (e.g. 00:54)
  const pad = (n: number) => String(n).padStart(2, "0");
  const mm = pad(Math.floor(remaining / 60));
  const ss = pad(remaining % 60);

  return (
    <View className="flex-row items-center mt-8 mb-7">
      <Text className="text-sm text-[#7d848d]">Resend Code </Text>

      {canResend ? (
        <TouchableOpacity onPress={handleResend}>
          <Text className="text-sm font-semibold text-[#00a2ff]">Resend</Text>
        </TouchableOpacity>
      ) : (
        <Text className="text-sm font-semibold text-[#7d848d]">
          {mm}:{ss}
        </Text>
      )}
    </View>
  );
};

export default ResendCode;
