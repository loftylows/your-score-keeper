import { SessionContext } from "blitz"
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
  ctx.session!.authorize()

  const players = await db.player.findMany({
    where,
    orderBy,
    take,
    skip,
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
