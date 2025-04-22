import React from "react";

const badgeLabels = {
  early_adopter: "🚀 Early Adopter",
  top_writer: "✍️ Top Writer",
  verified: "✅ Verified",
};

const Badges = ({ badges }) => {
  if (!badges?.length) return null;

  return (
    <div className="flex justify-center gap-3 mt-6 flex-wrap">
      {badges.map((badge) => (
        <span
          key={badge}
          className="px-3 py-2 text-sm rounded-full bg-gray-700 text-white shadow-sm"
        >
          {badgeLabels[badge] || badge}
        </span>
      ))}
    </div>
  );
};

export default Badges;
