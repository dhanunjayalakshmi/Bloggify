import Forgotpassword from "@/pages/Auth/ForgotPassword";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import UpdatePassword from "@/pages/Auth/UpdatePassword";
import Home from "@/pages/Home/Home";
import { Routes, Route } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
    </Routes>
  );
};

export default AppRoutes;
