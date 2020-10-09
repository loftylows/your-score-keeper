import * as React from "react"
import {
  HStack,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Box,
} from "@chakra-ui/core"
import { InfoIcon } from "@chakra-ui/icons"
import { Form as FinalForm, Field, useForm } from "react-final-form"
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

const initialFormVals = { name: "", score: "0" }

const CreatePlayerForm = (props: CreatePlayerFormProps) => {
  const { leaderboardId } = props
  const { userId, dbCacheCreatePlayer } = React.useContext(dbCacheLeaderboardsContext)
  const { inMemoryCreatePlayer } = React.useContext(inMemoryLeaderboardsContext)

  return (
    <FinalForm<CreatePlayerInputType>
      initialValues={initialFormVals}
      validate={(values) => {
        try {
          CreatePlayerInput.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values, formApi) => {
        props.onSubmitStart && props.onSubmitStart()
        try {
          if (userId) {
            await dbCacheCreatePlayer(leaderboardId, {
              name: values.name,
              score: Number(values.score),
              leaderboard: { connect: { id: leaderboardId } },
            })
          } else {
            await inMemoryCreatePlayer(leaderboardId, {
              name: values.name,
              score: Number(values.score),
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
        <form
          onSubmit={async (event) => {
            await props.handleSubmit(event)
            props.form.reset()
          }}
          style={{
            marginBottom: "30px",
          }}
        >
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
                      onFocus={(e) => e.target.select()}
                    />
                  </InputGroup>
                </FormControl>
              )}
            </Field>

            <Button
              size="lg"
              variant="outline"
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
