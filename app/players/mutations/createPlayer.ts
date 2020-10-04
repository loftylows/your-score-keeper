import { SessionContext } from "blitz"
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

  const player = await db.player.create({
    data: { ...data, leaderboard: { connect: { id: leaderboardId } } },
  })

  return player
}
