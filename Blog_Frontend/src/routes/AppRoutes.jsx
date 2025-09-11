import MainLayout from "@/layouts/MainLayout";
import UpdatePassword from "@/pages/Auth/UpdatePassword";
import BlogDetails from "@/pages/Blog/BlogDetails";
import CreateEditBlog from "@/pages/Blog/CreateEditBlog";
import PreviewPage from "@/pages/Blog/PreviewPage";
import Home from "@/pages/Home/Home";
import AuthorProfilePage from "@/pages/Author/AuthorProfilePage";
import { Routes, Route } from "react-router";
import UserAccountLayout from "@/layouts/UserAccountLayout";
import UserAccountPage from "@/pages/User/UserProfilePage";
import Stats from "@/pages/User/StatsTab";
import Posts from "@/pages/User/PostsTab";
import Bookmarks from "@/pages/User/BookmarksTab";
import Settings from "@/pages/User/SettingsTab";
import EditProfilePage from "@/pages/User/EditProfilePage";
import PrivateRoute from "@/components/PrivateRoute";
import LandingPage from "@/pages/LandingPage/LandingPage";
import AboutPage from "@/pages/LandingPage/AboutPage";
import ContactPage from "@/pages/LandingPage/ContactPage";
import TermsPage from "@/pages/LandingPage/TermsPage";
import PublicLayout from "@/layouts/PublicLayout";
import useAuthInit from "@/hooks/useAuthInit";

const AppRoutes = () => {
  useAuthInit();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<CreateEditBlog />} />
          <Route path="/blogs/:blogId" element={<BlogDetails />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/user/:id" element={<AuthorProfilePage />} />

          <Route path="/account" element={<UserAccountLayout />}>
            <Route index element={<UserAccountPage />} />
            <Route path="edit" element={<EditProfilePage />} />
            <Route path="stats" element={<Stats />} />
            <Route path="posts" element={<Posts />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
