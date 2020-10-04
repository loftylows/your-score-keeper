import React from "react"
import {
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
} from "@chakra-ui/core"
import { EmailIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons"
import { Form as FinalForm, Field } from "react-final-form"
import { FORM_ERROR } from "final-form"
import login from "app/auth/mutations/login"
import { LoginInputType, LoginInput } from "app/auth/validations"

type LoginFormProps = {
  onSuccess?: () => void
  onSubmitStart?: () => void
  onSubmitEnd?: () => void
  onFormFinished?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const componentProps = props
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible)
  return (
    <FinalForm<LoginInputType>
      initialValues={{ email: "", password: "" }}
      validate={(values) => {
        try {
          LoginInput.parse(values)
        } catch (error) {
          return error.formErrors.fieldErrors
        }
      }}
      onSubmit={async (values) => {
        props.onSubmitStart && props.onSubmitStart()
        try {
          await login({ email: values.email, password: values.password })
          props.onSuccess && props.onSuccess()
        } catch (error) {
          if (error.name === "AuthenticationError") {
            return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
          } else {
            return {
              [FORM_ERROR]:
                "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
            }
          }
        }
        props.onSubmitEnd && props.onSubmitEnd()
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Stack spacing={4}>
            <Field name="email">
              {(props) => (
                <FormControl
                  id="email"
                  isRequired
                  isInvalid={props.meta.error && props.meta.touched}
                >
                  <FormLabel>
                    Email address <RequiredIndicator />
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<EmailIcon color="gray.300" />}
                    />
                    <Input
                      {...props.input}
                      errorBorderColor="crimson"
                      isInvalid={props.meta.touched && props.meta.invalid}
                      type="email"
                      placeholder="Email..."
                    />
                  </InputGroup>
                  <FormErrorMessage>{props.meta.error}</FormErrorMessage>
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

export default LoginForm
