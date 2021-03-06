import * as React from "react"
import { AppProps, ErrorComponent, useRouter, Head } from "blitz"
import { NextWebVitalsMetric } from "next/app"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { queryCache } from "react-query"
import { Router } from "blitz"
import NProgress from "nprogress"
import { ChakraProvider } from "@chakra-ui/core"
import { ToastContainer } from "react-toastify"
import LoginForm from "app/auth/components/LoginForm"
import AuthModalProvider from "app/auth/AuthModalProvider"
import InMemoryLeaderboardsProvider from "../leaderboards/InMemoryLeaderboardsProvider"
import LeaderboardsDialogProvider from "../leaderboards/LeaderboardsUiProvider"
import UsersUiDialogsProvider from "app/users/UsersUiProvider"
import GoogleFonts from "app/components/GoogleFontsHelper"

import "nprogress/nprogress.css"
import "react-toastify/dist/ReactToastify.css"
import Layout from "app/layouts/Site"
import { customTheme } from "app/theme"

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start())
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  // Use google analytics
  React.useEffect(() => {
    if (typeof window === "undefined") return

    window.requestAnimationFrame(() => {
      const myWindow = window as any
      myWindow.dataLayer = myWindow.dataLayer || []
      function gtag(...args) {
        myWindow.dataLayer.push(args)
      }
      gtag("js", new Date())

      gtag("config", "G-MNJYPE5L1X")
    })
  }, [])

  // Use Hotjar
  React.useEffect(() => {
    if (typeof window === "undefined") return

    window.requestAnimationFrame(() => {
      ;(function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
        h.hj =
          h.hj ||
          function () {
            ;(h.hj.q = h.hj.q || []).push(arguments)
          }
        h._hjSettings = { hjid: 2068822, hjsv: 6 }
        a = o.getElementsByTagName("body")[0]
        r = o.createElement("script")
        r.defer = 1
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
        a.appendChild(r)
      })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=")
    })
  }, [])

  if (pageProps?.json?.error) {
    return (
      <RootErrorFallback
        error={pageProps?.json?.error}
        resetErrorBoundary={() => {
          // This ensures the Blitz useQuery hooks will automatically refetch
          // data any time you reset the error boundary
          queryCache.resetErrorBoundaries()
        }}
      />
    )
  }

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
                    <Head>
                      <script
                        key="google-analytics"
                        defer
                        src="https://www.googletagmanager.com/gtag/js?id=G-MNJYPE5L1X"
                      ></script>
                    </Head>
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
  let errorComp: React.ReactElement

  if (error?.name === "AuthenticationError") {
    errorComp = <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error?.name === "AuthorizationError") {
    errorComp = (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    errorComp = (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 500}
        title={error?.message || error?.name}
      />
    )
  }

  return (
    <ChakraProvider theme={customTheme}>
      <AuthModalProvider>
        <UsersUiDialogsProvider>
          <InMemoryLeaderboardsProvider>
            <LeaderboardsDialogProvider>
              <>
                <GoogleFonts href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" />
                <Layout>{errorComp}</Layout>
              </>
            </LeaderboardsDialogProvider>
          </InMemoryLeaderboardsProvider>
        </UsersUiDialogsProvider>
      </AuthModalProvider>
    </ChakraProvider>
  )
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
}
