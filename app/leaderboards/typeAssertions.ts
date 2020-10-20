import { Leaderboard } from "@prisma/client"
import { InMemoryLeaderboard } from "./InMemoryLeaderboardsProvider/types"

export const isSavedLeaderboard = (
  leaderboard: InMemoryLeaderboard | Leaderboard
): leaderboard is Leaderboard => {
  return (leaderboard as Leaderboard).ownerId !== undefined
}
