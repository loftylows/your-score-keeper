import * as React from "react"
import { BlitzPage, GetServerSideProps, PromiseReturnType, ssrQuery } from "blitz"
import Layout from "app/layouts/MyLeaderboardsSpace"
import getLeaderboards from "app/leaderboards/queries/getLeaderboards"
import { Maybe, ThenArgRecursive, UUID } from "common-types"
import { getSessionContext } from "@blitzjs/server"
import { Leaderboard, User } from "@prisma/client"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { Box, Heading } from "@chakra-ui/core"
import {
  LOGIN_COMPLETED_EVENT_NAME,
  LOGOUT_EVENT_NAME,
  SIGNUP_COMPLETED_EVENT_NAME,
} from "app/browserEvents"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"

type IPageProps = {
  initialLeaderboardsFromServer: Maybe<PromiseReturnType<typeof getLeaderboards>>
  userId: Maybe<UUID>
}

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({ req, res }) => {
  const user = (await getCurrentUser()) as Maybe<User>
  const session = await getSessionContext(req, res)
  console.log("User ID:", session.userId)
  let leaderboards: Maybe<PromiseReturnType<typeof getLeaderboards>> = null
  if (user) {
    leaderboards = await ssrQuery(getLeaderboards, { where: { ownerId: user.id } }, { req, res })
  }

  return {
    props: { initialLeaderboardsFromServer: leaderboards, userId: "" },
  }
}

const MyLeaderboardsHome: BlitzPage<IPageProps> = ({ userId, initialLeaderboardsFromServer }) => {
  const { setDbCacheLeaderboards, leaderboards: dbLeaderboards } = React.useContext(
    dbCacheLeaderboardsContext
  )
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  React.useEffect(() => {
    if (
      userId &&
      initialLeaderboardsFromServer &&
      initialLeaderboardsFromServer.leaderboards.length
    ) {
      setDbCacheLeaderboards(userId, initialLeaderboardsFromServer.leaderboards)
    }
  }, [userId])

  const leaderboards: Leaderboard[] | InMemoryLeaderboard[] = userId
    ? dbLeaderboards
    : inMemoryLeaderboards

  return (
    <Box>
      <Box>Yooooo we are on the leaderboard page!!!!!!</Box>
      {leaderboards.map((leaderboard) => (
        <Box key={leaderboard.id}>
          <Heading>{leaderboard.title}</Heading>
        </Box>
      ))}
    </Box>
  )
}

MyLeaderboardsHome.getLayout = (page) => <Layout title="My Leaderboards">{page}</Layout>

export default MyLeaderboardsHome
