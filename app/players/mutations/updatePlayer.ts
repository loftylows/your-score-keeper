import { SessionContext } from "blitz"
import db, { PlayerUpdateArgs } from "db"

type UpdatePlayerInput = {
  where: PlayerUpdateArgs["where"]
  data: Omit<PlayerUpdateArgs["data"], "leaderboard">
  leaderboardId: string
}

export default async function updatePlayer(
  { where, data }: UpdatePlayerInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  // Don't allow updating
  delete (data as any).leaderboard

  const player = await db.player.update({ where, data })

  return player
}
