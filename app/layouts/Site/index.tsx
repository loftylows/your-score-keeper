import React from "react"
import { Head } from "blitz"
import { Box } from "@chakra-ui/core"
// import AuthModal, {AuthModalType} from "@shared/components/AuthModal";
// import { logIn, signUp } from "@auth";
import Header from "app/components/Header"
// import { firebaseAuthContext } from "../../../providers/Auth";
// import { appContext } from "../../../providers/App";

interface IProps {
  title?: string
  children: React.ReactNode
}
const Layout = ({ children, title }: IProps) => {
  // const { appState: { leaderboards } } = React.useContext(appContext);
  /*
  const {
      authModalDetails,
      closeAuthModal,
      toggleAuthModalType,
      user
  } = React.useContext(firebaseAuthContext);
  */

  return (
    <Box display="flex" flexDirection="column">
      <Head>
        <title>{title || "yourscorekeeper.com"}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />

      {children}
    </Box>
  )
}

export default Layout
