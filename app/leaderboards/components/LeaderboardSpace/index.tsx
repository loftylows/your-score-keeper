import * as React from "react"
import { Box } from "@chakra-ui/core"
import useCurrentlySelectedLeaderboard from "app/leaderboards/hooks/useCurrentlySelectedLeaderboard"

const LeaderboardsSpace = () => {
  const currentlySelectedLeaderboard = useCurrentlySelectedLeaderboard()

  if (!currentlySelectedLeaderboard) return null
  const leaderboard = currentlySelectedLeaderboard
  return <Box>{leaderboard.title}</Box>
}

export default LeaderboardsSpace
