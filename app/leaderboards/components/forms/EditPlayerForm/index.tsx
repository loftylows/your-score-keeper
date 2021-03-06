import * as React from "react"
import { Player } from "@prisma/client"
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
} from "@chakra-ui/core"
import { InfoIcon, DeleteIcon, CheckCircleIcon } from "@chakra-ui/icons"
import { toast } from "react-toastify"
import { Form as FinalForm, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import { EditPlayerInput, EditPlayerInputType } from "app/players/validations"
import { dbCacheLeaderboardsContext } from "app/leaderboards/DbCacheLeaderboardsProvider"
import { inMemoryLeaderboardsContext } from "app/leaderboards/InMemoryLeaderboardsProvider"
import { uiContext } from "app/leaderboards/LeaderboardsUiProvider"
import useCurrentlySelectedLeaderboardPlayers from "app/leaderboards/hooks/useCurrentPlayers"
import { Maybe } from "common-types"
import { InMemoryPlayer } from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import useCurrentlySelectedLeaderboard from "app/leaderboards/hooks/useCurrentlySelectedLeaderboard"

type CreatePlayerFormProps = {
  onSuccess?: () => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
  onFormFinished?: () => void
}

const CreatePlayerForm = (props: CreatePlayerFormProps) => {
  const [isDeletingPlayer, setIsDeletingPlayer] = React.useState(false)
  const componentProps = props
  const { userId, dbCacheEditPlayer, dbCacheDeletePlayer } = React.useContext(
    dbCacheLeaderboardsContext
  )
  const { inMemoryEditPlayer, inMemoryDeletePlayer } = React.useContext(inMemoryLeaderboardsContext)
  const players = useCurrentlySelectedLeaderboardPlayers()
  const currentlySelectedLeaderboard = useCurrentlySelectedLeaderboard()
  const { editPlayerDialogIsOpenWithId } = React.useContext(uiContext)
  const player: Maybe<Player> =
    ((players as any[]).find((p) => p.id === editPlayerDialogIsOpenWithId) as Player) || null

  if (!player) return null

  return (
    <FinalForm<EditPlayerInputType>
      initialValues={{ name: player.name, score: `${player.score}` }}
      validate={(values) => {
        try {
          EditPlayerInput.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values) => {
        props.onSubmitStart && props.onSubmitStart()
        try {
          if (userId) {
            dbCacheEditPlayer({ ...player, name: values.name, score: Number(values.score) })
          } else {
            inMemoryEditPlayer({
              ...player,
              name: values.name,
              score: Number(values.score),
            } as InMemoryPlayer)
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
            <CheckCircleIcon color="white" marginRight="3px" /> Player updated.
          </Box>,
          { progress: undefined }
        )
        props.onSubmitEnd && props.onSubmitEnd()
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Stack spacing={4}>
            <Field name="name">
              {(props) => (
                <FormControl
                  id="name"
                  isRequired
                  isInvalid={props.meta.error && props.meta.touched}
                >
                  <FormLabel>
                    Name <RequiredIndicator />
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
                      placeholder="Name..."
                    />
                  </InputGroup>
                  <FormErrorMessage>{props.meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="score">
              {(props) => (
                <FormControl
                  id="score"
                  isRequired
                  isInvalid={props.meta.error && props.meta.touched}
                >
                  <FormLabel>
                    Score <RequiredIndicator />
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
                      type="number"
                      placeholder="Score..."
                      onFocus={(e) => e.target.select()}
                    />
                  </InputGroup>
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
              disabled={isDeletingPlayer || props.submitting}
              isDisabled={isDeletingPlayer || props.submitting}
              isLoading={isDeletingPlayer}
              type="button"
              aria-label="Delete player"
              icon={<DeleteIcon />}
              onClick={() => {
                if (!currentlySelectedLeaderboard) return
                setIsDeletingPlayer(true)
                try {
                  if (userId) {
                    dbCacheDeletePlayer(player.id, currentlySelectedLeaderboard.id)
                  } else {
                    inMemoryDeletePlayer(player.id)
                  }
                } catch (error) {
                  return {
                    [FORM_ERROR]:
                      "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                  }
                } finally {
                  setIsDeletingPlayer(false)
                }
                toast.success(
                  <Box paddingX="8px">
                    <CheckCircleIcon color="white" marginRight="3px" /> Player deleted.
                  </Box>,
                  { progress: undefined }
                )
                componentProps.onFormFinished && componentProps.onFormFinished()
              }}
            />
          </Box>
        </form>
      )}
    </FinalForm>
  )
}

export default CreatePlayerForm
