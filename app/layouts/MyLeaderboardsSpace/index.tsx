import React from "react"
import { Head } from "blitz"
import { Box } from "@chakra-ui/core"
// import AuthModal, {AuthModalType} from "@shared/components/AuthModal";
// import { logIn, signUp } from "@auth";
import Header from "app/components/Header"
import MyLeaderboardsSidebar from "app/components/MyLeaderboardsSidebar"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { uiContext } from "app/leaderboards/UiProvider"
import { Leaderboard } from "@prisma/client"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
// import { firebaseAuthContext } from "../../../providers/Auth";
// import { appContext } from "../../../providers/App";

interface IProps {
  title?: string
  children: React.ReactNode
}
const MyLeaderboardsSpaceLayout = ({ children, title }: IProps) => {
  const { leaderboards: dbLeaderboards, userId } = React.useContext(dbCacheLeaderboardsContext)
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { setCurrentlySelectedLeaderboardId } = React.useContext(uiContext)
  const leaderboards: Leaderboard[] | InMemoryLeaderboard[] = userId
    ? dbLeaderboards
    : inMemoryLeaderboards
  const hasLeaderboards = leaderboards.length > 0

  React.useEffect(() => {
    if (hasLeaderboards) {
      setCurrentlySelectedLeaderboardId(leaderboards[0].id)
    }
  }, [hasLeaderboards])

  return (
    <Box display="flex" flexDirection="column">
      <Head>
        <title key="title">{title || "yourscorekeeper.com"}</title>
        <link key="favicon" rel="icon" href="/favicon.ico" />
        <link
          key="google-fonts-roboto"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />
      <Box display="flex">
        <MyLeaderboardsSidebar />
        {children}
      </Box>
    </Box>
  )
}

export default MyLeaderboardsSpaceLayout
