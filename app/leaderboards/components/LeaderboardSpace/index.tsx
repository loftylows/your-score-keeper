import * as React from "react"
import { Box, VStack } from "@chakra-ui/core"
import useCurrentlySelectedLeaderboard from "app/leaderboards/hooks/useCurrentlySelectedLeaderboard"
import CreatePlayerForm from "../forms/CreatePlayerForm"
import useCurrentlySelectedLeaderboardPlayers from "app/leaderboards/hooks/useCurrentPlayers"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { Player } from "@prisma/client"
import { InMemoryPlayer } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import LeaderboardTable from "../LeaderboardTable"

const LeaderboardsSpace = () => {
  const leaderboard = useCurrentlySelectedLeaderboard()
  const players = useCurrentlySelectedLeaderboardPlayers()
  const { userId } = React.useContext(dbCacheLeaderboardsContext)

  if (!leaderboard) return null

  return (
    <Box display="flex" flexDirection="column" padding={{ base: "10px", sm: "30px" }} width="100%">
      <CreatePlayerForm leaderboardId={leaderboard.id} />

      <VStack spacing={4}>
        <LeaderboardTable players={players as InMemoryPlayer[]} leaderboard={leaderboard} />
      </VStack>
    </Box>
  )
}

export default LeaderboardsSpace
