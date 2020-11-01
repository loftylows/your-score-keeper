import { BlitzPage } from "blitz"
import Layout from "app/layouts/Site"
import HeroSection from "app/components/HeroHomeSection"
import PageMeta from "app/components/PageMeta"

const Home: BlitzPage = () => {
  return <HeroSection />
}

Home.getLayout = (page) => (
  <Layout>
    <>
      <PageMeta
        title="YourScoreKeeper"
        description="Get started right now and create your first custom online scoreboard for free. YourScoreKeeper is an online software tool built to help you easily create, publish, and share your leaderboards online with just your friends or anyone else in the world."
      />
      {page}
    </>
  </Layout>
)

export default Home
