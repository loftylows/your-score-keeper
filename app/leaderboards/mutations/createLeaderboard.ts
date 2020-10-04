import { SessionContext } from "blitz"
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

  const leaderboard = await db.leaderboard.create({
    data: { ...data, owner: { connect: { id: ownerId } } },
  })

  return leaderboard
}
