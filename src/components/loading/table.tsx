import { Skeleton } from "../ui/skeleton";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "../ui/table";

export default function LoadingTable({ n }: { n?: number }) {
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
				{Array.from({ length: n ?? 5 }, (_, i) => (
					<TableRow key={`played-game-loading-${i}`}>
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
