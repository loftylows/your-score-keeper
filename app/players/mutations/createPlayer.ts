import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { PlayerCreateArgs } from "db"
import { cleanProfaneStringDataInObj } from "app/utils/profanityFilter"

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
    data: {
      ...cleanProfaneStringDataInObj(data, ["name", "details"]),
      leaderboard: { connect: { id: leaderboardId } },
    },
  })

  return player
}
