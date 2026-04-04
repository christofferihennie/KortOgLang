import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ROUND_NAMES } from "@/shared/game"

export function Rounds() {
  return (
    <Tabs defaultValue={ROUND_NAMES[0]}>
      <TabsList>
        {ROUND_NAMES.map((roundName, idx) => (
          <TabsTrigger key={roundName} value={roundName}>
            {idx}
          </TabsTrigger>
        ))}
      </TabsList>
      {ROUND_NAMES.map((roundName) => (
        <TabsContent key={roundName} value={roundName} />
      ))}
    </Tabs>
  )
}
