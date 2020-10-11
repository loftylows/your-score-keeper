import * as z from "zod"

export const EditUserInput = z.object({
  name: z.string().min(1),
})
export type EditUserInputType = z.infer<typeof EditUserInput>
