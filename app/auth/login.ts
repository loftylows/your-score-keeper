import { fireLoginCompletedEvent } from "app/browserEvents"
import loginWithEmailAndPasswordMutation from "./mutations/loginWithEmailAndPassword"
import { LoginInputType } from "./validations"

export const loginWithEmailAndPassword = async (input: LoginInputType) => {
  const user = await loginWithEmailAndPasswordMutation(input)
  setTimeout(() => fireLoginCompletedEvent(user.id), 2000)
}
