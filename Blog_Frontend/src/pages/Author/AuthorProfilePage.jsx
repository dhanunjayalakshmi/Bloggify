import React from "react";
import ProfileStats from "./ProfileStats";
import BlogListSection from "./BlogListSection";
import AuthorProfileHeader from "@/components/authorProfile/AuthorProfileHeader";

const AuthorProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 space-y-2 py-8">
      <AuthorProfileHeader />
      <ProfileStats />
      <BlogListSection />
    </div>
  );
};

export default AuthorProfilePage;
