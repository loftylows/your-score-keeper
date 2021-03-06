import { cleanProfaneStringDataInObj } from "app/utils/profanityFilter"
import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { PlayerUpdateArgs } from "db"

type UpdatePlayerInput = {
  where: PlayerUpdateArgs["where"]
  data: Omit<PlayerUpdateArgs["data"], "leaderboard">
  leaderboardId: string
}

export default async function updatePlayer(
  { where, data, leaderboardId }: UpdatePlayerInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const userId: UUID = ctx.session!.userId

  const leaderboard = await db.leaderboard.findOne({ where: { id: leaderboardId } })

  if (leaderboard?.ownerId !== userId) throw new AuthorizationError()

  // Don't allow updating
  delete (data as any).leaderboard
  delete (data as any).leaderboardId
  delete (data as any).createdAt
  delete (data as any).updateAt
  delete (data as any).id

  const player = await db.player.update({
    where,
    data: cleanProfaneStringDataInObj(data, ["name", "details"]),
  })

  return player
}
