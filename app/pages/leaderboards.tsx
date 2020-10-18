import * as React from "react"
import { SortOrder } from "@prisma/client"
import { BlitzPage, GetServerSideProps, ssrQuery, useQuery } from "blitz"
import { getSessionContext } from "@blitzjs/server"
import Layout from "app/layouts/Site"
import { Box, Heading } from "@chakra-ui/core"
import qs from "querystringify"
import getLeaderboards from "app/leaderboards/queries/getLeaderboards"
import { Maybe, ThenArgRecursive, UUID } from "common-types"
import { QueryOptions } from "app/leaderboards/searchUrlBuilder"
import url from "url"
import LeaderboardsList from "app/leaderboards/LeaderboardsList"

export type LeaderboardsQueryRes = ThenArgRecursive<ReturnType<typeof getLeaderboards>>
interface IProps {
  leaderboardsQueryRes: ThenArgRecursive<ReturnType<typeof getLeaderboards>>
  userId: Maybe<UUID>
  sortBy: string
}
export const getServerSideProps: GetServerSideProps<IProps> = async ({ req, res: response }) => {
  const { userId } = await getSessionContext(req, response)
  const search = url.parse(req.url || "").search || ""
  const query = (qs.parse(search) as unknown) as QueryOptions
  let leaderboardsQueryRes: ThenArgRecursive<ReturnType<typeof getLeaderboards>>
  const { sortBy } = query

  let createdAtSort: SortOrder = "desc"
  if (sortBy === "latest") createdAtSort = "desc"
  if (sortBy === "oldest") createdAtSort = "asc"

  try {
    const queryRes = await ssrQuery(
      getLeaderboards,
      {
        where: {
          private: false,
          published: true,
        },
        orderBy: {
          createdAt: createdAtSort,
        },
      },
      { req, res: response }
    )
    leaderboardsQueryRes = queryRes
  } catch (e) {
    console.log(e)
    throw e
  }

  return {
    props: {
      leaderboardsQueryRes,
      userId: userId || null,
      sortBy: createdAtSort,
    },
  }
}

const LeaderboardsPage: BlitzPage<IProps> = ({
  leaderboardsQueryRes: leaderboardsQueryResFromServer,
  sortBy: sortByFromServer,
  userId,
}: IProps) => {
  const [leaderboardsQueryRes, setLeaderboardsQueryRes] = React.useState(
    leaderboardsQueryResFromServer
  )
  const [sortBy, setSortBy] = React.useState<SortOrder>(sortByFromServer as SortOrder)

  React.useEffect(() => {
    getLeaderboards({
      where: {
        private: false,
        published: true,
      },
      orderBy: {
        createdAt: sortBy,
      },
    })
      .then((res) => {
        setLeaderboardsQueryRes(res)
      })
      .catch((e) => {
        // TODO: Notify user of error
        console.debug(e)
      })
  }, [sortBy])

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={{ base: "30px 10px", md: "40px 20px" }}
    >
      <Heading>Leaderboards</Heading>
      <LeaderboardsList leaderboards={leaderboardsQueryRes.leaderboards} />
    </Box>
  )
}

LeaderboardsPage.getLayout = (page) => <Layout title="YourScoreKeeper">{page}</Layout>

export default LeaderboardsPage
