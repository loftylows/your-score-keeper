import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { PlayerDeleteArgs } from "db"

type DeletePlayerInput = {
  where: PlayerDeleteArgs["where"]
  leaderboardId: UUID
}

export default async function deletePlayer(
  { where, leaderboardId }: DeletePlayerInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const userId: UUID = ctx.session!.userId

  const leaderboard = await db.leaderboard.findOne({ where: { id: leaderboardId } })

  if (leaderboard?.ownerId !== userId) throw new AuthorizationError()

  const player = await db.player.delete({ where })

  return player
}
