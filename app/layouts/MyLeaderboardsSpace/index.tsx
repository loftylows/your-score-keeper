import React from "react"
import { Head } from "blitz"
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
} from "@chakra-ui/core"
import { useBreakpointValue } from "@chakra-ui/media-query"
import Header from "app/components/Header"
import MyLeaderboardsSidebar from "app/components/MyLeaderboardsSidebar"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { uiContext } from "app/leaderboards/LeaderboardsUiProvider"
import { Leaderboard } from "@prisma/client"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import useCurrentlySelectedLeaderboard from "app/leaderboards/hooks/useCurrentlySelectedLeaderboard"

interface IProps {
  isMobile?: boolean
  children: React.ReactNode
}
const MyLeaderboardsSpaceLayout = ({ children, isMobile }: IProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const { leaderboards: dbLeaderboards, userId } = React.useContext(dbCacheLeaderboardsContext)
  const { leaderboards: inMemoryLeaderboards } = React.useContext(inMemoryLeaderboardsContext)
  const { setCurrentlySelectedLeaderboardId } = React.useContext(uiContext)
  const currentlySelectedLeaderboard = useCurrentlySelectedLeaderboard()
  const leaderboards: Leaderboard[] | InMemoryLeaderboard[] = userId
    ? dbLeaderboards
    : inMemoryLeaderboards
  const leaderboardsLength = leaderboards.length

  React.useEffect(() => {
    if (leaderboardsLength && !currentlySelectedLeaderboard) {
      setCurrentlySelectedLeaderboardId(leaderboards[0].id)
    }
  }, [leaderboardsLength, currentlySelectedLeaderboard])
  const closeMobileSidebar = () => setMobileSidebarOpen(false)
  const openMobileSidebar = () => setMobileSidebarOpen(true)

  const btnRef = React.useRef<HTMLButtonElement>(null)
  const showMobileSidebar = useBreakpointValue({ base: true, md: false }) || isMobile || false

  React.useEffect(() => {
    if (!showMobileSidebar && mobileSidebarOpen) setMobileSidebarOpen(false)
  }, [showMobileSidebar])

  return (
    <Box display="flex" flexDirection="column">
      <Head>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1.0" />
        <link key="favicon" rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        showingMobileSidebar={showMobileSidebar}
        openSidebar={showMobileSidebar ? openMobileSidebar : undefined}
      />
      <Box display="flex">
        {!showMobileSidebar ? (
          <MyLeaderboardsSidebar />
        ) : (
          <Drawer
            isOpen={mobileSidebarOpen}
            placement="left"
            onClose={closeMobileSidebar}
            finalFocusRef={btnRef}
            size="xs"
          >
            <DrawerOverlay>
              <DrawerContent onClick={closeMobileSidebar}>
                <DrawerCloseButton />
                <DrawerHeader>My Leaderboards</DrawerHeader>
                <MyLeaderboardsSidebar inDrawer={showMobileSidebar} />
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        )}
        {children}
      </Box>
    </Box>
  )
}

export default MyLeaderboardsSpaceLayout
