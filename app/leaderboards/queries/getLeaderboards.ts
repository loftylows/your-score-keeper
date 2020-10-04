import { SessionContext } from "blitz"
import db, { FindManyLeaderboardArgs } from "db"

type GetLeaderboardsInput = {
  where?: FindManyLeaderboardArgs["where"]
  orderBy?: FindManyLeaderboardArgs["orderBy"]
  skip?: FindManyLeaderboardArgs["skip"]
  take?: FindManyLeaderboardArgs["take"]
  // Only available if a model relationship exists
  // include?: FindManyLeaderboardArgs['include']
}

export default async function getLeaderboards(
  { where, orderBy, skip = 0, take }: GetLeaderboardsInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const leaderboards = await db.leaderboard.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.leaderboard.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    leaderboards,
    nextPage,
    hasMore,
  }
}
