import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { LeaderboardCreateArgs } from "db"
import { cleanProfaneStringDataInObj } from "app/utils/profanityFilter"

type CreateLeaderboardInput = {
  data: Omit<LeaderboardCreateArgs["data"], "user">
  ownerId: string
}
export default async function createLeaderboard(
  { data, ownerId }: CreateLeaderboardInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const userId: UUID = ctx.session!.userId

  if (userId !== ownerId) throw new AuthorizationError()
  const count = await db.leaderboard.count({ where: { ownerId: userId } })
  if (count >= 15) throw new AuthorizationError()

  const leaderboard = await db.leaderboard.create({
    data: {
      ...cleanProfaneStringDataInObj(data, ["title", "details"]),
      owner: { connect: { id: ownerId } },
    },
  })

  return leaderboard
}
