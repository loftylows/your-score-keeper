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
} from "@chakra-ui/core"
import { InfoIcon } from "@chakra-ui/icons"
import { Form as FinalForm, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import { EditLeaderboardInput, EditLeaderboardInputType } from "../../../validations"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { uiContext } from "app/leaderboards/UiProvider"
import { Leaderboard } from "@prisma/client"
import { InMemoryLeaderboard } from "app/leaderboards/InMemoryLeaderboardsProvider/types"

type EditLeaderboardFormProps = {
  onSuccess?: () => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
  onFormFinished?: () => void
}

const EditLeaderboardForm = (props: EditLeaderboardFormProps) => {
  const componentProps = props
  const { userId, dbCacheEditLeaderboard, leaderboards: dbLeaderboards } = React.useContext(
    dbCacheLeaderboardsContext
  )
  const { inMemoryEditLeaderboard, leaderboards: inMemoryLeaderboards } = React.useContext(
    inMemoryLeaderboardsContext
  )
  const { editLeaderboardDialogIsOpenWithId } = React.useContext(uiContext)
  const leaderboards = userId ? dbLeaderboards : inMemoryLeaderboards
  const editingLeaderboard = editLeaderboardDialogIsOpenWithId
    ? leaderboards.find((l) => l.id === editLeaderboardDialogIsOpenWithId)
    : null

  return (
    <FinalForm<EditLeaderboardInputType>
      initialValues={{ title: editingLeaderboard ? editingLeaderboard.title : "" }}
      validate={(values) => {
        try {
          EditLeaderboardInput.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values) => {
        props.onSubmitStart && props.onSubmitStart()
        if (!editingLeaderboard) return
        const updatedLeaderboard = {
          ...(editingLeaderboard as Leaderboard),
          title: values.title,
          ownerId: undefined,
        }
        try {
          if (userId) {
            dbCacheEditLeaderboard(updatedLeaderboard)
          } else {
            inMemoryEditLeaderboard(updatedLeaderboard)
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

export default EditLeaderboardForm