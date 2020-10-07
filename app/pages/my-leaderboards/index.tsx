import * as React from "react"
import { BlitzPage, GetServerSideProps, PromiseReturnType, ssrQuery } from "blitz"
import Layout from "app/layouts/MyLeaderboardsSpace"
import getLeaderboards from "app/leaderboards/queries/getLeaderboards"
import { Maybe, ThenArgRecursive, UUID } from "common-types"
import { getSessionContext } from "@blitzjs/server"
import { User } from "@prisma/client"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { Box, Heading } from "@chakra-ui/core"
import {
  LOGIN_COMPLETED_EVENT_NAME,
  LOGOUT_EVENT_NAME,
  SIGNUP_COMPLETED_EVENT_NAME,
} from "app/browserEvents"

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
  const [currentUserId, setCurrentUserId] = React.useState<Maybe<UUID>>(userId)
  const [leaderboards, setLeaderboards] = React.useState<
    Maybe<ThenArgRecursive<ReturnType<typeof getLeaderboards>>>
  >(initialLeaderboardsFromServer)
  const [loadingLeaderboards, setLoadingLeaderboards] = React.useState(true)

  /* Funcs */
  const myGetLeaderboards = (userId: UUID) => {
    setLoadingLeaderboards(true)
    getLeaderboards({ where: { ownerId: userId } })
      .then((boards) => setLeaderboards(boards))
      .finally(() => setLoadingLeaderboards(false))
  }
  const onAuthCompleted = (e: Event) => {
    const userId: Maybe<UUID> = (e as CustomEvent).detail?.userId
    if (!userId) return
    setCurrentUserId(userId)
  }
  const onLogout = () => {
    setCurrentUserId(null)
  }

  /* Effects */
  React.useEffect(() => {
    if (!currentUserId) {
      setLeaderboards(null)
    } else {
      myGetLeaderboards(currentUserId)
    }
  }, [currentUserId])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    window.addEventListener(LOGIN_COMPLETED_EVENT_NAME, onAuthCompleted)
    window.addEventListener(SIGNUP_COMPLETED_EVENT_NAME, onAuthCompleted)
    window.addEventListener(LOGOUT_EVENT_NAME, onLogout)

    return () => {
      window.removeEventListener(LOGIN_COMPLETED_EVENT_NAME, onAuthCompleted)
      window.removeEventListener(SIGNUP_COMPLETED_EVENT_NAME, onAuthCompleted)
      window.removeEventListener(LOGOUT_EVENT_NAME, onLogout)
    }
  }, [true])

  return (
    <Box>
      <Box>Yooooo we are on the leaderboard page!!!!!!</Box>
      {leaderboards &&
        leaderboards.leaderboards.length &&
        leaderboards.leaderboards.map((leaderboard) => (
          <Box key={leaderboard.id}>
            <Heading>{leaderboard.title}</Heading>
            <Box>Created At: {leaderboard.createdAt}</Box>
          </Box>
        ))}
    </Box>
  )
}

MyLeaderboardsHome.getLayout = (page) => <Layout title="My Leaderboards">{page}</Layout>

export default MyLeaderboardsHome
