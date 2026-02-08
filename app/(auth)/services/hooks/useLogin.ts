import { useRouter } from "expo-router";
import { useState } from "react";
 
const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
 
  const login = async () => {
    // try {
    //   setLoading(true);
 
    //   setSuccessMessage("Login successful!");
 
    //   setTimeout(() => {
    //     setSuccessMessage(null);
    //   }, 3500);
    // } catch (err) {
    //   const errorMessage =
    //     err instanceof Error ? err.message : "An unexpected error occurred";
 
    //   setError(errorMessage);
 
    //   setTimeout(() => {
    //     setError(null);
    //   }, 3500);
    // } finally {
    //   setLoading(false);
    // }

    router.push("/(auth)/enableLocation");
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
 