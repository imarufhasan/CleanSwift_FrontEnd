import { useRouter } from "expo-router";
import { useState } from "react";
 
const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();


  // customer login res data
//   {
//     "success": true,
//     "message": "Profile data retrieved successfully!",
//     "data": {
//         "_id": "699bdfc0ef2d267d39639532",
//         "name": "Maruf Hasan",
//         "phone": "+8801679663160",
//         "image": "https://res.cloudinary.com/dweesppci/image/upload/v1746204369/wtmpcphfvexcq2ubcss0.png",
//         "email": "marufhasan60sta@gmail.com",
//         "isVerifiedByOTP": true,
//         "role": "CUSTOMER"
//     }
// }


// driver login res data
// {
//     "success": true,
//     "message": "Profile data retrieved successfully!",
//     "data": {
//         "_id": "69a5068463fcf76d59adb0de",
//         "name": "Maruf Hasan",
//         "phone": "+8801679663160",
//         "image": "https://res.cloudinary.com/dweesppci/image/upload/v1746204369/wtmpcphfvexcq2ubcss0.png",
//         "email": "maruf.hasan@sparktechagency.com",
//         "isVerifiedByOTP": true,
//         "role": "DRIVER"
//     }
// }


// const dispatch = useAppDispatch();

// const handleLogin = async () => {
//   try {
//     dispatch(setLoading(true));

//     const data = await loginApi(email, password);

//     dispatch(setUser(data.user));

//   } catch (error) {
//     console.log("Login error:", error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };
 
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
 