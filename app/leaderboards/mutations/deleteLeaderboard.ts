import { SessionContext } from "blitz"
import db, { LeaderboardDeleteArgs } from "db"

type DeleteLeaderboardInput = {
  where: LeaderboardDeleteArgs["where"]
}

export default async function deleteLeaderboard(
  { where }: DeleteLeaderboardInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const leaderboard = await db.leaderboard.delete({ where })

  return leaderboard
}
