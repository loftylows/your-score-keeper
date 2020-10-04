import { BlitzPage } from "blitz"
import Layout from "app/layouts/Site"
import HeroSection from "app/components/HeroHomeSection"

const Home: BlitzPage = () => {
  return <HeroSection />
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
