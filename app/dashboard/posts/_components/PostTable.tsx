import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type PostsTableType = { children: React.ReactNode };

export default function PostTable({ children }: PostsTableType) {
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
      <TableBody>{children}</TableBody>
    </Table>
  );
}
