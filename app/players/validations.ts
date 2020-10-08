import * as z from "zod"

export const CreatePlayerInput = z.object({
  name: z.string().min(1).max(100),
  score: z.string(),
})
export type CreatePlayerInputType = z.infer<typeof CreatePlayerInput>

export const EditPlayerInput = z.object({
  name: z.string().min(1).max(100),
  score: z.string(),
})
export type EditPlayerInputType = z.infer<typeof EditPlayerInput>
