import React from "react"
import { Head } from "blitz"
import { Box } from "@chakra-ui/core"
import Header from "app/components/Header"

interface IProps {
  children: React.ReactNode
}
const Layout = ({ children }: IProps) => {
  return (
    <Box display="flex" flexDirection="column">
      <Head>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1.0" />
        <link key="head-favicon" rel="icon" type="image/png" href="/favicon.ico" />
        <link key="head-apple-touch-icon" rel="apple-touch-icon" href="/favicon.ico" />
      </Head>
      <Header />

      {children}
    </Box>
  )
}

export default Layout
