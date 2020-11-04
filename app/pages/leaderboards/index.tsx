import * as React from "react"
import { SortOrder } from "@prisma/client"
import { BlitzPage, GetServerSideProps, Router, ssrQuery } from "blitz"
import { getSessionContext } from "@blitzjs/server"
import Layout from "app/layouts/Site"
import { Box, Heading, Select } from "@chakra-ui/core"
import qs from "querystringify"
import getLeaderboards from "app/leaderboards/queries/getLeaderboards"
import { ErrorFromServerSideProps, Maybe, ThenArgRecursive, UUID } from "common-types"
import buildSearchQuery, { QueryOptions } from "app/leaderboards/searchUrlBuilder"
import url from "url"
import LeaderboardsList from "app/leaderboards/components/LeaderboardsList"
import Pagination from "app/components/Pagination"
import PageMeta from "app/components/PageMeta"
import { fallbackErrorCodeStatus, hostname } from "app/utils/constants"
const leaderboardsPerPage = 10

export type SortType = "latest" | "oldest"
export type LeaderboardsQueryRes = ThenArgRecursive<ReturnType<typeof getLeaderboards>>
export const sortByToSortType = (i: SortOrder): SortType => (i === "asc" ? "oldest" : "latest")
const getPage = (pageNumber: any) =>
  Number.isInteger(Number(pageNumber)) && Number(pageNumber) > 0 ? Number(pageNumber) : 1
const getSortBy = (sortBy: any): "desc" | "asc" => {
  if (sortBy !== "latest" && sortBy !== "oldest") return "desc"
  return sortBy === "latest" ? "desc" : "asc"
}
interface IProps {
  leaderboardsQueryRes: Maybe<ThenArgRecursive<ReturnType<typeof getLeaderboards>>>
  userId: Maybe<UUID>
  sortBy: SortOrder
  page: number
  error?: ErrorFromServerSideProps
}
export const getServerSideProps: GetServerSideProps<IProps> = async ({ req, res: response }) => {
  const { userId } = await getSessionContext(req, response)
  const search = url.parse(req.url || "").search || ""
  const query = (qs.parse(search) as unknown) as QueryOptions
  let leaderboardsQueryRes: ThenArgRecursive<ReturnType<typeof getLeaderboards>>
  const { sortBy, page } = query
  const pageNumber = getPage(page)

  let createdAtSort: SortOrder = getSortBy(sortBy)

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
        skip: pageNumber > 1 ? (pageNumber - 1) * leaderboardsPerPage : 0,
      },
      { req, res: response }
    )
    leaderboardsQueryRes = queryRes
  } catch (e) {
    if (e.name === "AuthorizationError") {
      response.statusCode = e.statusCode
      return {
        props: {
          leaderboardsQueryRes: null,
          userId: userId || null,
          sortBy: createdAtSort,
          page: Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1,
          error: { name: e.name, statusCode: e.statusCode || fallbackErrorCodeStatus },
        },
      }
    } else {
      response.statusCode = e.statusCode || fallbackErrorCodeStatus
      return {
        props: {
          leaderboardsQueryRes: null,
          userId: userId || null,
          sortBy: createdAtSort,
          page: Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1,
          error: { name: e.name, statusCode: e.statusCode || fallbackErrorCodeStatus },
        },
      }
    }
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
  leaderboardsQueryRes,
  sortBy,
  page,
  error,
}: IProps) => {
  // TODO: fix this error UI
  if (!leaderboardsQueryRes) {
    throw new Error(error?.name || "An unknown error ocurred.")
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={{ base: "30px 10px", md: "40px 20px" }}
    >
      <Box
        marginBottom="30px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignContent="center"
      >
        <Heading size="xl" textAlign="center" as="h1">
          Leaderboards
        </Heading>
        <Box as="small" textAlign="center">
          Showing <b>{leaderboardsQueryRes.leaderboards.length}</b> of{" "}
          <b>{leaderboardsQueryRes.count}</b> public leaderboards
        </Box>
      </Box>

      <Box display="flex" alignItems="center">
        <Box whiteSpace="nowrap" fontSize="lg" fontWeight="bold" marginRight="10px">
          Sort By:
        </Box>
        <Select
          onChange={(ev) => {
            Router.push(
              buildSearchQuery({ sortBy: (ev.target.value || "latest") as SortType, page })
            )
          }}
          value={sortBy === "asc" ? "oldest" : "latest"}
          placeholder="Sort Order"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </Select>
      </Box>

      <Box padding="20px" width="100%" maxWidth="100%">
        <LeaderboardsList leaderboards={leaderboardsQueryRes.leaderboards} />
      </Box>

      <Box marginTop="30px">
        <Pagination
          pageLimit={leaderboardsPerPage}
          currentPage={page}
          totalRecords={leaderboardsQueryRes.count}
          linkBuilder={(page) => buildSearchQuery({ page, sortBy: sortByToSortType(sortBy) })}
        />
      </Box>
    </Box>
  )
}

LeaderboardsPage.getLayout = (page) => (
  <Layout>
    <>
      <PageMeta
        title="Leaderboards"
        description="See all of the latest leaderboards on YourScoreKeeper right here."
        canonicalUrl={`https://${hostname}/leaderboards`}
      />
      {page}
    </>
  </Layout>
)

export default LeaderboardsPage
