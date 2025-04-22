import React from "react";

const formatDate = (iso) => new Date(iso).toLocaleDateString();

const JoinedInfo = ({ joinDate, lastActive }) => {
  return (
    <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
      <p>Joined: {formatDate(joinDate)}</p>
      <p>Last Active: {formatDate(lastActive)}</p>
    </div>
  );
};

export default JoinedInfo;
