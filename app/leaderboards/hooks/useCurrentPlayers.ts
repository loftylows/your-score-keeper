import * as React from "react"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { Player } from "@prisma/client"
import { InMemoryPlayer } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import useCurrentlySelectedLeaderboard from "./useCurrentlySelectedLeaderboard"

const useCurrentlySelectedLeaderboardPlayers = (): InMemoryPlayer[] | Player[] => {
  const { players: inMemoryPlayers } = React.useContext(inMemoryLeaderboardsContext)
  const { players: dbPlayers, userId } = React.useContext(dbCacheLeaderboardsContext)
  const leaderboard = useCurrentlySelectedLeaderboard()
  const allPlayers = userId ? dbPlayers : inMemoryPlayers

  if (userId) {
    const x = allPlayers as Player[]
    return leaderboard ? x.filter((p) => p.leaderboardId === leaderboard.id) : []
  } else {
    const x = allPlayers as InMemoryPlayer[]
    return leaderboard ? x.filter((p) => p.leaderboardId === leaderboard.id) : []
  }
}

export default useCurrentlySelectedLeaderboardPlayers
