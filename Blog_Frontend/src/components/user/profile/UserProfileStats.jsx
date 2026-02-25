const UserProfileStats = ({ stats = {} }) => {
  return (
    <div className="flex justify-center gap-8 text-center py-4">
      <div>
        <p className="text-xl font-semibold">{stats?.blogs_published || 0}</p>
        <p className="text-sm text-muted-foreground">Posts</p>
      </div>
      <div>
        <p className="text-xl font-semibold">{stats?.followers || 0}</p>
        <p className="text-sm text-muted-foreground">Followers</p>
      </div>
      <div>
        <p className="text-xl font-semibold">{stats?.following || 0}</p>
        <p className="text-sm text-muted-foreground">Following</p>
      </div>
      <div>
        <p className="text-xl font-semibold">{stats?.total_upvotes || 0}</p>
        <p className="text-sm text-muted-foreground">Upvotes</p>
      </div>
      <div>
        <p className="text-xl font-semibold">{stats?.total_comments || 0}</p>
        <p className="text-sm text-muted-foreground">Comments</p>
      </div>
    </div>
  );
};

export default UserProfileStats;
