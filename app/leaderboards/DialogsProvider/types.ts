import { UUID } from "common-types"

export type OpenCreateLeaderboardDialog = () => void
export type CloseCreateLeaderboardDialog = () => void
export type OpenEditLeaderboardDialog = (leaderboardId: UUID) => void
export type CloseEditLeaderboardDialog = () => void
export type OpenCreatePlayerDialog = () => void
export type CloseCreatePlayerDialog = () => void
export type OpenEditPlayerDialog = (playerId: UUID) => void
export type CloseEditPlayerDialog = () => void
