import * as React from "react"
import mobile from "is-mobile"
import { BlitzPage, ssrQuery, GetServerSideProps } from "blitz"
import { getSessionContext } from "@blitzjs/server"
import Layout from "app/layouts/MyLeaderboardsSpace"
import { Leaderboard, Player } from "@prisma/client"
import DbCacheLeaderboardsProvider from "app/leaderboards/DbCacheLeaderboardsProvider"
import { Maybe, UUID } from "common-types"
import getLeaderboards from "app/leaderboards/queries/getLeaderboards"
import getPlayers from "app/players/queries/getPlayers"
import LeaderboardsDialogProvider from "app/leaderboards/LeaderboardsUiProvider"
import LeaderboardsSpace from "app/leaderboards/components/LeaderboardSpace"

export const getServerSideProps: GetServerSideProps = async ({ req, res: response }) => {
  const { userId } = await getSessionContext(req, response)
  let leaderboards: Leaderboard[] = []
  let players: Player[] = []
  const isMobile = mobile({
    ua: req.headers["user-agent"],
  })

  if (userId) {
    try {
      const queryRes = await ssrQuery(
        getLeaderboards,
        { where: { ownerId: userId } },
        { req, res: response }
      )
      leaderboards = queryRes.leaderboards

      if (leaderboards.length) {
        const res = await ssrQuery(
          getPlayers,
          { where: { leaderboardId: { in: leaderboards.map((l) => l.id) } } },
          { req, res: response }
        )
        players = res.players
      }
    } catch (e) {
      console.log(e)

      throw e
    }
  }

  return {
    props: {
      leaderboardsFromServer: leaderboards,
      playersFromServer: players,
      userId,
      isMobile,
    },
  }
}

type IPageProps = {
  leaderboardsFromServer: Leaderboard[]
  playersFromServer: Player[]
  userId: Maybe<UUID>
  isMobile: boolean
}

const MyLeaderboardsHome: BlitzPage<IPageProps> = ({
  leaderboardsFromServer,
  playersFromServer,
  userId,
  isMobile,
}) => {
  return (
    <DbCacheLeaderboardsProvider
      userId={userId}
      leaderboardsFromServer={leaderboardsFromServer}
      playersFromServer={playersFromServer}
    >
      <LeaderboardsDialogProvider>
        <Layout title="My Leaderboards" isMobile={isMobile}>
          <LeaderboardsSpace />
        </Layout>
      </LeaderboardsDialogProvider>
    </DbCacheLeaderboardsProvider>
  )
}

export default MyLeaderboardsHome
