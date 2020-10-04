import { AppProps, ErrorComponent, useRouter } from "blitz"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { queryCache } from "react-query"
import { Router } from "blitz"
import NProgress from "nprogress"
import { ChakraProvider, extendTheme } from "@chakra-ui/core"
import LoginForm from "app/auth/components/LoginForm"
import myCustomThemeObj from "app/theme"
import AuthModalProvider from "app/auth/AuthModalProvider"
import "nprogress/nprogress.css"

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
          <AuthModalProvider>{getLayout(<Component {...pageProps} />)}</AuthModalProvider>
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
