import * as React from "react"
import { HStack, FormControl, Input, InputGroup, InputLeftElement, Button } from "@chakra-ui/core"
import { InfoIcon } from "@chakra-ui/icons"
import { Form as FinalForm, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import { CreatePlayerInput, CreatePlayerInputType } from "app/players/validations"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { UUID } from "common-types"

type CreatePlayerFormProps = {
  leaderboardId: UUID
  onSuccess?: () => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
  onFormFinished?: () => void
}

const CreatePlayerForm = (props: CreatePlayerFormProps) => {
  const { leaderboardId } = props
  const { userId, dbCacheCreatePlayer } = React.useContext(dbCacheLeaderboardsContext)
  const { inMemoryCreatePlayer } = React.useContext(inMemoryLeaderboardsContext)

  return (
    <FinalForm<CreatePlayerInputType>
      initialValues={{ name: "" }}
      validate={(values) => {
        try {
          CreatePlayerInput.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values) => {
        props.onSubmitStart && props.onSubmitStart()
        try {
          if (userId) {
            dbCacheCreatePlayer(leaderboardId, {
              name: values.name,
              score: values.score,
              leaderboard: { connect: { id: leaderboardId } },
            })
          } else {
            inMemoryCreatePlayer(leaderboardId, {
              name: values.name,
              score: values.score,
              leaderboardId,
            })
          }
          props.onSuccess && props.onSuccess()
        } catch (error) {
          return {
            [FORM_ERROR]:
              "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
          }
        }
        props.onSubmitEnd && props.onSubmitEnd()
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <HStack spacing={4} width="100%">
            <Field name="name">
              {(props) => (
                <FormControl id="name" isRequired>
                  <InputGroup size="lg">
                    <InputLeftElement
                      pointerEvents="none"
                      children={<InfoIcon color="gray.300" />}
                    />
                    <Input
                      {...props.input}
                      errorBorderColor="crimson"
                      type="text"
                      placeholder="Name..."
                    />
                  </InputGroup>
                </FormControl>
              )}
            </Field>

            <Field name="score">
              {(props) => (
                <FormControl id="score" isRequired>
                  <InputGroup size="lg">
                    <InputLeftElement
                      pointerEvents="none"
                      children={<InfoIcon color="gray.300" />}
                    />
                    <Input
                      {...props.input}
                      errorBorderColor="crimson"
                      type="number"
                      placeholder="Score..."
                    />
                  </InputGroup>
                </FormControl>
              )}
            </Field>

            <Button
              colorScheme="blue"
              isLoading={props.submitting}
              disabled={props.submitting || !props.values.name || !props.values.score}
              isDisabled={props.submitting || !props.values.name || !props.values.score}
              type="submit"
              textTransform="uppercase"
              minWidth={{ base: "150px" }}
            >
              Add Player
            </Button>
          </HStack>
        </form>
      )}
    </FinalForm>
  )
}

export default CreatePlayerForm