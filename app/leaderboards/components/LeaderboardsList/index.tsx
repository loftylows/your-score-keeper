import * as React from "react"
import { Leaderboard, User } from "@prisma/client"
import { Box, Heading, VStack } from "@chakra-ui/core"
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
        const itemHeight = 100
        return (
          <Box
            as="li"
            display="flex"
            width="750px"
            maxWidth="100%"
            minHeight={`${itemHeight}px`}
            boxShadow="md"
            borderRadius="10px"
            key={leaderboard.id}
          >
            <Link href={`leaderboards/${leaderboard.id}`} passHref>
              <Box
                as="a"
                display="flex"
                flexDirection="column"
                padding="10px 20px"
                height={`${itemHeight}px`}
                width="100%"
              >
                <Heading size="lg" fontWeight="bold">
                  {leaderboard.title}
                </Heading>
                <Box as="small" marginTop="auto" display="block">
                  Created
                  {owner ? (
                    <span>
                      {" "}
                      by <b>{owner.name}</b>
                    </span>
                  ) : null}
                  {` ${formatDistance(today, leaderboard.createdAt)} ago`} |{" "}
                  {`Last updated ${formatDistance(today, leaderboard.updatedAt)} ago`}
                </Box>
              </Box>
            </Link>
          </Box>
        )
      })}
    </VStack>
  )
}

export default LeaderboardsList
