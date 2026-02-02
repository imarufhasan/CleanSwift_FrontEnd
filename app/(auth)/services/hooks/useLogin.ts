import { useState } from "react";
import { usersDatabase } from "@/mockDatabase/AuthDatabase";

const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const login = async () => {
    try {
      // Clear previous messages
      setError(null);
      setSuccessMessage(null);

      setLoading(true);

      // Your login logic here
      // Example validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Simulate API call or database check
      const user = usersDatabase.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      setSuccessMessage("Login successful!");

      // Reset message after showing
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);
    } catch (err) {
      // Type guard for error handling
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      setError(errorMessage);

      // Reset error after showing
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
