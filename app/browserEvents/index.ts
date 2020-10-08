import { UUID } from "common-types"

export interface AuthEventDetails {
  userId: UUID
}
export const LOGIN_COMPLETED_EVENT_NAME = "loginCompleted"
export const fireLoginCompletedEvent = (userId: UUID) => {
  const event = new CustomEvent(LOGIN_COMPLETED_EVENT_NAME, { detail: { userId } })
  if (typeof window === "undefined") return
  window.dispatchEvent(event)
}

export const SIGNUP_COMPLETED_EVENT_NAME = "signupCompleted"
export const fireSignupCompletedEvent = (userId: UUID) => {
  const event = new CustomEvent(SIGNUP_COMPLETED_EVENT_NAME, { detail: { userId } })
  if (typeof window === "undefined") return
  window.dispatchEvent(event)
}

export const LOGOUT_EVENT_NAME = "signupCompleted"
export const fireLogoutEvent = () => {
  const event = new Event(LOGOUT_EVENT_NAME)
  if (typeof window === "undefined") return
  window.dispatchEvent(event)
}
