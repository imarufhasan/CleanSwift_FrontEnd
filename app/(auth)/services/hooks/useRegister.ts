import { useState } from "react";
import { usersDatabase } from "@/mockDatabase/AuthDatabase"; // Assuming you're using a mock database for now

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
      // Clear previous messages
      setError(null);
      setSuccessMessage(null);

      setLoading(true);

      // Validation
      if (!fullName || !email || !password || !mobileNumber) {
        throw new Error("All fields are required");
      }

      if (!agreedToTerms) {
        throw new Error("You must agree to the terms and policies");
      }

      // Simulate checking if the email is already registered
      const existingUser = usersDatabase.find((user) => user.email === email);
      if (existingUser) {
        throw new Error("Email is already in use");
      }

      // Simulate registration process (this could be an API call)
      const newUser = {
        fullName,
        mobileNumber,
        email,
        password,
      };

      // Add the new user to the mock database (this could be a POST request to an API)
      usersDatabase.push(newUser);

      setSuccessMessage(
        "Registration successful! Please verify your phone number.",
      );

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
