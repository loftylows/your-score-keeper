import * as z from "zod"

export const EditUserInput = z.object({
  username: z.string().min(1),
})
export type EditUserInputType = z.infer<typeof EditUserInput>
