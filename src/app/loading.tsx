import { Separator } from "@/components/ui/separator";
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
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-4">
        Kort og Lang
      </h1>

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Dine aktive spill
      </h3>
      <Skeleton className="h-52 py-4 pl-2 w-full" />

      <Separator className="my-2" />

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Dine siste spill
      </h3>

      <Separator className="my-2" />

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
          {Array.from({ length: 5 }, (_, i) => (
            <TableRow key={`loading-row-${i}`}>
              {Array.from({ length: 5 }, (_, j) => (
                <TableCell key={`loading-cell-${i}-${j}`}>
                  <Skeleton className="w-28 h-12" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
