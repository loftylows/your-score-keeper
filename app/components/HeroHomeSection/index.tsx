import * as React from "react"
import { Link } from "blitz"
import { Box, Button, Image, Heading, useBreakpointValue } from "@chakra-ui/core"
import buildSearchQuery from "app/leaderboards/searchUrlBuilder"

const HeroSection = () => {
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" })

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
      <Box
        as="picture"
        position="absolute"
        display="flex"
        width="100%"
        height="100%"
        maxHeight="100%"
        zIndex={-1}
      >
        <source
          type="image/webp"
          srcSet="/images/hero-image-mobile.webp 540w, /images/hero-image.webp 2578w"
          sizes="(max-width: 540px) 540px, 2578px"
        />
        <Image
          srcSet="/images/hero-image-mobile.jpg 540w, /images/hero-image.jpg 2578w"
          sizes="(max-width: 540px) 540px, 2578px"
          src="/images/hero-image.jpg"
          objectFit="cover"
        />
      </Box>

      <Box
        position="absolute"
        width="100%"
        height="100%"
        maxHeight="100%"
        backgroundColor="black"
        opacity={0.56}
        zIndex={-1}
      />

      <Box
        display="flex"
        flexDirection="column"
        maxWidth="100%"
        padding={{ base: "40px 15px", md: "20px 15px" }}
      >
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
              <Button colorScheme="primaryBtn" size={buttonSize}>
                Create Leaderboard
              </Button>
            </Box>
          </Link>

          <Link href={buildSearchQuery({ sortBy: "latest", page: 1 })} passHref>
            <Box as="a" marginX="25px" marginBottom={{ base: "20px", md: "0" }}>
              <Button
                backgroundColor="gray.600"
                _hover={{ backgroundColor: "gray.700" }}
                size={buttonSize}
              >
                Latest Leaderboards
              </Button>
            </Box>
          </Link>
        </Box>

        <Box marginTop="30px" marginX="auto" padding="15px" width="710px" maxWidth="100%">
          <Box
            as="picture"
            display="flex"
            width="100%"
            height="100%"
            maxHeight="100%"
            objectFit="cover"
            borderRadius="10px"
          >
            <source
              type="image/webp"
              srcSet="/images/app-screenshot.webp 864w, /images/app-screenshot.webp 1440w"
              sizes="(max-width: 540px) 864px, 1440px"
            />
            <Image
              srcSet="/images/app-screenshot.jpg 864w, /images/app-screenshot.jpg 1440w"
              sizes="(max-width: 540px) 864px, 1440px"
              src="/images/app-screenshot.jpg"
              borderRadius="10px"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default HeroSection
