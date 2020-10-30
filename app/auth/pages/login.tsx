import React from "react"
import { useRouter, BlitzPage } from "blitz"
import Layout from "app/layouts/Site"
import { LoginForm } from "app/auth/components/LoginForm"
import { Box, Heading } from "@chakra-ui/core"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Box maxWidth="100%" width="650px" marginX="auto" padding="15px 40px" paddingTop="50px">
      <Heading marginBottom="20px">Log In</Heading>
      <LoginForm
        onSuccess={() => router.push("/my-leaderboards")}
        toggleAuthFormType={() => router.push("/signup")}
      />
    </Box>
  )
}

LoginPage.getLayout = (page) => <Layout>{page}</Layout>

export default LoginPage
