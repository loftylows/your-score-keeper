import * as React from "react"
import { Leaderboard } from "@prisma/client"
import { Box } from "@chakra-ui/core"
import { formatDistance } from "date-fns"

interface IProps {
  leaderboards: Leaderboard[]
}
const LeaderboardsList = ({ leaderboards }: IProps) => {
  const today = React.useMemo(() => new Date(), [])
  return (
    <Box as="ul" listStyleType="none">
      {leaderboards.map((leaderboard) => {
        return (
          <Box
            as="li"
            display="flex"
            flexDirection="column"
            width="750px"
            maxWidth="100%"
            key={leaderboard.id}
          >
            <Box fontSize="lg" fontWeight="bold">
              {leaderboard.title}
            </Box>
            <Box>{`Created ${formatDistance(today, leaderboard.createdAt)} ago`}</Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default LeaderboardsList
