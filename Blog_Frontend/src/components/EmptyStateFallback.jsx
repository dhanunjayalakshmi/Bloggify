const EmptyStateFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4">
      <p className="text-lg">No blogs published yet.</p>
      <p className="text-muted-foreground">Start writing your first blog!</p>
    </div>
  );
};

export default EmptyStateFallback;
