import { SessionContext } from "blitz"
import { UUID } from "common-types"
import db from "db"

type DeleteCurrentUserInput = {}

export default async function deleteUser(
  input: DeleteCurrentUserInput = {},
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const userId: UUID = ctx.session!.userId

  const userLeaderboards = await db.leaderboard.findMany({ where: { ownerId: userId } })
  const deletePlayerPromises = userLeaderboards.map((l) =>
    db.player.deleteMany({ where: { leaderboardId: l.id } })
  )

  await Promise.all(deletePlayerPromises)

  const deleteLeaderboardPromises = userLeaderboards.map((l) =>
    db.leaderboard.delete({ where: { id: l.id } })
  )
  await Promise.all(deleteLeaderboardPromises)

  await ctx.session!.revokeAll()

  const user = await db.user.delete({ where: { id: userId } })

  return user
}
