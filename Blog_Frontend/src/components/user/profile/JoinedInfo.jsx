import { parseUTC } from "@/utils/parseUTC";

const formatJoinDate = (iso) => {
  if (!iso) return "—";
  const d = parseUTC(iso);
  return !d || isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const relativeTime = (iso) => {
  if (!iso) return "Never";
  const d = parseUTC(iso);
  if (!d || isNaN(d.getTime())) return "Never";
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatJoinDate(iso);
};

const JoinedInfo = ({ joinDate, lastActive, isCurrentUser = false }) => {
  return (
    <div className="flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mt-2">
      <span>Joined {formatJoinDate(joinDate)}</span>
      <span>·</span>
      <span className={isCurrentUser ? "text-green-500 dark:text-green-400 font-medium" : ""}>
        {isCurrentUser ? "Active now" : `Last active ${relativeTime(lastActive)}`}
      </span>
    </div>
  );
};

export default JoinedInfo;
