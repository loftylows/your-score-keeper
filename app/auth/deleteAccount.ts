import { Router } from "blitz"
import { fireAccountDeletedEvent } from "app/browserEvents"
import deleteCurrentUser from "app/users/mutations/deleteCurrentUser"

const deleteAccount = async () => {
  await deleteCurrentUser()
  Router.push("/")
  fireAccountDeletedEvent()
}

export default deleteAccount
