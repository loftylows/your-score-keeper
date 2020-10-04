import { Link, BlitzPage } from "blitz"
import Layout from "app/layouts/Site"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Suspense } from "react"
import { Button } from "@chakra-ui/core"
import HeroSection from "app/components/HeroHomeSection"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()

  if (currentUser) {
    return (
      <>
        <Button
          className="button small"
          onClick={async () => {
            await logout()
          }}
        >
          Logout
        </Button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <Link href="/signup">
          <a>
            <Button boxShadow="md">
              <strong>Sign Up</strong>
            </Button>
          </a>
        </Link>
        <Link href="/login">
          <a>
            <Button>
              <strong>Login</strong>
            </Button>
          </a>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return <HeroSection />
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
