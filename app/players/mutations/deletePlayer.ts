import { SessionContext } from "blitz"
import db, { PlayerDeleteArgs } from "db"

type DeletePlayerInput = {
  where: PlayerDeleteArgs["where"]
}

export default async function deletePlayer(
  { where }: DeletePlayerInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const player = await db.player.delete({ where })

  return player
}
