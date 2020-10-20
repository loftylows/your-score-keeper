import * as React from "react"
import { SortOrder } from "@prisma/client"
import { BlitzPage, GetServerSideProps, Router, ssrQuery } from "blitz"
import { getSessionContext } from "@blitzjs/server"
import Layout from "app/layouts/Site"
import { Box, Heading, Select } from "@chakra-ui/core"
import qs from "querystringify"
import getLeaderboards from "app/leaderboards/queries/getLeaderboards"
import { Maybe, ThenArgRecursive, UUID } from "common-types"
import { QueryOptions } from "app/leaderboards/searchUrlBuilder"
import url from "url"
import LeaderboardsList from "app/leaderboards/components/LeaderboardsList"
const leaderboardsPerPage = 20

export type LeaderboardsQueryRes = ThenArgRecursive<ReturnType<typeof getLeaderboards>>
interface IProps {
  leaderboardsQueryRes: ThenArgRecursive<ReturnType<typeof getLeaderboards>>
  userId: Maybe<UUID>
  sortBy: SortOrder
  page: number
}
export const getServerSideProps: GetServerSideProps<IProps> = async ({ req, res: response }) => {
  const { userId } = await getSessionContext(req, response)
  const search = url.parse(req.url || "").search || ""
  const query = (qs.parse(search) as unknown) as QueryOptions
  let leaderboardsQueryRes: ThenArgRecursive<ReturnType<typeof getLeaderboards>>
  const { sortBy, page } = query
  const pageNumber = Number(page)

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
        take: leaderboardsPerPage,
        skip: pageNumber > 1 ? pageNumber * leaderboardsPerPage : 0,
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
      page: Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    },
  }
}

const LeaderboardsPage: BlitzPage<IProps> = ({
  leaderboardsQueryRes: leaderboardsQueryResFromServer,
  sortBy,
  page,
}: IProps) => {
  const [leaderboardsQueryRes, setLeaderboardsQueryRes] = React.useState(
    leaderboardsQueryResFromServer
  )
  const tablePageCount =
    leaderboardsQueryRes.count > 20 && leaderboardsQueryRes.count % leaderboardsPerPage
      ? leaderboardsQueryRes.count
      : 1

  React.useEffect(() => {
    getLeaderboards({
      where: {
        private: false,
        published: true,
      },
      orderBy: {
        createdAt: sortBy,
      },
      take: leaderboardsPerPage,
      skip: page > 1 ? page * leaderboardsPerPage : 0,
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
      <Heading size="xl" marginBottom="30px">
        Leaderboards
      </Heading>
      <Box display="flex" alignItems="center">
        <Box whiteSpace="nowrap" fontSize="lg" fontWeight="bold" marginRight="10px">
          Sort By:
        </Box>
        <Select
          onChange={(ev) => {
            Router.push(`/leaderboards?sortBy=${ev.target.value}`)
          }}
          value={sortBy === "asc" ? "oldest" : "latest"}
          placeholder="Sort Order"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </Select>
      </Box>
      <LeaderboardsList leaderboards={leaderboardsQueryRes.leaderboards} />
    </Box>
  )
}

LeaderboardsPage.getLayout = (page) => <Layout title="YourScoreKeeper">{page}</Layout>

export default LeaderboardsPage
