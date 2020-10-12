import * as React from "react"
import { Link } from "blitz"
import { Box, Button, Image, Heading } from "@chakra-ui/core"

const HeroSection = () => {
  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems={{
        base: "flex-start",
        sm: "center",
      }}
      height="calc(100vh - 64px)"
      minHeight={730}
      color="white"
    >
      <Image
        src="/images/hero-image.jpg"
        position="absolute"
        width="100%"
        height="100%"
        maxHeight="100%"
        objectFit="cover"
        zIndex={-1}
      />
      <Box
        position="absolute"
        width="100%"
        height="100%"
        maxHeight="100%"
        backgroundColor="black"
        opacity={0.56}
        zIndex={-1}
      />

      <Box display="flex" flexDirection="column" maxWidth="100%" padding="20px 15px">
        <Heading as="h1" textAlign="center" fontWeight="bold" size="xl">
          The Leader of Leaderboards
        </Heading>
        <Heading
          as="h3"
          size="md"
          marginTop="0px"
          marginX="auto"
          maxWidth="560px"
          fontWeight="400"
          textAlign="center"
          letterSpacing=".2px"
        >
          Track your scores and create multiple leaderboards of up to 300 players in just a couple
          clicks.
        </Heading>

        <Box display="flex" justifyContent="center" flexWrap="wrap" marginTop="25px">
          <Link href="/my-leaderboards" passHref>
            <Box as="a" marginX="25px" marginBottom={{ base: "20px", md: "0" }}>
              <Button colorScheme="primaryBtn" size="lg">
                Create Leaderboard
              </Button>
            </Box>
          </Link>

          <Link href="/latest-leaderboards" passHref>
            <Box as="a" marginX="25px" marginBottom={{ base: "20px", md: "0" }}>
              <Button backgroundColor="gray.600" _hover={{ backgroundColor: "gray.700" }} size="lg">
                Latest Leaderboards
              </Button>
            </Box>
          </Link>
        </Box>

        <Box marginTop="30px" marginX="auto" padding="15px" width="710px" maxWidth="100%">
          <Image
            width="100%"
            height="100%"
            maxHeight="100%"
            objectFit="cover"
            borderRadius="10px"
            src="/images/app-screenshot.jpg"
          />
        </Box>
      </Box>
    </Box>
  )
}
export default HeroSection
