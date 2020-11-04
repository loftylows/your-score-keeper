import { ChakraProvider } from "@chakra-ui/core"
import GoogleFonts from "app/components/GoogleFontsHelper"
import PageMeta from "app/components/PageMeta"
import Layout from "app/layouts/Site"
import InMemoryLeaderboardsProvider from "app/leaderboards/InMemoryLeaderboardsProvider"
import UsersUiDialogsProvider from "app/users/UsersUiProvider"
import AuthModalProvider from "app/auth/AuthModalProvider"
import LeaderboardsDialogProvider from "../leaderboards/LeaderboardsUiProvider"
import { ErrorComponent } from "blitz"
import { customTheme } from "app/theme"

// ------------------------------------------------------
// This page is rendered if a route match is not found
// ------------------------------------------------------
export default function Page404() {
  const statusCode = 404
  const title = "This page could not be found"
  return (
    <>
      <ChakraProvider theme={customTheme}>
        <AuthModalProvider>
          <UsersUiDialogsProvider>
            <InMemoryLeaderboardsProvider>
              <LeaderboardsDialogProvider>
                <>
                  <GoogleFonts href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" />
                  <Layout>
                    <PageMeta title={`${statusCode}: ${title}`} description="" />
                    <ErrorComponent statusCode={statusCode} title={title} />
                  </Layout>
                </>
              </LeaderboardsDialogProvider>
            </InMemoryLeaderboardsProvider>
          </UsersUiDialogsProvider>
        </AuthModalProvider>
      </ChakraProvider>
    </>
  )
}
