import { UserButton, useUser } from "@clerk/tanstack-react-start"
import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { api } from "../../convex/_generated/api"

const finishedGamesQuery = convexQuery(api.games.getFinishedGames, {})

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(finishedGamesQuery)
  },
  component: App,
})

function App() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <SignInStatus />
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <FinishedGames />
      </div>
    </div>
  )
}

function SignInStatus() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return <p className="text-muted-foreground">Sjekker innlogging …</p>
  }

  if (!isSignedIn) {
    return <p className="text-muted-foreground">Ikke innlogget</p>
  }

  return (
    <div className="flex items-center gap-3">
      <UserButton />
      <span>
        Innlogget som{" "}
        <span className="font-medium">
          {user.fullName ?? user.primaryEmailAddress?.emailAddress ?? user.id}
        </span>
      </span>
    </div>
  )
}

const dateFormat = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

function FinishedGames() {
  const { data: games } = useSuspenseQuery(finishedGamesQuery)

  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-medium">Ferdigspilte spill</h2>
      {games.length === 0 ? (
        <p className="text-muted-foreground">Ingen ferdigspilte spill ennå.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {games.map((game) => (
            <li
              key={game._id}
              className="flex flex-col rounded-md border p-3 leading-normal"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">
                  {game.location?.name ?? "Ukjent sted"}
                </span>
                <span className="text-muted-foreground">
                  {dateFormat.format(game._creationTime)}
                </span>
              </div>
              <span className="text-muted-foreground">
                {game.type} · {game.num_participants} spillere · vunnet av{" "}
                {game.winner_name}
              </span>
              <span className="text-muted-foreground">
                Din plassering: {game.participation.finalPosition ?? "–"} (
                {game.participation.finalScore ?? "–"} poeng)
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
