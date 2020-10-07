import { Leaderboard, LeaderboardCreateInput, Player, PlayerCreateInput } from "@prisma/client"
import { UUID } from "common-types"

export type DbCacheCreateLeaderboard = (input: LeaderboardCreateInput) => Promise<void>
export type DbCacheEditLeaderboard = (leaderboard: Leaderboard) => Promise<void>
export type DbCacheDeleteLeaderboard = (id: UUID) => Promise<void>

export type DbCacheCreatePlayer = (leaderboardId: UUID, input: PlayerCreateInput) => Promise<void>
export type DbCacheEditPlayer = (player: Player) => Promise<void>
export type DbCacheDeletePlayer = (id: UUID) => Promise<void>

export type FlushDbCacheLeaderboards = () => void
export type LoadDbCacheLeaderboards = (userId: UUID) => Promise<void>
export type SetDbCacheLeaderboards = (usrId: UUID, leaderboards: Leaderboard[]) => void
