import * as React from "react"
import { BlitzPage } from "blitz"
import Layout from "app/layouts/MyLeaderboardsSpace"

const MyLeaderboardsHome: BlitzPage = () => {
  return <div>Heyyyy</div>
}

MyLeaderboardsHome.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default MyLeaderboardsHome
