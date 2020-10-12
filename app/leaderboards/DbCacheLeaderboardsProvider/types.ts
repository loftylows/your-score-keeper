import { Leaderboard, LeaderboardCreateInput, Player, PlayerCreateInput } from "@prisma/client"
import { UUID } from "common-types"
import { InMemoryLeaderboard, InMemoryPlayer } from "../InMemoryLeaderboardsProvider/types"

export type DbCacheCreateLeaderboard = (input: LeaderboardCreateInput) => Promise<void>
export type DbCacheEditLeaderboard = (leaderboard: Omit<Leaderboard, "ownerId">) => Promise<void>
export type DbCachePublishLeaderboard = (leaderboardId: UUID) => Promise<void>
export type DbCacheUnpublishLeaderboard = (leaderboardId: UUID) => Promise<void>
export type DbCacheDeleteLeaderboard = (id: UUID) => Promise<void>

export type DbCacheCreatePlayer = (leaderboardId: UUID, input: PlayerCreateInput) => Promise<void>
export type DbCacheEditPlayer = (player: Player) => Promise<void>
export type DbCacheDeletePlayer = (id: UUID, leaderboardId: UUID) => Promise<void>

export type FlushDbCacheLeaderboards = () => void
export type LoadDbCacheLeaderboards = (userId: UUID) => Promise<void>
export type SetDbCacheLeaderboards = (
  usrId: UUID,
  leaderboards: Leaderboard[],
  players: Player[]
) => void
export type SaveLeaderboardsFromMemoryToDb = (
  userId: UUID,
  leaderboards: InMemoryLeaderboard[],
  players: InMemoryPlayer[]
) => Promise<void>
