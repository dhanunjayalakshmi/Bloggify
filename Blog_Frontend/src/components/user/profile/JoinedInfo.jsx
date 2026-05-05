const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

const JoinedInfo = ({ joinDate, lastActive }) => {
  return (
    <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
      <p>Joined: {formatDate(joinDate)}</p>
      <p>Last Active: {formatDate(lastActive)}</p>
    </div>
  );
};

export default JoinedInfo;
