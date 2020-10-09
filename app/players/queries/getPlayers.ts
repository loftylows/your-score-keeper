import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { FindManyPlayerArgs } from "db"

type GetPlayersInput = {
  where?: FindManyPlayerArgs["where"]
  orderBy?: FindManyPlayerArgs["orderBy"]
  skip?: FindManyPlayerArgs["skip"]
  take?: FindManyPlayerArgs["take"]
  // Only available if a model relationship exists
  // include?: FindManyPlayerArgs['include']
}

export default async function getPlayers(
  { where, orderBy, skip = 0, take }: GetPlayersInput,
  ctx: { session?: SessionContext } = {}
) {
  const userId: UUID = ctx.session!.userId

  const players = await db.player.findMany({
    where,
    orderBy,
    take,
    skip,
    include: { leaderboard: { select: { published: true, ownerId: true } } },
  })

  players.forEach((p) => {
    if (!p.leaderboard.published && p.leaderboard.ownerId !== userId) throw new AuthorizationError()
  })

  const count = await db.player.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    players,
    nextPage,
    hasMore,
  }
}
