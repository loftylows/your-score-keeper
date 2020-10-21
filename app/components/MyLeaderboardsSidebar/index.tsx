import * as React from "react"
import { Box, Button, ButtonGroup, IconButton, Text } from "@chakra-ui/core"
import { EditIcon, HamburgerIcon, WarningIcon } from "@chakra-ui/icons"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { uiContext } from "app/leaderboards/LeaderboardsUiProvider"
import useCurrentlySelectedLeaderboard from "app/leaderboards/hooks/useCurrentlySelectedLeaderboard"
import { Router } from "blitz"
import { isSavedLeaderboard } from "app/leaderboards/typeAssertions"

interface IProps {
  inDrawer?: boolean
}
const MyLeaderboardsSidebar = ({ inDrawer }: IProps) => {
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { leaderboards: dbLeaderboards, userId } = React.useContext(dbCacheLeaderboardsContext)
  const currentlySelectedLeaderboard = useCurrentlySelectedLeaderboard()
  const {
    openCreateLeaderboardDialog,
    openEditLeaderboardDialog,
    setCurrentlySelectedLeaderboardId,
  } = React.useContext(uiContext)

  const leaderboardsCount = dbLeaderboards.length + inMemoryLeaderboards.length
  const atMaxLeaderboards = leaderboardsCount >= 15

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      height={inDrawer ? "100vh" : "calc(100vh - 64px)"}
      overflow="scroll"
      backgroundColor="gray.200"
      width={{ base: inDrawer ? "100%" : "230px" }}
      minWidth={{ base: "230px" }}
    >
      {(userId ? dbLeaderboards : inMemoryLeaderboards).map((leaderboard) => {
        const isCurrentLeaderboard =
          currentlySelectedLeaderboard && currentlySelectedLeaderboard.id === leaderboard.id
        return (
          <ButtonGroup
            key={leaderboard.id}
            isAttached
            width="100%"
            borderRadius="0"
            height="40px"
            minHeight="40px"
            colorScheme={isCurrentLeaderboard ? "blue" : "gray"}
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
              onClick={() => {
                setCurrentlySelectedLeaderboardId(leaderboard.id)
                Router.push(
                  isSavedLeaderboard(leaderboard)
                    ? `/my-leaderboards?id=${leaderboard.id}`
                    : "/my-leaderboards"
                )
              }}
            >
              {!(leaderboard as any).published ? (
                <WarningIcon
                  marginRight="5px"
                  color={isCurrentLeaderboard ? "orange.400" : "orange.500"}
                />
              ) : (
                <HamburgerIcon marginRight="5px" />
              )}
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
        position="sticky"
        marginTop={leaderboardsCount ? "auto" : "0"}
        width="100%"
        height="40px"
        minHeight={leaderboardsCount ? "40px" : "50px"}
        colorScheme="gray"
        border="none"
        borderRadius="0"
        boxShadow={leaderboardsCount ? "lg" : "xs"}
        bottom="0"
        left="0"
        zIndex="1"
        borderTop="1px solid rgba(0,0,0,.03)"
        onClick={openCreateLeaderboardDialog}
        disabled={atMaxLeaderboards}
        isDisabled={atMaxLeaderboards}
        backgroundColor={atMaxLeaderboards ? "#f5f5dc" : "gray"}
        opacity="1 !important"
      >
        {atMaxLeaderboards ? "15 Leaderboards Max" : "Add Leaderboard"}
      </Button>
    </Box>
  )
}

export default MyLeaderboardsSidebar
