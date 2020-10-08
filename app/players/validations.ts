import * as z from "zod"

export const CreatePlayerInput = z.object({
  name: z.string().min(1).max(100),
  score: z.number(),
})
export type CreatePlayerInputType = z.infer<typeof CreatePlayerInput>
