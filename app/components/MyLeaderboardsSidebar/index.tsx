import * as React from "react"
import { Box, Button, ButtonGroup, IconButton, Text } from "@chakra-ui/core"
import { EditIcon, HamburgerIcon } from "@chakra-ui/icons"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { uiContext } from "app/leaderboards/UiProvider"
import useCurrentlySelectedLeaderboard from "app/leaderboards/hooks/useCurrentlySelectedLeaderboard"

const MyLeaderboardsSidebar = () => {
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { leaderboards: dbLeaderboards, userId } = React.useContext(dbCacheLeaderboardsContext)
  const currentlySelectedLeaderboard = useCurrentlySelectedLeaderboard()
  const {
    openCreateLeaderboardDialog,
    openEditLeaderboardDialog,
    setCurrentlySelectedLeaderboardId,
  } = React.useContext(uiContext)

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      height="calc(100vh - 64px)"
      overflow="scroll"
      backgroundColor="gray.200"
      width={{ base: "190px", md: "230px" }}
      minWidth={{ base: "190px", md: "230px" }}
    >
      {(userId ? dbLeaderboards : inMemoryLeaderboards).map((leaderboard) => {
        return (
          <ButtonGroup
            key={leaderboard.id}
            isAttached
            width="100%"
            borderRadius="0"
            colorScheme={
              currentlySelectedLeaderboard && currentlySelectedLeaderboard.id === leaderboard.id
                ? "blue"
                : "gray"
            }
          >
            <Button
              width="100%"
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              borderRadius="0"
              _focus={{
                outline: "none",
              }}
              onClick={() => setCurrentlySelectedLeaderboardId(leaderboard.id)}
            >
              <HamburgerIcon marginRight="5px" />
              <Text title={leaderboard.title} isTruncated>
                {leaderboard.title}
              </Text>
            </Button>
            <IconButton
              onClick={() => openEditLeaderboardDialog(leaderboard.id)}
              icon={<EditIcon />}
              title="Edit leaderboard"
              aria-label="Edit leaderboard"
              borderRadius="0"
              _focus={{
                outline: "none",
              }}
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
        position="absolute"
        bottom="0"
        zIndex="1"
        borderTop="1px solid rgba(0,0,0,.03)"
        onClick={openCreateLeaderboardDialog}
      >
        Add Leaderboard
      </Button>
    </Box>
  )
}

export default MyLeaderboardsSidebar