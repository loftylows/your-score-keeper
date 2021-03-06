import * as React from "react"
import {
  Stack,
  FormLabel,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  RequiredIndicator,
  FormErrorMessage,
  ButtonGroup,
  Text,
  Select,
  Box,
} from "@chakra-ui/core"
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons"
import { Form as FinalForm, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import { CreateLeaderboardInput, CreateLeaderboardInputType } from "../../../validations"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { Router } from "blitz"
import { uiContext } from "app/leaderboards/LeaderboardsUiProvider"
import { toast } from "react-toastify"

type CreateLeaderboardFormProps = {
  onSuccess?: () => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
  onFormFinished?: () => void
}

const CreateLeaderboardForm = (props: CreateLeaderboardFormProps) => {
  const componentProps = props
  const { userId, dbCacheCreateLeaderboard } = React.useContext(dbCacheLeaderboardsContext)
  const { inMemoryCreateLeaderboard } = React.useContext(inMemoryLeaderboardsContext)
  const { setCurrentlySelectedLeaderboardId } = React.useContext(uiContext)

  return (
    <FinalForm<CreateLeaderboardInputType>
      initialValues={{ title: "", playersScoreSortDirection: "DESC" }}
      validate={(values) => {
        try {
          CreateLeaderboardInput.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values) => {
        props.onSubmitStart && props.onSubmitStart()
        try {
          if (userId) {
            const leaderboard = await dbCacheCreateLeaderboard({
              title: values.title,
              playersScoreSortDirection: values.playersScoreSortDirection,
              owner: { connect: { id: userId } },
            })

            leaderboard && Router.push(`/my-leaderboards?id=${leaderboard.id}`)
          } else {
            const leaderboard = inMemoryCreateLeaderboard({
              title: values.title,
              playersScoreSortDirection: values.playersScoreSortDirection,
            })

            setCurrentlySelectedLeaderboardId && setCurrentlySelectedLeaderboardId(leaderboard.id)
            Router.push(`/my-leaderboards`)
          }
          props.onSuccess && props.onSuccess()
        } catch (error) {
          return {
            [FORM_ERROR]:
              "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
          }
        }
        toast.success(
          <Box paddingX="8px">
            <CheckCircleIcon color="white" marginRight="3px" /> Leaderboard created.
          </Box>,
          { progress: undefined }
        )
        props.onSubmitEnd && props.onSubmitEnd()
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Stack spacing={4}>
            <Field name="title">
              {(props) => (
                <FormControl
                  id="title"
                  isRequired
                  isInvalid={props.meta.error && props.meta.touched}
                >
                  <FormLabel>
                    Title <RequiredIndicator />
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<InfoIcon color="gray.300" />}
                    />
                    <Input
                      {...props.input}
                      errorBorderColor="crimson"
                      isInvalid={props.meta.touched && props.meta.invalid}
                      type="text"
                      placeholder="Title..."
                    />
                  </InputGroup>
                  <FormErrorMessage>{props.meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="playersScoreSortDirection">
              {(props) => (
                <FormControl
                  id="playersScoreSortDirection"
                  isRequired
                  isInvalid={props.meta.error && props.meta.touched}
                >
                  <FormLabel>
                    Players Score Sort Direction <RequiredIndicator />
                  </FormLabel>
                  <Select
                    {...props.input}
                    placeholder="Players score sort direction"
                    isInvalid={props.meta.touched && props.meta.invalid}
                  >
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                  </Select>
                  <FormErrorMessage>{props.meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            {props.submitError && <Text style={{ color: "red" }}>{props.submitError}</Text>}
          </Stack>

          <ButtonGroup marginY="20px">
            <Button
              mr={3}
              onClick={() => componentProps.onFormFinished && componentProps.onFormFinished()}
              backgroundColor="gray.600"
              _hover={{ backgroundColor: "gray.700" }}
              color="white"
            >
              Close
            </Button>
            <Button
              colorScheme="blue"
              isLoading={props.submitting}
              disabled={props.submitting}
              isDisabled={props.submitting}
              type="submit"
            >
              Submit
            </Button>
          </ButtonGroup>
        </form>
      )}
    </FinalForm>
  )
}

export default CreateLeaderboardForm
