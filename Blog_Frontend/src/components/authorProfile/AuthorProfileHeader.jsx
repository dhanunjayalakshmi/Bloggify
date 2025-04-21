import React from "react";
import { Button } from "@/components/ui/button"; // Using Shadcn button

const AuthorProfileHeader = () => {
  const user = {
    name: "John Doe",
    bio: "Passionate writer. Tech enthusiast.",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s",
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <img
        src={user.avatar}
        alt={user.name}
        className="h-24 w-24 rounded-full object-cover"
      />
      <div>
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-muted-foreground">{user.bio}</p>
      </div>
      <Button variant="outline">Follow</Button>
    </div>
  );
};

export default AuthorProfileHeader;
