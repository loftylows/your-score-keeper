import * as React from "react"
import { Box, Button, ButtonGroup, IconButton, Text } from "@chakra-ui/core"
import { EditIcon } from "@chakra-ui/icons"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { uiContext } from "app/leaderboards/UiProvider"

const MyLeaderboardsSidebar = () => {
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { leaderboards: dbLeaderboards, userId } = React.useContext(dbCacheLeaderboardsContext)
  const {
    openCreateLeaderboardDialog,
    openEditLeaderboardDialog,
    setCurrentlySelectedLeaderboardId,
    currentlySelectedLeaderboardId,
  } = React.useContext(uiContext)
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
        return (
          <ButtonGroup
            key={leaderboard.id}
            isAttached
            width="100%"
            colorScheme={currentlySelectedLeaderboardId === leaderboard.id ? "blue" : "gray"}
          >
            <Button
              width="100%"
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              onClick={() => setCurrentlySelectedLeaderboardId(leaderboard.id)}
            >
              <Text isTruncated>{leaderboard.title}</Text>
            </Button>
            <IconButton
              onClick={() => openEditLeaderboardDialog(leaderboard.id)}
              icon={<EditIcon />}
              aria-label="Edit leaderboard"
            />
          </ButtonGroup>
        )
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
