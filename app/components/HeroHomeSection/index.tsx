import * as React from "react"
import { Link } from "blitz"
import { Box, Button, Image, Heading } from "@chakra-ui/core"
import { useBreakpointValue } from "@chakra-ui/media-query"
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
          srcSet="https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1603905215/hero-image-mobile_xu5ush.webp 540w, https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1603429289/hero-image_dosmh1.webp 2578w"
          sizes="100vw"
        />
        <Image
          src="https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1603429908/hero-image_r80hkx.jpg"
          srcSet="https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1603429974/hero-image-mobile_qm6y59.jpg 540w, https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1603429908/hero-image_r80hkx.jpg 2578w"
          sizes="100vw"
          objectFit="cover"
          alt="Soccer field"
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
        <Heading as="h1" textAlign="center" fontWeight="bold" size="xl" marginBottom="10px">
          Create Your First Free Leaderboard With Ease
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
          Track your scores and create multiple leaderboards of up to 150 players in just a couple
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
              srcSet="https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1604139459/app-screenshot_n0wmql.webp 740w"
              sizes="(max-width: 740px) calc(100vw - 60px), 680px"
            />
            <source
              type="image/jpeg"
              src="https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1604139352/app-screenshot_wvam94.jpg"
              srcSet="https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1604139352/app-screenshot_wvam94.jpg 740w"
              sizes="(max-width: 740px) calc(100vw - 60px), 680px"
            />
            <Image
              src="https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1604139352/app-screenshot_wvam94.jpg"
              srcSet="https://res.cloudinary.com/yourscorekeeper-com/image/upload/v1604139352/app-screenshot_wvam94.jpg 740w"
              sizes="(max-width: 740px) calc(100vw - 60px), 680px"
              borderRadius="10px"
              height="100%"
              width="100%"
              objectFit="contain"
              alt="YourScoreKeeper app screenshot"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default HeroSection
