import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { LeaderboardUpdateArgs } from "db"
import { cleanProfaneStringDataInObj } from "app/utils/profanityFilter"

type UpdateLeaderboardInput = {
  where: LeaderboardUpdateArgs["where"]
  data: Omit<LeaderboardUpdateArgs["data"], "user">
}

export default async function updateLeaderboard(
  { where, data }: UpdateLeaderboardInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const userId: UUID = ctx.session!.userId

  // Don't allow updating
  delete (data as any).user
  delete (data as any).updatedAt
  delete (data as any).createdAt
  delete (data as any).owner
  delete (data as any).id
  // don't let users change privacy settings yet
  delete (data as any).private

  const oldLeaderboard = await db.leaderboard.findOne({ where })

  if (oldLeaderboard?.ownerId !== userId) throw new AuthorizationError()

  const leaderboard = await db.leaderboard.update({
    where,
    data: { ...cleanProfaneStringDataInObj(data, ["title", "details"]) },
  })

  return leaderboard
}
