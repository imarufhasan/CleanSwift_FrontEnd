import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import BottomModal from "@/components/shared/Modal/ButtomModal";
import OTPInput, { OTPInputHandle } from "@/components/shared/OtpInput";
import { Button } from "@/components/shared/Button";
import { GeneralText } from "@/components/shared/GeneralText";
import { ResendCode } from "@/components/shared/ResendCode";

interface OTPVerificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  resendTimerSeconds?: number;
 onResend?: () => Promise<boolean | void>;
  loading?: boolean;
  setParentCode?: (code: string) => void;
  code?: string; // optional, if parent wants to control
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  isVisible,
  onClose,
  onVerify,
  resendTimerSeconds,
  loading,
  onResend,
  setParentCode, // renamed
  code,
}) => {
  const [internalCode, setInternalCode] = useState<string>(""); // local state
  const otpRef = useRef<OTPInputHandle>(null);

  useEffect(() => {
    if (isVisible) {
      setInternalCode("");
      if (setParentCode) setParentCode(""); // reset parent code
      setTimeout(() => otpRef.current?.reset(), 100);
    }
  }, [isVisible]);

  const handleContinue = () => {
    if (internalCode.length === 6) onVerify(internalCode);
  };

  const isFilled = internalCode.length === 6;

  return (
    <BottomModal isVisible={isVisible} onClose={onClose}>
      <GeneralText
        title="OTP Verification"
        description="Enter the 6 digits code that you received on your email"
      />

      <OTPInput
        ref={otpRef}
        length={6}
        onComplete={(fullCode) => {
          setInternalCode(fullCode); // update local
          if (setParentCode) setParentCode(fullCode); // update parent
        }}
        onChange={(digits) => {
          const joined = digits.join("");
          setInternalCode(joined);
          if (setParentCode) setParentCode(joined);
        }}
      />

      <ResendCode
        isVisible={isVisible}
        timerSeconds={resendTimerSeconds ?? 60}
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
