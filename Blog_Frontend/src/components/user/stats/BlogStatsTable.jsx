import { Button } from "@/components/ui/button";

const BlogStatsTable = ({ blogs }) => {
  return (
    <div className="overflow-x-auto w-full bg-background p-4 rounded-xl shadow dark:bg-gray-900">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-sm text-muted-foreground border-b">
            <th className="p-2">Title</th>
            <th className="p-2">Views</th>
            <th className="p-2">Upvotes</th>
            <th className="p-2">Comments</th>
            <th className="p-2">Status</th>
            <th className="p-2">Updated</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="border-b hover:bg-muted/10">
              <td className="p-2">{blog.title}</td>
              <td className="p-2">{blog.views}</td>
              <td className="p-2">{blog.upvotes}</td>
              <td className="p-2">{blog.comments}</td>
              <td className="p-2">{blog.status}</td>
              <td className="p-2">{blog.updated}</td>
              <td className="p-2 flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogStatsTable;
