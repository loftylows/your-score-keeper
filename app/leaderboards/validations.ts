import * as z from "zod"

const LeaderboardPlayersScoreSortDirectionEnum = z.enum(["ASC", "DESC"])
export type LeaderboardPlayersScoreSortDirectionEnumType = z.infer<
  typeof LeaderboardPlayersScoreSortDirectionEnum
>
export const CreateLeaderboardInput = z.object({
  title: z.string().min(1).max(100),
  playersScoreSortDirection: LeaderboardPlayersScoreSortDirectionEnum,
})
export type CreateLeaderboardInputType = z.infer<typeof CreateLeaderboardInput>

export const EditLeaderboardInput = z.object({
  title: z.string().min(1).max(100),
  playersScoreSortDirection: LeaderboardPlayersScoreSortDirectionEnum,
})
export type EditLeaderboardInputType = z.infer<typeof EditLeaderboardInput>
