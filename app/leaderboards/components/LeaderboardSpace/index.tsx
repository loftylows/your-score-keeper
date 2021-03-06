import * as React from "react"
import { Box, VStack, Heading, ButtonGroup, Button, HStack } from "@chakra-ui/core"
import useCurrentlySelectedLeaderboard from "app/leaderboards/hooks/useCurrentlySelectedLeaderboard"
import CreatePlayerForm from "../forms/CreatePlayerForm"
import useCurrentlySelectedLeaderboardPlayers from "app/leaderboards/hooks/useCurrentPlayers"
import { InMemoryPlayer } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import LeaderboardTable from "../LeaderboardTable"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { authModalContext } from "app/auth/AuthModalProvider"
import { Leaderboard } from "@prisma/client"
import { uiContext } from "app/leaderboards/LeaderboardsUiProvider"
import { Link } from "blitz"
import { lighten } from "polished"
import Share from "app/components/Share"
import getLeaderboardShareUrl from "app/leaderboards/getLeaderboardShareUrl"

const minWidth = "320px"

const LeaderboardsSpace = () => {
  const {
    setPublishingLeaderboardWithId,
    setUnpublishingLeaderboardWithId,
    openCreateLeaderboardDialog,
  } = React.useContext(uiContext)
  const leaderboard = useCurrentlySelectedLeaderboard()
  const players = useCurrentlySelectedLeaderboardPlayers()
  const { openAuthModal } = React.useContext(authModalContext)
  const { userId, leaderboards: dbLeaderboards } = React.useContext(dbCacheLeaderboardsContext)
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const shareUrl = leaderboard ? getLeaderboardShareUrl(leaderboard.id) : null

  if (!leaderboard && ![...inMemoryLeaderboards, ...dbLeaderboards].length) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        margin="30px 20px"
        width="100%"
        height={{ base: "160px", md: "170px" }}
        fontWeight="bold"
        borderRadius="10px"
        border={`1px solid ${lighten(0.2, "#4C7BF4")}`}
        backgroundColor={`${lighten(0.35, "#4C7BF4")}`}
      >
        <Heading size="lg">No leaderboard here.</Heading>
        <Heading size="lg">Try creating one.</Heading>
        <Button colorScheme="blue" marginTop="15px" onClick={openCreateLeaderboardDialog}>
          Create Leaderboard
        </Button>
      </Box>
    )
  } else if (!leaderboard) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        margin="30px 20px"
        width="100%"
        height={{ base: "160px", md: "170px" }}
        fontWeight="bold"
        borderRadius="10px"
        border={`1px solid ${lighten(0.2, "#4C7BF4")}`}
        backgroundColor={`${lighten(0.35, "#4C7BF4")}`}
      >
        <Heading size="lg">No leaderboard found.</Heading>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      padding={{ base: "15px 10px", sm: "30px" }}
      width="100%"
      minWidth={minWidth}
      height="calc(100vh - 64px)"
      overflow="scroll"
    >
      {!userId && inMemoryLeaderboards.length && (
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          justifyContent="center"
          alignItems="center"
          marginBottom="25px"
          padding="10px"
          width="100%"
          backgroundColor="red.500"
          color="white"
          fontWeight="bold"
          borderRadius="10px"
        >
          Log in to save and publish your leaderboards:
          <ButtonGroup
            spacing={3}
            marginLeft={{ base: "0px", md: "8px" }}
            marginTop={{ base: "10px", md: 0 }}
            size="xs"
          >
            <Button colorScheme="blue" onClick={() => openAuthModal({ type: "signup" })}>
              Sign Up
            </Button>
            <Button
              backgroundColor="gray.600"
              _hover={{ backgroundColor: "gray.700" }}
              onClick={() => openAuthModal({ type: "login" })}
            >
              Log In
            </Button>
          </ButtonGroup>
        </Box>
      )}

      {userId && !(leaderboard as Leaderboard).published && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginBottom="25px"
          padding="10px"
          width="100%"
          backgroundColor="orange.500"
          color="white"
          fontWeight="bold"
          borderRadius="10px"
        >
          Publish this leaderboard to make it public and shareable:
          <ButtonGroup spacing={3} marginLeft="8px" size="xs">
            <Button
              colorScheme="green"
              onClick={() => setPublishingLeaderboardWithId(leaderboard.id)}
            >
              Publish
            </Button>
          </ButtonGroup>
        </Box>
      )}

      {userId && (leaderboard as Leaderboard).published && (
        <>
          {shareUrl && (
            <Share shareUrl={shareUrl} shareTitle={`${leaderboard.title} Leaderboard`} />
          )}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginBottom="25px"
            padding="10px"
            width="100%"
            backgroundColor="green.300"
            color="white"
            fontWeight="bold"
            borderRadius="10px"
          >
            <Box>
              This leaderboard is currently{" "}
              <Link href={`/leaderboards/${leaderboard.id}`} passHref>
                <Box as="a" textDecoration="underline">
                  published
                </Box>
              </Link>
              . All changes made will be publicly visible:
            </Box>
            <ButtonGroup spacing={3} marginLeft="8px" size="xs">
              <Button
                colorScheme="orange"
                onClick={() => setUnpublishingLeaderboardWithId(leaderboard.id)}
              >
                Unpublish
              </Button>
            </ButtonGroup>
          </Box>
        </>
      )}

      <Heading marginBottom="15px">{leaderboard.title}</Heading>
      <CreatePlayerForm leaderboardId={leaderboard.id} playersCount={players.length} />

      <Box paddingBottom="64px">
        <LeaderboardTable
          players={players as InMemoryPlayer[]}
          leaderboard={leaderboard}
          userId={userId}
        />
      </Box>
    </Box>
  )
}

export default LeaderboardsSpace
