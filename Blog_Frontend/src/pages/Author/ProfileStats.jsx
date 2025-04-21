const ProfileStats = () => {
  const stats = {
    blogs: 8,
    bookmarks: 5,
    followers: 120,
    following: 45,
  };

  return (
    <div className="flex justify-center gap-8 my-6">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="text-center">
          <h2 className="text-xl font-bold">{value}</h2>
          <p className="capitalize text-sm text-muted-foreground">{key}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
