import * as React from "react"
import { Leaderboard, User } from "@prisma/client"
import { Box, Button, Heading, Text, VStack } from "@chakra-ui/core"
import { formatDistance } from "date-fns"
import { Link } from "blitz"

interface IProps {
  leaderboards: (Leaderboard & { owner: { name: string } })[]
}
const LeaderboardsList = ({ leaderboards }: IProps) => {
  const today = React.useMemo(() => new Date(), [])
  return (
    <VStack as="ul" listStyleType="none" spacing={4}>
      {leaderboards.map((leaderboard) => {
        const owner = leaderboard?.owner as User
        const itemHeight = 130
        return (
          <Button
            as="li"
            display="flex"
            width="750px"
            maxWidth="100%"
            minHeight={`${itemHeight}px`}
            boxShadow="md"
            borderRadius="10px"
            border="1px solid rgba(0,0,0,.05)"
            key={leaderboard.id}
          >
            <Link href={`leaderboards/${leaderboard.id}`} passHref>
              <Box
                as="a"
                display="flex"
                flexDirection="column"
                padding="20px"
                height={`${itemHeight}px`}
                width="100%"
              >
                <Heading size="lg" fontWeight="bold">
                  {leaderboard.title}
                </Heading>
                <Box as="small" marginTop="auto" display="flex" flexDirection="column">
                  <Text display="flex" isTruncated marginBottom="3px">
                    Created
                    {owner ? (
                      <Box as="span" marginX="3px" display={{ base: "none", md: "block" }}>
                        by <b>{owner.name}</b>
                      </Box>
                    ) : null}
                    {` ${formatDistance(today, leaderboard.createdAt)} ago`}
                  </Text>
                  <Text isTruncated>
                    {` Last updated ${formatDistance(today, leaderboard.updatedAt)} ago`}
                  </Text>
                </Box>
              </Box>
            </Link>
          </Button>
        )
      })}
    </VStack>
  )
}

export default LeaderboardsList
