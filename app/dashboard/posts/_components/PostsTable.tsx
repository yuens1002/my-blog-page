'use client';

import type { Post } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CircleX,
  CopyPlus,
  Eye,
  EyeIcon,
  FilePenLine,
  MonitorCheck,
  MonitorOff,
  MonitorOffIcon,
} from 'lucide-react';
import PostsTableActions from './PostsTableActions';
import PostStatusIcon from './StatusIcon';

type PostsTableType = {
  posts: Post[];
};

export default function PostsTable({ posts }: PostsTableType) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">status</span>
          </TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Last Edited</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              <PostStatusIcon status={post.status} />
            </TableCell>
            <TableCell>{post.title}</TableCell>
            <TableCell>
              {new Date(post.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <PostsTableActions
                slug={post.slug}
                status={post.status}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
