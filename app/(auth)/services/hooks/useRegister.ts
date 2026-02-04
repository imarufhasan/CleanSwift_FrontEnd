import { useState } from "react";

const useRegister = () => {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const register = async () => {
    try {
      setLoading(true);

      // Always show success message without logic
      setSuccessMessage(
        "Registration successful! Please verify your phone number.",
      );

      // Reset success message after a short delay
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      setError(errorMessage);

      setTimeout(() => {
        setError(null);
      }, 3500);
    } finally {
      setLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    mobileNumber,
    setMobileNumber,
    email,
    setEmail,
    password,
    setPassword,
    agreedToTerms,
    setAgreedToTerms,
    loading,
    error,
    successMessage,
    register,
  };
};

export default useRegister;
