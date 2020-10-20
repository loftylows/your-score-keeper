import { AuthorizationError, NotFoundError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { FindOneLeaderboardArgs } from "db"

type GetLeaderboardInput = {
  where: FindOneLeaderboardArgs["where"]
  // Only available if a model relationship exists
  // include?: FindOneLeaderboardArgs['include']
}

export default async function getLeaderboard(
  { where }: GetLeaderboardInput,
  ctx: { session?: SessionContext } = {}
) {
  const userId: UUID = ctx.session!.userId

  const leaderboard = await db.leaderboard.findOne({ where, include: { players: true } })

  if (!leaderboard) throw new NotFoundError()
  if (!leaderboard.published && userId !== leaderboard.ownerId) throw new AuthorizationError()

  return leaderboard
}
