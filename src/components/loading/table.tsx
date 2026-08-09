import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dato</TableHead>
          <TableHead>Ditt resultat</TableHead>
          <TableHead>Vinner</TableHead>
          <TableHead>Ant. spillere</TableHead>
          <TableHead>Sted</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, index) => (
          <TableRow key={`played-game-loading-${index}`}>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-8" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
