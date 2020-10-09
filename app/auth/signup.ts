import { fireSignupCompletedEvent } from "app/browserEvents"
import { cleanProfaneStringDataInObj } from "app/utils/profanityFilter"
import signupWithEmailAndPasswordMutation from "./mutations/signupWithEmailAndPassword"
import { SignupInputType } from "./validations"

export const signupWithEmailAndPassword = async (input: SignupInputType) => {
  const user = await signupWithEmailAndPasswordMutation(
    cleanProfaneStringDataInObj(input, ["name"])
  )
  fireSignupCompletedEvent(user.id)
}
