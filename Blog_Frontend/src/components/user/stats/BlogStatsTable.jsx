import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const BlogTable = ({ blogs }) => {
  return (
    <Table className="w-full text-left table-auto border-collapse">
      <TableHeader>
        <TableRow className="text-sm text-muted-foreground border-b">
          <TableHead className="p-2">Title</TableHead>
          <TableHead className="p-2">Views</TableHead>
          <TableHead className="p-2">Upvotes</TableHead>
          <TableHead className="p-2">Comments</TableHead>
          <TableHead className="p-2">Status</TableHead>
          <TableHead className="p-2">Updated</TableHead>
          <TableHead className="p-2">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogs.map((blog) => (
          <TableRow key={blog.id} className="border-b hover:bg-muted/10">
            <TableCell className="p-2">{blog.title}</TableCell>
            <TableCell className="p-2">{blog.views}</TableCell>
            <TableCell className="p-2">{blog.upvotes}</TableCell>
            <TableCell className="p-2">{blog.comments}</TableCell>
            <TableCell className="p-2">{blog.status}</TableCell>
            <TableCell className="p-2">{blog.updated}</TableCell>
            <TableCell className="p-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const BlogStatsTable = ({ blogs }) => {
  return (
    <div className="w-full rounded-xl px-4 shadow bg-background dark:bg-gray-900 overflow-x-auto">
      <BlogTable blogs={blogs} />
    </div>
  );
};

export default BlogStatsTable;
