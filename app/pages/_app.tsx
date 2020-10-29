import { AppProps, ErrorComponent, useRouter } from "blitz"
import { NextWebVitalsMetric } from "next/app"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { queryCache } from "react-query"
import { Router } from "blitz"
import NProgress from "nprogress"
import { ChakraProvider, extendTheme } from "@chakra-ui/core"
import { ToastContainer } from "react-toastify"
import LoginForm from "app/auth/components/LoginForm"
import myCustomThemeObj from "app/theme"
import AuthModalProvider from "app/auth/AuthModalProvider"
import InMemoryLeaderboardsProvider from "../leaderboards/InMemoryLeaderboardsProvider"
import LeaderboardsDialogProvider from "../leaderboards/LeaderboardsUiProvider"
import UsersUiDialogsProvider from "app/users/UsersUiProvider"
import GoogleFonts from "app/components/GoogleFontsHelper"

import "nprogress/nprogress.css"
import "react-toastify/dist/ReactToastify.css"

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start())
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

const customTheme = extendTheme(myCustomThemeObj)

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries()
      }}
    >
      {
        <ChakraProvider theme={customTheme}>
          <AuthModalProvider>
            <UsersUiDialogsProvider>
              <InMemoryLeaderboardsProvider>
                <LeaderboardsDialogProvider>
                  <>
                    <GoogleFonts href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" />
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      style={{
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    />
                    {getLayout(<Component {...pageProps} />)}
                  </>
                </LeaderboardsDialogProvider>
              </InMemoryLeaderboardsProvider>
            </UsersUiDialogsProvider>
          </AuthModalProvider>
        </ChakraProvider>
      }
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error?.name === "AuthenticationError") {
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error?.name === "AuthorizationError") {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error?.message || error?.name}
      />
    )
  }
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
}
