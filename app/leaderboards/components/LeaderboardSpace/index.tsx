import * as React from "react"
import { Box } from "@chakra-ui/core"
import useCurrentlySelectedLeaderboard from "app/leaderboards/hooks/useCurrentlySelectedLeaderboard"
import CreatePlayerForm from "../forms/CreatePlayerForm"

const LeaderboardsSpace = () => {
  const leaderboard = useCurrentlySelectedLeaderboard()

  if (!leaderboard) return null

  return (
    <Box display="flex" flexDirection="column" padding={{ base: "10px", sm: "30px" }} width="100%">
      <CreatePlayerForm leaderboardId={leaderboard.id} />
    </Box>
  )
}

export default LeaderboardsSpace
