import { fireSignupCompletedEvent } from "app/browserEvents"
import signupWithEmailAndPasswordMutation from "./mutations/signupWithEmailAndPassword"
import { SignupInputType } from "./validations"

export const signupWithEmailAndPassword = async (input: SignupInputType) => {
  const user = await signupWithEmailAndPasswordMutation(input)
  fireSignupCompletedEvent(user.id)
}
