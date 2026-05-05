import Colors from "@/constants/color";
import ShowMessage from "@/constants/toast";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface ResendCodeProps {
  isVisible: boolean;
  timerSeconds?: number;
  onResend?: () => Promise<boolean | void>;
}

export const ResendCode: React.FC<ResendCodeProps> = ({
  isVisible,
  timerSeconds = 60,
  onResend,
}) => {
  const [remaining, setRemaining] = useState<number>(timerSeconds);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    setRemaining(timerSeconds);
    setCanResend(false);

    const intervalId = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isVisible, timerSeconds]);

  const startTimer = () => {
    setCanResend(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!onResend) return;

    setIsResending(true);
    setCanResend(false);

    try {
      const success = await onResend();

      if (!success) {
        //ShowMessage.error("Failed to resend OTP");
        setCanResend(true);
        // 🔥 IMPORTANT: restart timer even on failure
        setRemaining(timerSeconds);

        //startTimer(); // restart countdown
        return;
      }

      ShowMessage.success("OTP resent successfully");

      // reset timer on success too
      setRemaining(timerSeconds);
      startTimer();
    } finally {
      setIsResending(false);
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const mm = pad(Math.floor(remaining / 60));
  const ss = pad(remaining % 60);

  if (!isVisible) return null;

  return (
    <View className="flex-row items-center mt-8 mb-7">
      <Text className="text-sm text-[#7d848d]">Resend Code </Text>

      {isResending ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : canResend ? (
        <TouchableOpacity onPress={handleResend}>
          <Text
            style={{ color: Colors.primary }}
            className="text-sm font-semibold"
          >
            Resend
          </Text>
        </TouchableOpacity>
      ) : (
        <Text className="text-sm font-semibold text-[#7d848d]">
          {mm}:{ss}
        </Text>
      )}
    </View>
  );
};
