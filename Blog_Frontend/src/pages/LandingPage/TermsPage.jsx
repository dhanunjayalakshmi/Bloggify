import React from "react";

const TermsPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">Terms & Privacy</h1>
      <p className="text-lg leading-relaxed">
        By using this platform, you agree to the following terms:
      </p>
      <ul className="list-disc pl-6 mt-4 space-y-2 text-lg">
        <li>You are responsible for the content you publish.</li>
        <li>No hate speech, harassment, or illegal activity is allowed.</li>
        <li>We do not sell or misuse your data.</li>
        <li>Basic analytics may be used to improve the platform.</li>
      </ul>
      <p className="text-lg leading-relaxed mt-4">
        This site is a personal project built for learning, and content
        moderation may be limited. Please use it respectfully.
      </p>
    </div>
  );
};

export default TermsPage;
