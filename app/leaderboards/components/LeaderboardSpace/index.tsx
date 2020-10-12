import * as React from "react"
import { Box, VStack, Heading, ButtonGroup, Button } from "@chakra-ui/core"
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

const LeaderboardsSpace = () => {
  const { setPublishingLeaderboardWithId, setUnpublishingLeaderboardWithId } = React.useContext(
    uiContext
  )
  const leaderboard = useCurrentlySelectedLeaderboard()
  const players = useCurrentlySelectedLeaderboardPlayers()
  const { openAuthModal } = React.useContext(authModalContext)
  const { userId } = React.useContext(dbCacheLeaderboardsContext)
  const { leaderboards } = React.useContext(inMemoryLeaderboardsContext)

  if (!leaderboard) return null

  return (
    <Box
      display="flex"
      flexDirection="column"
      padding={{ base: "10px", sm: "30px" }}
      width="100%"
      height="calc(100vh - 64px)"
      overflow="scroll"
    >
      {!userId && leaderboards.length && (
        <Box
          display="flex"
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
          <ButtonGroup spacing={3} marginLeft="8px" size="xs">
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
      )}

      <Heading marginBottom="15px">{leaderboard.title}</Heading>
      <CreatePlayerForm leaderboardId={leaderboard.id} playersCount={players.length} />

      <VStack spacing={4}>
        <LeaderboardTable
          players={players as InMemoryPlayer[]}
          leaderboard={leaderboard}
          userId={userId}
        />
      </VStack>
    </Box>
  )
}

export default LeaderboardsSpace
