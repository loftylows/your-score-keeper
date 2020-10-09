import {
  InMemoryLeaderboard,
  InMemoryPlayer,
} from "app/leaderboards/InMemoryLeaderboardsProvider/types"
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

export const SHOULD_SAVE_LEADERBOARDS_FROM_MEMORY_TO_DB_NAME = "shouldSaveInMemoryLeaderboards"
export const fireShouldSaveLeaderboardsFromMemoryToDbEvent = (
  userId: UUID,
  leaderboards: InMemoryLeaderboard[],
  players: InMemoryPlayer[],
  onFinished?: Function
) => {
  const event = new CustomEvent(SHOULD_SAVE_LEADERBOARDS_FROM_MEMORY_TO_DB_NAME, {
    detail: { userId, leaderboards, players, onFinished },
  })
  if (typeof window === "undefined") return
  window.dispatchEvent(event)
}
