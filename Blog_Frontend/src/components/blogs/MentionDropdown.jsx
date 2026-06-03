const MentionDropdown = ({ users, selectedIndex, coords, onSelect }) => {
  if (!users.length) return null;

  return (
    <div
      className="absolute z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      style={{ top: coords.top, left: coords.left }}
    >
      {users.map((user, idx) => (
        <div
          key={user.id}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(user);
          }}
          className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
            idx === selectedIndex
              ? "bg-blue-50 dark:bg-blue-900/30"
              : "hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-6 w-6 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-medium truncate text-gray-900 dark:text-gray-100">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @{user.username}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MentionDropdown;
