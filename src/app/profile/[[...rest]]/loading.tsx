import { Spinner } from "@/components/ui/loading-spinner";

export default function Loading() {
  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
        Din profil
      </h2>

      <div className="flex flex-col items-center justify-center h-full">
        <Spinner size="large">Laster inn profilen din...</Spinner>
      </div>
    </>
  );
}
