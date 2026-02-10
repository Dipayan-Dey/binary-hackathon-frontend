import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/authContext";
import { googleLogin } from "../api/authApi";
const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      //    console.log(idToken);
      // Send ID token to backend
      const res = await googleLogin({ idToken });

      const { token } = res.data;

      // Save JWT to localStorage and update auth context
      //   if (res.token) {

      localStorage.setItem("token", token);
      login(token);
      //   }

      toast.success(res.message || "Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to login. Please check your credentials.";
      toast.error(errorMessage);
    }
  };

  const handleError = () => {
    console.log("Login Failed");
    toast.error("Google login failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap={false}
      theme="filled_blue"
      size="large"
      text="signin_with"
      shape="rectangular"
      width="100%"
    />
  );
};

export default GoogleLoginButton;
