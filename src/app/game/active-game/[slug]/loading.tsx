import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <Skeleton className="h-10 w-48 mb-4" />

      <div className="flex flex-col items-center">
        <div className="grid grid-cols-3 items-end gap-2 w-3/4 my-6">
          <div className="flex flex-col items-center">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-12 w-10 rounded-t-md rounded-b-sm" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-20 w-12 rounded-t-md rounded-b-sm" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-10 rounded-t-md rounded-b-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>

      <Skeleton className="h-6 w-16 my-4" />

      <div className="flex-1">
        <div className="flex space-x-2 mb-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-9 w-8" />
          ))}
        </div>

        <Skeleton className="h-6 w-32 mb-4" />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }, (_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-12 w-full rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Skeleton className="h-10 w-32 mt-4" />
    </div>
  );
}
