import { hostname } from "app/utils/constants"

const getLeaderboardShareUrl = (leaderboardId: string) =>
  `https://${hostname}/leaderboards/${leaderboardId}`

export default getLeaderboardShareUrl
