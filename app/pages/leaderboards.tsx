import * as React from "react"
import { BlitzPage } from "blitz"
import Layout from "app/layouts/Site"
import { Box } from "@chakra-ui/core"

const LeaderboardsPage: BlitzPage = () => {
  return <Box>Yoooo</Box>
}

LeaderboardsPage.getLayout = (page) => <Layout title="YourScoreKeeper">{page}</Layout>

export default LeaderboardsPage
