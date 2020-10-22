import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
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
  { where, orderBy, skip = 0, take = 20 }: GetLeaderboardsInput,
  ctx: { session?: SessionContext } = {}
) {
  const userId: UUID = ctx.session!.userId

  const leaderboards = await db.leaderboard.findMany({
    where,
    orderBy,
    include: {
      owner: {
        select: {
          username: true,
        },
      },
    },
    take: take > 20 || take < 1 || !Number.isInteger(take) ? 20 : take,
    skip,
  })

  leaderboards.forEach((l) => {
    const isNotOwner = l.ownerId !== userId
    if ((!l.published && isNotOwner) || (l.private && isNotOwner)) throw new AuthorizationError()
  })

  const count = await db.leaderboard.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    leaderboards,
    nextPage,
    hasMore,
    count,
  }
}
