import { AuthorizationError, SessionContext } from "blitz"
import { UUID } from "common-types"
import db, { UserUpdateArgs } from "db"
import { trimAndLowercaseStringValsInObject } from "utils/string"

type UpdateUserInput = {
  where: UserUpdateArgs["where"]
  data: UserUpdateArgs["data"]
}

export default async function updateUser(
  { where, data }: UpdateUserInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()
  const userId: UUID = ctx.session!.userId

  if (where.id !== userId) throw new AuthorizationError()

  const user = await db.user.update({
    where,
    data: trimAndLowercaseStringValsInObject(data, ["username"]),
  })

  return user
}
