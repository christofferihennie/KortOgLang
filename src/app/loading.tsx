import LoadingTable from "@/components/loading/table";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
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

			<div className="max-w-full my-2">
				<div className="flex gap-2 overflow-y-scroll py-4 pl-2">
					{Array.from({ length: 3 }, (_, i) => (
						<Card key={`active-game-loading-${i}`} className="min-w-80 h-full">
							<CardHeader>
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-24" />
							</CardHeader>
							<CardContent className="h-full space-y-2">
								<div className="flex gap-2 flex-wrap">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-14" />
									<Skeleton className="h-4 w-18" />
								</div>
							</CardContent>
							<CardFooter>
								<Skeleton className="h-6 w-16 rounded-full" />
							</CardFooter>
						</Card>
					))}
				</div>
			</div>

			<Separator className="my-2" />

			<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
				Dine siste spill
			</h3>

			<Separator className="my-2" />

			<LoadingTable n={10} />
		</>
	);
}
