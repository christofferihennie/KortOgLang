export const GAME_TYPES = ["7 runder", "9 runder"] as const
export type GameType = (typeof GAME_TYPES)[number]
export const DEFAULT_GAME_TYPE: GameType = GAME_TYPES[0]

export const ROUND_NAMES_7 = [
  "Boks, Boks",
  "Boks, Rems",
  "Rems, Rems",
  "Boks, Boks, Rems",
  "Boks, Rems, Rems",
  "Boks, Boks, Boks",
  "Rems, Rems, Rems",
] as const

export const ROUND_NAMES_9 = [
  "Boks, Boks",
  "Boks, Rems",
  "Rems, Rems",
  "Boks, Boks, Boks",
  "Boks, Boks, Rems",
  "Boks, Rems, Rems",
  "Rems, Rems, Rems",
  "Boks, Boks, Boks, Rems",
  "Boks, Boks, Rems, Rems",
] as const

export const GAME_TYPE_MAPPING = {
  "7 runder": ROUND_NAMES_7,
  "9 runder": ROUND_NAMES_9,
} as const
