import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { PlayerCreateArgs } from "db"

type CreatePlayerInput = {
  data: Omit<PlayerCreateArgs["data"], "leaderboard">
  leaderboardId: string
}
export default async function createPlayer(
  { data, leaderboardId }: CreatePlayerInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const userId: UUID = ctx.session!.userId

  const leaderboard = await db.leaderboard.findOne({ where: { id: leaderboardId } })

  if (leaderboard?.ownerId !== userId) throw new AuthorizationError()

  const player = await db.player.create({
    data: { ...data, leaderboard: { connect: { id: leaderboardId } } },
  })

  return player
}
