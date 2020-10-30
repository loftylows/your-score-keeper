import React from "react"
import { useRouter, BlitzPage } from "blitz"
import Layout from "app/layouts/Site"
import { SignupForm } from "app/auth/components/SignupForm"
import { Box, Heading } from "@chakra-ui/core"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Box maxWidth="100%" width="650px" marginX="auto" padding="15px 40px" paddingTop="50px">
      <Heading marginBottom="20px">Sign Up</Heading>
      <SignupForm
        onSuccess={() => router.push("/my-leaderboards")}
        toggleAuthFormType={() => router.push("/login")}
      />
    </Box>
  )
}

SignupPage.getLayout = (page) => <Layout>{page}</Layout>

export default SignupPage
