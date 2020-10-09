import { AuthorizationError, NotFoundError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { FindOnePlayerArgs } from "db"

type GetPlayerInput = {
  where: FindOnePlayerArgs["where"]
  // Only available if a model relationship exists
  // include?: FindOnePlayerArgs['include']
}

export default async function getPlayer(
  { where /* include */ }: GetPlayerInput,
  ctx: { session?: SessionContext } = {}
) {
  const userId: UUID = ctx.session!.userId

  const player = await db.player.findOne({
    where,
    include: { leaderboard: { select: { published: true, ownerId: true } } },
  })

  if (!player) throw new NotFoundError()
  if (!player.leaderboard.published && player.leaderboard.ownerId !== userId)
    throw new AuthorizationError()

  return player
}
