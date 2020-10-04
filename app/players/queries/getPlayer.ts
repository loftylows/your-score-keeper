import { NotFoundError, SessionContext } from "blitz"
import db, { FindOnePlayerArgs } from "db"

type GetPlayerInput = {
  where: FindOnePlayerArgs["where"]
  // Only available if a model relationship exists
  // include?: FindOnePlayerArgs['include']
}

export default async function getPlayer(
  { where /* include */ }: GetPlayerInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const player = await db.player.findOne({ where })

  if (!player) throw new NotFoundError()

  return player
}
