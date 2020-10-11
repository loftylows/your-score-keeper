import * as React from "react"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { uiContext } from "app/leaderboards/LeaderboardsUiProvider"
import { Leaderboard } from "@prisma/client"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import { Maybe } from "common-types"

const useCurrentlySelectedLeaderboard = (): Maybe<InMemoryLeaderboard | Leaderboard> => {
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { leaderboards: dbLeaderboards, userId } = React.useContext(dbCacheLeaderboardsContext)
  const { currentlySelectedLeaderboardId } = React.useContext(uiContext)

  const leaderboards: Leaderboard[] | InMemoryLeaderboard[] = userId
    ? dbLeaderboards
    : inMemoryLeaderboards
  const currentlySelectedLeaderboard: Maybe<
    Leaderboard | InMemoryLeaderboard
  > = currentlySelectedLeaderboardId
    ? leaderboards.find((l) => l.id === currentlySelectedLeaderboardId) || null
    : leaderboards.length
    ? leaderboards[0]
    : null

  return currentlySelectedLeaderboard
}

export default useCurrentlySelectedLeaderboard
