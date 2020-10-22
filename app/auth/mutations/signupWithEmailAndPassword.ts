import db from "db"
import { SessionContext, AuthorizationError } from "blitz"
import MailChecker from "mailchecker"
import { hashPassword } from "app/auth/auth-utils"
import { SignupInput, SignupInputType } from "app/auth/validations"
// import filter from "app/utils/profanityFilter"

export default async function signup(
  input: SignupInputType,
  ctx: { session?: SessionContext } = {}
) {
  // This throws an error if input is invalid
  const { username, email, password } = SignupInput.parse(input)

  if (ctx.session!.userId) throw new AuthorizationError()
  if (!MailChecker.isValid(email)) throw new AuthorizationError()

  const hashedPassword = await hashPassword(password)
  const trimmedUsername = username.toLowerCase().trim()
  // const cleanedName = filter.clean(username.toLowerCase().trim())

  const user = await db.user.create({
    data: {
      username: trimmedUsername,
      email: email.trim().toLowerCase(),
      hashedPassword,
      role: "user",
    },
    select: { id: true, username: true, email: true, role: true },
  })

  await ctx.session!.create({ userId: user.id, roles: [user.role] })

  return user
}
