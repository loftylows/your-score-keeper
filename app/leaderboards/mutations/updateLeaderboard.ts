import { SessionContext } from "blitz"
import db, { LeaderboardUpdateArgs } from "db"

type UpdateLeaderboardInput = {
  where: LeaderboardUpdateArgs["where"]
  data: Omit<LeaderboardUpdateArgs["data"], "user">
  userId: string
}

export default async function updateLeaderboard(
  { where, data }: UpdateLeaderboardInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  // Don't allow updating
  delete (data as any).user

  const leaderboard = await db.leaderboard.update({ where, data })

  return leaderboard
}
