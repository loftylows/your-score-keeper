import { UUID } from "common-types"

export interface AuthEventDetails {
  userId: UUID
}
export const LOGIN_COMPLETED_EVENT_NAME = "loginCompleted"
export const fireLoginCompletedEvent = (userId: UUID) =>
  new CustomEvent(LOGIN_COMPLETED_EVENT_NAME, { detail: { userId } })
export const SIGNUP_COMPLETED_EVENT_NAME = "signupCompleted"
export const fireSignupCompletedEvent = (userId: UUID) =>
  new CustomEvent(SIGNUP_COMPLETED_EVENT_NAME, { detail: { userId } })
export const LOGOUT_EVENT_NAME = "signupCompleted"
export const fireLogoutEvent = () => new Event(LOGOUT_EVENT_NAME)
