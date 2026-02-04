import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import BottomModal from "@/components/shared/Modal/ButtomModal";
import OTPInput, { OTPInputHandle } from "@/components/shared/OtpInput";
import { Button } from "@/components/shared/Button";
import { GeneralText } from "@/components/shared/GeneralText";
import ResendCode from "@/components/shared/ResentCode";

interface OTPVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;

  onVerify: (code: string) => void;

  resendTimerSeconds?: number;

  onResend?: () => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isVisible,
  onClose,
  onVerify,
  resendTimerSeconds = 60,
  onResend,
}) => {
  const [code, setCode] = useState<string>("");
  const otpRef = useRef<OTPInputHandle>(null);

  useEffect(() => {
    if (isVisible) {
      setCode("");
      setTimeout(() => otpRef.current?.reset(), 100);
    }
  }, [isVisible]);

  const handleContinue = () => {
    if (code.length === 6) onVerify(code);
  };

  const isFilled = code.length === 6;

  return (
    <BottomModal isVisible={isVisible} onClose={onClose}>
      <GeneralText
        title="OTP Verification"
        description="Enter the 6 digits code that you received on your email"
      />

      <OTPInput
        ref={otpRef}
        length={6}
        onComplete={(fullCode) => setCode(fullCode)}
        onChange={(digits) => setCode(digits.join(""))}
      />

      <ResendCode
        isVisible={isVisible}
        timerSeconds={resendTimerSeconds}
        onResend={onResend}
      />

      <View className="w-full">
        <Button
          label="Continue"
          onPress={handleContinue}
          disabled={!isFilled}
        />
      </View>
    </BottomModal>
  );
};

export default OTPVerificationModal;
