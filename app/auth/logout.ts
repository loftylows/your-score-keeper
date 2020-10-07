import { fireLogoutEvent } from "app/browserEvents"
import logoutMutation from "./mutations/logout"

const logout = async () => {
  await logoutMutation()
  fireLogoutEvent()
}

export default logout
