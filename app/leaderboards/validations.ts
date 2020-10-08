import * as z from "zod"

export const CreateLeaderboardInput = z.object({
  title: z.string().min(1).max(100),
})
export type CreateLeaderboardInputType = z.infer<typeof CreateLeaderboardInput>

export const EditLeaderboardInput = z.object({
  title: z.string().min(1).max(100),
})
export type EditLeaderboardInputType = z.infer<typeof EditLeaderboardInput>
