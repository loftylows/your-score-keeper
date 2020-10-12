import { LeaderboardPlayersScoreSortDirection } from "@prisma/client"
import { UUID } from "common-types"

export interface InMemoryLeaderboard {
  id: UUID
  title: string
  playersScoreSortDirection: LeaderboardPlayersScoreSortDirection
}

export interface InMemoryLeaderboardCreateInput {
  title: string
  playersScoreSortDirection: LeaderboardPlayersScoreSortDirection
}

export type InMemoryCreateLeaderboard = (input: InMemoryLeaderboardCreateInput) => void
export type InMemoryEditLeaderboard = (leaderboard: InMemoryLeaderboard) => void
export type InMemoryDeleteLeaderboard = (id: UUID) => void

export interface InMemoryPlayer {
  id: UUID
  name: string
  score: number
  details?: string
  leaderboardId: UUID
}

export interface InMemoryPlayerCreateInput {
  name: string
  score: number
  details?: string
  leaderboardId: UUID
}

export type InMemoryCreatePlayer = (leaderboardId: UUID, input: InMemoryPlayerCreateInput) => void
export type InMemoryEditPlayer = (player: InMemoryPlayer) => void
export type InMemoryDeletePlayer = (id: UUID) => void

export type FlushInMemoryLeaderboards = () => void
