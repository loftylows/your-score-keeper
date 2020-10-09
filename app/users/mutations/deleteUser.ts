import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { UserDeleteArgs } from "db"

type DeleteUserInput = {
  where: UserDeleteArgs["where"]
}

export default async function deleteUser(
  { where }: DeleteUserInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const userId: UUID = ctx.session!.userId

  if (where.id !== userId) throw new AuthorizationError()
  const userLeaderboards = await db.leaderboard.findMany({ where: { ownerId: userId } })
  const deletePlayerPromises = userLeaderboards.map((l) =>
    db.player.deleteMany({ where: { leaderboardId: l.id } })
  )

  await Promise.all(deletePlayerPromises)

  const deleteLeaderboardPromises = userLeaderboards.map((l) =>
    db.leaderboard.delete({ where: { id: l.id } })
  )
  await Promise.all(deleteLeaderboardPromises)

  const user = await db.user.delete({ where })

  return user
}
