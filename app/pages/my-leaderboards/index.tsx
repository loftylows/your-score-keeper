import * as React from "react"
import { BlitzPage, useSession } from "blitz"
import Layout from "app/layouts/MyLeaderboardsSpace"
import { Leaderboard } from "@prisma/client"
import { Box, Heading } from "@chakra-ui/core"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import { uiContext } from "app/leaderboards/UiProvider"
import { Maybe } from "common-types"

type IPageProps = {}

const MyLeaderboardsHome: BlitzPage<IPageProps> = () => {
  const { isLoading, userId } = useSession()
  const { loadDbCacheLeaderboards, leaderboards: dbLeaderboards } = React.useContext(
    dbCacheLeaderboardsContext
  )
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { setCurrentlySelectedLeaderboardId, currentlySelectedLeaderboardId } = React.useContext(
    uiContext
  )
  const leaderboards: Leaderboard[] | InMemoryLeaderboard[] = userId
    ? dbLeaderboards
    : inMemoryLeaderboards
  const hasLeaderboards = leaderboards.length > 0
  const currentlySelectedLeaderboard: Maybe<
    Leaderboard | InMemoryLeaderboard
  > = currentlySelectedLeaderboardId
    ? leaderboards.find((l) => l.id === currentlySelectedLeaderboardId) || null
    : null

  React.useEffect(() => {
    if (userId && !isLoading) {
      loadDbCacheLeaderboards(userId)
    }
  }, [userId, isLoading, loadDbCacheLeaderboards])

  React.useEffect(() => {
    if (hasLeaderboards) {
      setCurrentlySelectedLeaderboardId(leaderboards[0].id)
    }
  }, [leaderboards, hasLeaderboards, setCurrentlySelectedLeaderboardId])

  return (
    <Box>
      {currentlySelectedLeaderboard && (
        <Box>
          <Heading>{currentlySelectedLeaderboard.title}</Heading>
        </Box>
      )}
    </Box>
  )
}

MyLeaderboardsHome.getLayout = (page) => <Layout title="My Leaderboards">{page}</Layout>

export default MyLeaderboardsHome
