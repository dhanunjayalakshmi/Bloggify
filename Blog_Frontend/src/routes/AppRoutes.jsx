import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Forgotpassword from "@/pages/Auth/ForgotPassword";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import UpdatePassword from "@/pages/Auth/UpdatePassword";
import BlogDetails from "@/pages/Blog/BlogDetails";
import CreateEditBlog from "@/pages/Blog/CreateEditBlog";
import PreviewPage from "@/pages/Blog/PreviewPage";
import Home from "@/pages/Home/Home";
import { Routes, Route } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateEditBlog />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/preview" element={<PreviewPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
