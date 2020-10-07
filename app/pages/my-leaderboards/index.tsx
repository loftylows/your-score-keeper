import * as React from "react"
import { BlitzPage, GetServerSideProps, PromiseReturnType, ssrQuery } from "blitz"
import Layout from "app/layouts/MyLeaderboardsSpace"
import getLeaderboards from "app/leaderboards/queries/getLeaderboards"
import { Maybe } from "common-types"
import { User } from "@prisma/client"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { Box, Heading } from "@chakra-ui/core"

type ThenArgRecursive<T> = T extends PromiseLike<infer U>
  ? { 0: ThenArgRecursive<U>; 1: U }[T extends PromiseLike<any> ? 0 : 1]
  : T

type IPageProps = {
  initialLeaderboardsFromServer: Maybe<PromiseReturnType<typeof getLeaderboards>>
  user: Maybe<User>
}

export const getServerSideProps: GetServerSideProps<IPageProps> = async ({ req, res }) => {
  const user = (await getCurrentUser()) as Maybe<User>
  let leaderboards: Maybe<PromiseReturnType<typeof getLeaderboards>> = null
  if (user) {
    leaderboards = await ssrQuery(getLeaderboards, { where: { ownerId: user.id } }, { req, res })
  }

  return {
    props: { initialLeaderboardsFromServer: leaderboards, user },
  }
}

const MyLeaderboardsHome: BlitzPage<IPageProps> = ({ user, initialLeaderboardsFromServer }) => {
  const [leaderboards, setLeaderboards] = React.useState<
    Maybe<ThenArgRecursive<ReturnType<typeof getLeaderboards>>>
  >(null)
  const [loadingLeaderboards, setLoadingLeaderboards] = React.useState(false)

  React.useEffect(() => {
    if (!user) {
      setLeaderboards(null)
      return
    }

    setLoadingLeaderboards(true)
    getLeaderboards({ where: { ownerId: user.id } })
      .then((boards) => setLeaderboards(boards))
      .finally(() => setLoadingLeaderboards(false))
  }, [user])

  return (
    <Box>
      <Box>Yooooo we are on the leaderboard page!!!!!!</Box>
      {initialLeaderboardsFromServer &&
        initialLeaderboardsFromServer.leaderboards.length &&
        initialLeaderboardsFromServer.leaderboards.map((leaderboard) => (
          <Box>
            <Heading>{leaderboard.title}</Heading>
            <Box>Created At: {leaderboard.createdAt}</Box>
          </Box>
        ))}
    </Box>
  )
}

MyLeaderboardsHome.getLayout = (page) => <Layout title="My Leaderboards">{page}</Layout>

export default MyLeaderboardsHome
