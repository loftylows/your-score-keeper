import * as React from "react"
import { BlitzPage, GetServerSideProps, Link, ssrQuery, useSession } from "blitz"
import { getSessionContext } from "@blitzjs/server"
import Layout from "app/layouts/Site"
import { Box, Button, Heading } from "@chakra-ui/core"
import getLeaderboard from "app/leaderboards/queries/getLeaderboardWithPlayers"
import { Maybe, ThenArgRecursive, UUID } from "common-types"
import LeaderboardTable from "app/leaderboards/components/LeaderboardTable"
import { InMemoryPlayer } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import { isSavedLeaderboard } from "app/leaderboards/typeAssertions"

export type LeaderboardQueryRes = ThenArgRecursive<ReturnType<typeof getLeaderboard>>
interface IProps {
  leaderboard: ThenArgRecursive<ReturnType<typeof getLeaderboard>>
  userId: Maybe<UUID>
}
export const getServerSideProps: GetServerSideProps<IProps> = async ({
  req,
  res: response,
  params,
}) => {
  const { userId } = await getSessionContext(req, response)
  const id: Maybe<string> = typeof params?.id === "string" ? params?.id : null
  let leaderboard: ThenArgRecursive<ReturnType<typeof getLeaderboard>>

  try {
    const queryRes = await ssrQuery(
      getLeaderboard,
      {
        where: {
          id: id || undefined,
        },
      },
      { req, res: response }
    )
    leaderboard = queryRes
  } catch (e) {
    console.log(e)
    throw e
  }

  return {
    props: {
      leaderboard,
      userId: userId || null,
    },
  }
}

const LeaderboardPage: BlitzPage<IProps> = ({ leaderboard, userId: userIdFromServer }: IProps) => {
  const { userId: sessionUserId, isLoading: isLoadingSessionUserId } = useSession()
  const userId = isLoadingSessionUserId ? userIdFromServer : sessionUserId
  const isLeaderboardOwner = isSavedLeaderboard(leaderboard)
    ? leaderboard.ownerId === userId
    : false
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={{ base: "30px 10px", md: "40px 20px" }}
    >
      <Heading size="xl" marginBottom="30px">
        {leaderboard.title}
        {isLeaderboardOwner ? (
          <Link href={`/my-leaderboards?id=${leaderboard.id}`} passHref>
            <Button marginLeft="10px" colorScheme="green" size="sm" as="a">
              Edit Leaderboard
            </Button>
          </Link>
        ) : null}
      </Heading>
      <LeaderboardTable
        isReadOnly
        userId={userId}
        leaderboard={leaderboard}
        players={leaderboard.players as InMemoryPlayer[]}
      />
    </Box>
  )
}

LeaderboardPage.getLayout = (page) => <Layout title="YourScoreKeeper">{page}</Layout>

export default LeaderboardPage
