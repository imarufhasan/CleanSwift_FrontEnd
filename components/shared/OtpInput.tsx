import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, TextInput } from "react-native";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (digits: string[]) => void;
  autoFocusOnMount?: boolean;
}

export interface OTPInputHandle {
  /** Clears every box AND focuses the first one (safe to call on re-open) */
  reset: () => void;
  /** Focuses whichever box is currently active */
  focus: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const OTPInput = forwardRef<OTPInputHandle, OTPInputProps>(
  ({ length = 6, onComplete, onChange, autoFocusOnMount = true }, ref) => {
    const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
    const [focusIndex, setFocusIndex] = useState<number>(0);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    // ── Imperative handle ───────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      reset: () => {
        setDigits(Array(length).fill(""));
        setFocusIndex(0);
        // Small delay so React has flushed the state update before we focus
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      },
      focus: () => {
        inputRefs.current[focusIndex]?.focus();
      },
    }));

    // Focus first box on initial mount only
    useEffect(() => {
      if (autoFocusOnMount) {
        setTimeout(() => inputRefs.current[0]?.focus(), 300);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Handlers ────────────────────────────────────────────────────────
    const handleChangeText = (value: string, index: number) => {
      const char = value.slice(-1);

      if (char === "") {
        const updated = [...digits];
        updated[index] = "";
        setDigits(updated);
        onChange?.(updated);
        const prev = index - 1;
        if (prev >= 0) {
          setFocusIndex(prev);
          inputRefs.current[prev]?.focus();
        }
        return;
      }

      if (!/\d/.test(char)) return;

      const updated = [...digits];
      updated[index] = char;
      setDigits(updated);
      onChange?.(updated);

      const next = index + 1;
      if (next < length) {
        setFocusIndex(next);
        inputRefs.current[next]?.focus();
      } else {
        inputRefs.current[index]?.blur();
        onComplete?.(updated.join(""));
      }
    };

    const handleKeyPress = (e: any, index: number) => {
      if (e.nativeEvent.key === "Backspace" && digits[index] === "") {
        const prev = index - 1;
        if (prev >= 0) {
          const updated = [...digits];
          updated[prev] = "";
          setDigits(updated);
          onChange?.(updated);
          setFocusIndex(prev);
          inputRefs.current[prev]?.focus();
        }
      }
    };

    // ── Render ──────────────────────────────────────────────────────────
    return (
      <View className="flex-row gap-2.5">
        {digits?.map((digit, i) => {
          const isFocus = focusIndex === i;
          const hasDigit = digit !== "";
          const borderColor =
            isFocus || hasDigit ? "border-[#00a2ff]" : "border-[#d1d5db]";
          const bg = isFocus || hasDigit ? "bg-[#E6F6FF]" : "bg-[#E6F6FF]";

          return (
            <TextInput
              key={i}
              ref={(r) => {
                inputRefs.current[i] = r;
              }}
              className={`w-12 h-14 rounded-lg border-[1.5px] ${borderColor} ${bg} text-center text-3xl font-bold text-[#1a1c1e] sm:w-16 sm:h-20 md:w-20 md:h-24`}
              style={{
                textAlignVertical: "center", // Vertically center on Android
                includeFontPadding: false, // Remove extra padding on Android
                padding: 0, // Remove default padding
              }}
              value={digit}
              onChangeText={(val) => handleChangeText(val, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              onFocus={() => setFocusIndex(i)}
              maxLength={2}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              importantForAutofill="yes"
              selectionColor="#00a2ff"
            />
          );
        })}
      </View>
    );
  },
);

OTPInput.displayName = "OTPInput";

export default OTPInput;
