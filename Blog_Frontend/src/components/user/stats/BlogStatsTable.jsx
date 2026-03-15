import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const BlogStatsTable = ({ blogs }) => {
  return (
    <div className="w-full rounded-xl px-4 shadow bg-background dark:bg-gray-900 overflow-x-auto">
      <Table className="w-full text-left table-auto border-collapse">
        <TableHeader>
          <TableRow className="text-md font-bold text-muted-foreground border-b">
            <TableHead className="p-2">Title</TableHead>
            <TableHead className="p-2">Views</TableHead>
            <TableHead className="p-2">Upvotes</TableHead>
            <TableHead className="p-2">Comments</TableHead>
            <TableHead className="p-2">Status</TableHead>
            <TableHead className="p-2">Updated</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {blogs?.map((blog) => (
            <TableRow
              key={blog.id}
              className="space-y-4 text-md border-b hover:bg-muted/10"
            >
              <TableCell className="p-2">{blog.title}</TableCell>
              <TableCell className="p-2">{blog.views}</TableCell>
              <TableCell className="p-2">{blog.upvotes}</TableCell>
              <TableCell className="p-2">{blog.comments}</TableCell>
              <TableCell className="p-2">{blog.status}</TableCell>
              <TableCell className="p-2">
                {new Date(blog.updated).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogStatsTable;
