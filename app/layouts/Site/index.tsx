import React from "react"
import { Head } from "blitz"
import { Box } from "@chakra-ui/core"
import Header from "app/components/Header"

interface IProps {
  title?: string
  children: React.ReactNode
}
const Layout = ({ children, title }: IProps) => {
  return (
    <Box display="flex" flexDirection="column">
      <Head>
        <title key="title">{title || "yourscorekeeper.com"}</title>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1.0" />
        <link key="favicon" rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      {children}
    </Box>
  )
}

export default Layout
