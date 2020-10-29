import * as React from "react"
import {
  Box,
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
  IconButton,
  Select,
} from "@chakra-ui/core"
import { toast } from "react-toastify"
import { CheckCircleIcon, DeleteIcon, InfoIcon } from "@chakra-ui/icons"
import { Form as FinalForm, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import { EditLeaderboardInput, EditLeaderboardInputType } from "../../../validations"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { Leaderboard, LeaderboardPlayersScoreSortDirection } from "@prisma/client"
import { uiContext } from "app/leaderboards/LeaderboardsUiProvider"

type EditLeaderboardFormProps = {
  onSuccess?: () => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
  onFormFinished?: () => void
}

const EditLeaderboardForm = (props: EditLeaderboardFormProps) => {
  const [isDeletingLeaderboard] = React.useState(false)
  const componentProps = props
  const { userId, dbCacheEditLeaderboard, leaderboards: dbLeaderboards } = React.useContext(
    dbCacheLeaderboardsContext
  )
  const { inMemoryEditLeaderboard, leaderboards: inMemoryLeaderboards } = React.useContext(
    inMemoryLeaderboardsContext
  )
  const { editLeaderboardDialogIsOpenWithId, setDeletingLeaderboardWithId } = React.useContext(
    uiContext
  )
  const leaderboards = userId ? dbLeaderboards : inMemoryLeaderboards
  const editingLeaderboard = editLeaderboardDialogIsOpenWithId
    ? leaderboards.find((l) => l.id === editLeaderboardDialogIsOpenWithId)
    : null

  return (
    <FinalForm<EditLeaderboardInputType>
      initialValues={{
        title: editingLeaderboard ? editingLeaderboard.title : "",
        playersScoreSortDirection: (editingLeaderboard
          ? editingLeaderboard.playersScoreSortDirection
          : "DESC") as LeaderboardPlayersScoreSortDirection,
      }}
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
          playersScoreSortDirection: values.playersScoreSortDirection as LeaderboardPlayersScoreSortDirection,
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
        toast.success(
          <Box paddingX="8px">
            <CheckCircleIcon color="white" marginRight="3px" /> Leaderboard updated.
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

          <Box display="flex" alignItems="center">
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
            <IconButton
              variant="outline"
              marginLeft="auto"
              colorScheme="red"
              disabled={isDeletingLeaderboard || props.submitting}
              isDisabled={isDeletingLeaderboard || props.submitting}
              isLoading={isDeletingLeaderboard}
              type="button"
              aria-label="Delete player"
              icon={<DeleteIcon />}
              onClick={() => {
                if (!editingLeaderboard) return
                if (componentProps.onFormFinished) componentProps.onFormFinished()
                setDeletingLeaderboardWithId(editingLeaderboard.id)
              }}
            />
          </Box>
        </form>
      )}
    </FinalForm>
  )
}

export default EditLeaderboardForm
