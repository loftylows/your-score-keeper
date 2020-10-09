import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { LeaderboardCreateArgs } from "db"

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

  const leaderboard = await db.leaderboard.create({
    data: { ...data, owner: { connect: { id: ownerId } } },
  })

  return leaderboard
}
