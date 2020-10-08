import * as React from "react"
import { BlitzPage, GetServerSideProps, PromiseReturnType, ssrQuery } from "blitz"
import Layout from "app/layouts/MyLeaderboardsSpace"
import getLeaderboards from "app/leaderboards/queries/getLeaderboards"
import { Maybe, UUID } from "common-types"
import { getSessionContext } from "@blitzjs/server"
import { Leaderboard } from "@prisma/client"
import { Box, Heading } from "@chakra-ui/core"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"

type IPageProps = {
  initialLeaderboardsFromServer: Maybe<PromiseReturnType<typeof getLeaderboards>>
  userId: Maybe<UUID>
}

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({ req, res }) => {
  const session = await getSessionContext(req, res)
  const { userId } = session

  let leaderboards: Maybe<PromiseReturnType<typeof getLeaderboards>> = null
  if (userId) {
    leaderboards = await ssrQuery(getLeaderboards, { where: { ownerId: userId } }, { req, res })
  }

  return {
    props: { initialLeaderboardsFromServer: leaderboards, userId: userId || null },
  }
}

const MyLeaderboardsHome: BlitzPage<IPageProps> = ({ userId, initialLeaderboardsFromServer }) => {
  const { setDbCacheLeaderboards, leaderboards: dbLeaderboards } = React.useContext(
    dbCacheLeaderboardsContext
  )
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  React.useEffect(() => {
    if (userId) {
      setDbCacheLeaderboards(userId, initialLeaderboardsFromServer?.leaderboards || [])
    }
  }, [userId, setDbCacheLeaderboards, initialLeaderboardsFromServer?.leaderboards])

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
