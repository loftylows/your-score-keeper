import { User } from "@prisma/client"

export const LOGIN_COMPLETED_EVENT_NAME = "loginCompleted"
export const fireLoginCompletedEvent = () => new Event(LOGIN_COMPLETED_EVENT_NAME)
export const SIGNUP_COMPLETED_EVENT_NAME = "signupCompleted"
export const fireSignupCompletedEvent = () => new Event(SIGNUP_COMPLETED_EVENT_NAME)
export const LOGOUT_EVENT_NAME = "signupCompleted"
export const fireLogoutEvent = () => new Event(LOGOUT_EVENT_NAME)
