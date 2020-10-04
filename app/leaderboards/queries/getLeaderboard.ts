import { NotFoundError, SessionContext } from "blitz"
import db, { FindOneLeaderboardArgs } from "db"

type GetLeaderboardInput = {
  where: FindOneLeaderboardArgs["where"]
  // Only available if a model relationship exists
  // include?: FindOneLeaderboardArgs['include']
}

export default async function getLeaderboard(
  { where /* include */ }: GetLeaderboardInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const leaderboard = await db.leaderboard.findOne({ where })

  if (!leaderboard) throw new NotFoundError()

  return leaderboard
}
