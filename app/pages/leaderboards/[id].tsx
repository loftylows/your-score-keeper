import * as React from "react"
import { BlitzPage, GetServerSideProps, Link, ssrQuery, useSession } from "blitz"
import { getSessionContext } from "@blitzjs/server"
import Layout from "app/layouts/Site"
import { Box, Button, Heading } from "@chakra-ui/core"
import getLeaderboard from "app/leaderboards/queries/getLeaderboardWithPlayers"
import { ErrorFromServerSideProps, Maybe, ThenArgRecursive, UUID } from "common-types"
import LeaderboardTable from "app/leaderboards/components/LeaderboardTable"
import { InMemoryPlayer } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import { isSavedLeaderboard } from "app/leaderboards/typeAssertions"
import PageMeta from "app/components/PageMeta"
import Share from "app/components/Share"
import getLeaderboardShareUrl from "app/leaderboards/getLeaderboardShareUrl"

export type LeaderboardQueryRes = ThenArgRecursive<ReturnType<typeof getLeaderboard>>
interface IProps {
  leaderboard: Maybe<ThenArgRecursive<ReturnType<typeof getLeaderboard>>>
  userId: Maybe<UUID>
  error?: ErrorFromServerSideProps
  shareUrl: string
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
    if (e.name === "NotFoundError") {
      // Handle this error appropriately, like show a login screen
      response.statusCode = e.statusCode
      return {
        props: {
          leaderboard: null,
          userId: null,
          error: { name: e.name, statusCode: e.statusCode, message: "Leaderboard Not Found" },
          shareUrl: "",
        },
      }
    } else if (e.name === "AuthorizationError") {
      response.statusCode = e.statusCode
      return {
        props: {
          leaderboard: null,
          userId: null,
          error: { name: e.name, statusCode: e.statusCode },
          shareUrl: "",
        },
      }
    } else {
      response.statusCode = e.statusCode || 500
      return {
        props: {
          leaderboard: null,
          userId: null,
          error: { name: e.name, statusCode: e.statusCode },
          shareUrl: "",
        },
      }
    }
  }

  return {
    props: {
      leaderboard,
      userId: userId || null,
      shareUrl: getLeaderboardShareUrl(leaderboard?.id || ""),
    },
  }
}

const LeaderboardPage: BlitzPage<IProps> = ({
  leaderboard,
  userId: userIdFromServer,
  shareUrl,
}: IProps) => {
  const { userId: sessionUserId, isLoading: isLoadingSessionUserId } = useSession()
  const userId = isLoadingSessionUserId ? userIdFromServer : sessionUserId

  if (!leaderboard) return null

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
      <Share
        shareUrl={shareUrl}
        shareTitle={`${leaderboard.title} Leaderboard`}
        flexDirection="column"
      />
      <Heading size="xl" marginBottom="30px" display="flex" alignItems="center" as="h1">
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

LeaderboardPage.getLayout = (page) => (
  <Layout>
    <>
      <PageMeta
        title="Leaderboard"
        description="Take a look at the most up-to date published version of this leaderboard."
      />
      {page}
    </>
  </Layout>
)

export default LeaderboardPage
