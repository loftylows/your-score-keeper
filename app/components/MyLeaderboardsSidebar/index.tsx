import * as React from "react"
import { Box, Button } from "@chakra-ui/core"
import { Leaderboard } from "@prisma/client"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { dialogsContext } from "app/leaderboards/DialogsProvider"

const MyLeaderboardsSidebar = () => {
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { leaderboards: dbLeaderboards, userId } = React.useContext(dbCacheLeaderboardsContext)
  const { openCreateLeaderboardDialog } = React.useContext(dialogsContext)
  return (
    <Box
      display="flex"
      flexDirection="column"
      height="calc(100vh - 64px)"
      overflow="scroll"
      backgroundColor="sidebar"
      width={{ base: "190px", md: "230px" }}
      minWidth={{ base: "190px", md: "230px" }}
    >
      {(userId ? dbLeaderboards : inMemoryLeaderboards).map((leaderboard) => {
        return <Button key={leaderboard.id}>{leaderboard.title}</Button>
      })}
      <Button
        marginTop="auto"
        width="100%"
        height="38px"
        minHeight="38px"
        colorScheme="gray"
        border="none"
        borderRadius="0"
        boxShadow="lg"
        onClick={openCreateLeaderboardDialog}
      >
        Add Leaderboard
      </Button>
    </Box>
  )
}

export default MyLeaderboardsSidebar
