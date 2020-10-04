import * as React from "react"
import { Maybe } from "common-types"
import {
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/core"
import LoginForm from "./components/LoginForm"
import SignupForm from "./components/SignupForm"

export type AuthModalType = "login" | "signup"
export type OpenAuthModal = (authModalDetails: { type: AuthModalType }) => void
export type ToggleAuthModal = () => void
export type CloseAuthModal = () => void
export type SetAuthRequestInProgress = (bool: boolean) => void

interface IState {
  authModalDetails: Maybe<{ type: AuthModalType }>
  openAuthModal: OpenAuthModal
  toggleAuthModalType: ToggleAuthModal
  closeAuthModal: CloseAuthModal
  authRequestInProgress: boolean
}

export const authModalContext = React.createContext<IState>({
  authModalDetails: null,
  openAuthModal: () => {},
  toggleAuthModalType: () => {},
  closeAuthModal: () => {},
  authRequestInProgress: false,
})
class AuthProvider extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      authModalDetails: null,
      openAuthModal: this.openAuthModal,
      toggleAuthModalType: this.toggleAuthModalType,
      closeAuthModal: this.closeAuthModal,
      authRequestInProgress: false,
    }
  }

  openAuthModal: OpenAuthModal = (authModalDetails) => {
    this.setState({
      authModalDetails: authModalDetails,
    })
  }

  toggleAuthModalType: ToggleAuthModal = () => {
    const { authModalDetails } = this.state
    if (!authModalDetails) return

    const oppositeModalType: AuthModalType = authModalDetails.type === "signup" ? "login" : "signup"
    this.setState({
      authModalDetails: { type: oppositeModalType },
    })
  }

  closeAuthModal: CloseAuthModal = () => {
    this.setState({
      authModalDetails: null,
    })
  }

  setAuthRequestInProgress: SetAuthRequestInProgress = (bool) => {
    this.setState({
      authRequestInProgress: bool,
    })
  }

  render() {
    const { authModalDetails, authRequestInProgress } = this.state
    const isOpen = !!authModalDetails
    const authModalType = authModalDetails ? authModalDetails.type : null
    const title = !isOpen ? null : authModalType === "login" ? "Log In" : "Sign Up"

    return (
      <authModalContext.Provider value={this.state}>
        {this.props.children}

        <Modal isOpen={isOpen} onClose={this.closeAuthModal}>
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>{title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {!isOpen ? null : authModalType === "login" ? (
                  <LoginForm onSuccess={this.closeAuthModal} onFormFinished={this.closeAuthModal} />
                ) : (
                  <SignupForm />
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </authModalContext.Provider>
    )
  }
}

export default AuthProvider
