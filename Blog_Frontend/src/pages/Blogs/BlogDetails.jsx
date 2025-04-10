import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Bookmark, MessageCircle, Share2, ThumbsUp } from "lucide-react";

const BlogDetails = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground dark:text-white">
        Understanding the Future of Technology
      </h1>
      <p className="text-lg mt-4 text-muted-foreground">
        Explore the latest trends in technology and how they are shaping our
        future. From AI advancements to sustainable tech solutions, discover
        what's next in the tech world.
      </p>
      <div className="flex flex-wrap items-center mt-6 gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              className="w-10 h-10 rounded-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
            />
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground dark:text-white">
              Alex Johnson
            </span>
            <span className="text-xs">Jan 22, 2024 • 10 min read</span>
          </div>
        </div>
        <Button size="sm" variant="outline">
          Follow
        </Button>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button variant="ghostButton" aria-label="Like">
          <ThumbsUp className="h-5 w-5" />
          <span className="sr-only">Like</span>
          <span>120</span>
        </Button>
        <Button variant="ghostButton" aria-label="Comment">
          <MessageCircle className="h-5 w-5" />{" "}
          <span className="sr-only">Comment</span>
          <span>56</span>
        </Button>
        <Button size="icon" variant="ghostButton" aria-label="Bookmark">
          <Bookmark className="h-5 w-5" />{" "}
          <span className="sr-only">Bookmark</span>
        </Button>
        <Button size="icon" variant="ghostButton" aria-label="Share">
          <Share2 className="h-5 w-5" /> <span className="sr-only">Share</span>
        </Button>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 space-y-2">
        <h3 className="text-xl font-semibold">Synopsis</h3>
        <p className="text-lg">
          Explore the latest trends in technology and how they are shaping our
          future. From AI advancements to sustainable tech solutions, discover
          what's next in the tech world.
        </p>
        <h3 className="text-xl font-semibold">Content</h3>
        <p className="text-lg">
          The world of technology is ever-evolving, with new innovations
          emerging every day. In this article, we delve into some of the most
          exciting developments...
        </p>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semmibold mb-2">Leave a comment</h3>
        <Textarea placeholder="Comment Here..." className="resize-none" />
        <Button className="mt-2">Post comment</Button>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Comments (23)</h3>
        <div className="mt-4">
          <div className="flex gap-3 items-start">
            <Avatar>
              <AvatarImage src="/user.jpg" />
            </Avatar>
            <div>
              <p className="font-medium">
                John Doe{" "}
                <span className="text-sm text-muted-foreground">
                  • October 12, 2023
                </span>
              </p>
              <p>This article is very insightful and well-written!</p>
              <div className="flex gap-4 mt-2">
                <Button variant="outline" size="icon">
                  👍
                </Button>
                <Button variant="outline" size="icon">
                  👎
                </Button>
                <Button variant="outline" className="text-blue-600">
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Button varinat="ghost" className="mt-4">
          See all comments
        </Button>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold">
          Other Suggested Articles from Author
        </h3>
        <div className="grid gap-4 mt-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="border p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold">Blog Title</h4>
              <p className="text-sm text-muted-foreground">
                A brief description of the blog post content goes here.
              </p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4">
          See More
        </Button>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold">
          Other Suggestions from Platform
        </h3>
        <div className="grid gap-4 mt-4">
          {[1, 2].map((_, idx) => (
            <div key={idx} className="border p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold">Blog Title</h4>
              <p className="text-sm text-muted-foreground">
                A brief description of the blog post content goes here.
              </p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4">
          See More
        </Button>
      </div>
    </div>
  );
};

export default BlogDetails;
