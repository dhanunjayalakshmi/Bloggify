import PublicNavbar from "@/components/landingPage/PublicNavbar";
import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">About</h1>
      <p className="text-lg leading-relaxed">
        Welcome to our blogging platform — a place where ideas come alive.
        Whether you're a developer, writer, or thinker, our goal is to empower
        you to share your thoughts, explore new perspectives, and connect with a
        like-minded community.
      </p>
      <p className="text-lg leading-relaxed mt-4">
        This platform was built using modern technologies like React, Supabase,
        and Tailwind CSS. It's part of an effort to learn, grow, and help others
        express themselves through writing.
      </p>
    </div>
  );
};

export default AboutPage;
