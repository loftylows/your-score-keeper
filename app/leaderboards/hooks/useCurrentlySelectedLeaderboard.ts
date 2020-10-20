import * as React from "react"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { uiContext } from "app/leaderboards/LeaderboardsUiProvider"
import { Leaderboard } from "@prisma/client"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import { Maybe } from "common-types"
import { useQuery, useRouterQuery } from "blitz"

const useCurrentlySelectedLeaderboard = (): Maybe<InMemoryLeaderboard | Leaderboard> => {
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { leaderboards: dbLeaderboards, userId } = React.useContext(dbCacheLeaderboardsContext)
  const { currentlySelectedLeaderboardId: selectedIdFromUi } = React.useContext(uiContext)
  const { id } = useRouterQuery()
  const hasIdInQuery = typeof id === "string"
  const currentlySelectedLeaderboardId = hasIdInQuery ? id : selectedIdFromUi

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
