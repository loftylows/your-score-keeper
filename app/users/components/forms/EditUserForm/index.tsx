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
  useToast,
  IconButton,
  Box,
} from "@chakra-ui/core"
import { DeleteIcon, InfoIcon } from "@chakra-ui/icons"
import { Form as FinalForm, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import { EditUserInput, EditUserInputType } from "../../../validations"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import updateUser from "app/users/mutations/updateUser"
import { usersUiContext } from "app/users/UsersUiProvider"

type EditUserFormProps = {
  onSuccess?: () => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
  onFormFinished?: () => void
}

const EditUserForm = (props: EditUserFormProps) => {
  const componentProps = props
  const { openDeleteCurrentUserDialog, closeEditCurrentUserDialog } = React.useContext(
    usersUiContext
  )
  const user = useCurrentUser()
  const toast = useToast()
  if (!user) return null

  return (
    <FinalForm<EditUserInputType>
      initialValues={{ name: user.name }}
      validate={(values) => {
        try {
          EditUserInput.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values) => {
        props.onSubmitStart && props.onSubmitStart()
        try {
          await updateUser({ where: { id: user.id }, data: { name: values.name } })
          props.onSuccess && props.onSuccess()
        } catch (error) {
          return {
            [FORM_ERROR]:
              "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
          }
        }
        toast({
          title: "User Profile Info Updated.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        })
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
                      placeholder="Name..."
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
              disabled={props.submitting}
              isDisabled={props.submitting}
              type="button"
              aria-label="Delete player"
              icon={<DeleteIcon />}
              onClick={() => {
                props.form.reset()
                closeEditCurrentUserDialog()
                openDeleteCurrentUserDialog()
              }}
            />
          </Box>
        </form>
      )}
    </FinalForm>
  )
}

export default EditUserForm
