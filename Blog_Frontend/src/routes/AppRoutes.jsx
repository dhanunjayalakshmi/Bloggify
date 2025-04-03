import Forgotpassword from "@/pages/Auth/Forgotpassword";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import Home from "@/pages/Home/Home";
import { Routes, Route } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
    </Routes>
  );
};

export default AppRoutes;
