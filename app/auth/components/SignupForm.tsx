import React from "react"
import { FaUser } from "react-icons/fa"
import {
  Icon,
  Stack,
  FormLabel,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  RequiredIndicator,
  FormErrorMessage,
  ButtonGroup,
  Text,
  VStack,
  Box,
} from "@chakra-ui/core"
import { EmailIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons"
import { Form as FinalForm, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import { SignupInputType, SignupInput } from "app/auth/validations"
import { signupWithEmailAndPassword } from "../signup"

type SignupFormProps = {
  onSuccess?: () => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
  onFormFinished?: () => void
  toggleAuthFormType?: () => any
}

export const SignupForm = (props: SignupFormProps) => {
  const componentProps = props
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible)
  return (
    <FinalForm<SignupInputType>
      initialValues={{ username: "", email: "", password: "", passwordConfirmation: "" }}
      validate={(values) => {
        try {
          SignupInput.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values) => {
        const errors = { email: "", username: "" }
        props.onSubmitStart && props.onSubmitStart()
        try {
          await signupWithEmailAndPassword({
            username: values.username,
            email: values.email,
            password: values.password,
            passwordConfirmation: values.passwordConfirmation,
          })

          props.onSuccess && props.onSuccess()
        } catch (error) {
          if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            // This error comes from Prisma
            errors.email = "This email is already being used"
          } else if (error.code === "P2002" && error.meta?.target?.includes("username")) {
            // This error comes from Prisma
            errors.username = "This username is already being used"
          } else {
            errors[FORM_ERROR] = error.toString()
          }
        } finally {
          props.onSubmitEnd && props.onSubmitEnd()
          return errors
        }
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Stack spacing={4}>
            <Field name="username">
              {(innerProps) => (
                <FormControl
                  id="username"
                  isRequired
                  isInvalid={innerProps.meta.touched && innerProps.meta.invalid}
                >
                  <FormLabel htmlFor="username">
                    Username <RequiredIndicator />
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<Icon as={FaUser} color="gray.300" />}
                    />
                    <Input
                      {...innerProps.input}
                      errorBorderColor="crimson"
                      isInvalid={innerProps.meta.touched && innerProps.meta.invalid}
                      type="text"
                      placeholder="Username..."
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {innerProps.meta.error || props.submitErrors?.username}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="email">
              {(innerProps) => (
                <FormControl
                  id="email"
                  isRequired
                  isInvalid={innerProps.meta.error && innerProps.meta.touched}
                >
                  <FormLabel htmlFor="email">
                    Email address <RequiredIndicator />
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<EmailIcon color="gray.300" />}
                    />
                    <Input
                      {...innerProps.input}
                      errorBorderColor="crimson"
                      isInvalid={innerProps.meta.touched && innerProps.meta.invalid}
                      type="email"
                      placeholder="Email..."
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {innerProps.meta.error || props.submitErrors?.email}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="password">
              {(props) => (
                <FormControl
                  id="password"
                  isRequired
                  isInvalid={props.meta.error && props.meta.touched}
                >
                  <FormLabel>
                    Password <RequiredIndicator />
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      children={
                        passwordVisible ? (
                          <UnlockIcon color="gray.300" />
                        ) : (
                          <LockIcon color="gray.300" />
                        )
                      }
                    />
                    <Input
                      {...props.input}
                      errorBorderColor="crimson"
                      isInvalid={props.meta.touched && props.meta.invalid}
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Password..."
                    />

                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={togglePasswordVisible}>
                        {passwordVisible ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{props.meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="passwordConfirmation">
              {(props) => (
                <FormControl
                  id="passwordConfirmation"
                  isRequired
                  isInvalid={props.meta.error && props.meta.touched}
                >
                  <FormLabel>
                    Password Confirmation <RequiredIndicator />
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      children={
                        passwordVisible ? (
                          <UnlockIcon color="gray.300" />
                        ) : (
                          <LockIcon color="gray.300" />
                        )
                      }
                    />
                    <Input
                      {...props.input}
                      errorBorderColor="crimson"
                      isInvalid={props.meta.touched && props.meta.invalid}
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Password confirmation..."
                    />

                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={togglePasswordVisible}>
                        {passwordVisible ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
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

          {componentProps.toggleAuthFormType && (
            <VStack>
              <Box>or</Box>
              <Button variant="ghost" onClick={componentProps.toggleAuthFormType}>
                Want to log in?
              </Button>
            </VStack>
          )}
        </form>
      )}
    </FinalForm>
  )
}

export default SignupForm
