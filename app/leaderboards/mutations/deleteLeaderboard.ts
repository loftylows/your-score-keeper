import { SessionContext, AuthorizationError } from "blitz"
import { UUID } from "common-types"
import db from "db"

export default async function deleteLeaderboard(id: UUID, ctx: { session?: SessionContext } = {}) {
  ctx.session!.authorize()

  const userId: UUID = ctx.session!.userId
  const leaderboard = await db.leaderboard.findOne({ where: { id } })

  if (!leaderboard || leaderboard.ownerId !== userId) {
    throw new AuthorizationError()
  }

  await db.player.deleteMany({ where: { leaderboardId: id } })
  await db.leaderboard.delete({ where: { id } })

  return leaderboard
}
