import { useState } from "react";
 
const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
 
  const login = async () => {
    try {
      setLoading(true);
 
      // Always show success message without logic
      setSuccessMessage("Login successful!");
 
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
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    successMessage,
    login,
  };
};
 
export default useLogin;
 