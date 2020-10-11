import * as React from "react"
import { Router } from "blitz"
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/core"
import {
  OpenEditCurrentUserDialog,
  CloseEditCurrentUserDialog,
  OpenDeleteCurrentUserDialog,
  CloseDeleteCurrentUserDialog,
} from "./types"
import EditUserForm from "../components/forms/EditUserForm"
import deleteAccount from "app/auth/deleteAccount"
import {
  ACCOUNT_DELETED_EVENT_NAME,
  LOGIN_COMPLETED_EVENT_NAME,
  LOGOUT_EVENT_NAME,
} from "app/browserEvents"
import { ToastContext, ToastType } from "app/components/ToastProvider"

interface IProps {
  children: React.ReactChild
  toast: ToastType
}
interface IState {
  accountDeletionInProgress: boolean
  editCurrentUserIsOpen: boolean
  openEditCurrentUserDialog: OpenEditCurrentUserDialog
  closeEditCurrentUserDialog: CloseEditCurrentUserDialog
  deleteCurrentUserIsOpen: boolean
  openDeleteCurrentUserDialog: OpenDeleteCurrentUserDialog
  closeDeleteCurrentUserDialog: CloseDeleteCurrentUserDialog
}

const usersUiContext = React.createContext<IState>({
  accountDeletionInProgress: false,
  editCurrentUserIsOpen: false,
  openEditCurrentUserDialog: () => {},
  closeEditCurrentUserDialog: () => {},
  deleteCurrentUserIsOpen: false,
  openDeleteCurrentUserDialog: () => {},
  closeDeleteCurrentUserDialog: () => {},
})
class UsersUiDialogsProvider extends React.Component<IProps, IState> {
  _cancelButtonRef = React.createRef<HTMLButtonElement>()
  constructor(props: IProps) {
    super(props)

    this.state = {
      accountDeletionInProgress: false,
      editCurrentUserIsOpen: false,
      openEditCurrentUserDialog: this.openEditCurrentUserDialog,
      closeEditCurrentUserDialog: this.closeEditCurrentUserDialog,
      deleteCurrentUserIsOpen: false,
      openDeleteCurrentUserDialog: this.openDeleteCurrentUserDialog,
      closeDeleteCurrentUserDialog: this.closeDeleteCurrentUserDialog,
    }
  }

  componentDidMount = () => {
    window.addEventListener(ACCOUNT_DELETED_EVENT_NAME, this.openAccountDeletedToast)
    window.addEventListener(LOGIN_COMPLETED_EVENT_NAME, this.openLoginToast)
    window.addEventListener(LOGOUT_EVENT_NAME, this.openLogoutToast)
  }

  componentWillUnmount = () => {
    window.removeEventListener(ACCOUNT_DELETED_EVENT_NAME, this.openAccountDeletedToast)
    window.removeEventListener(LOGIN_COMPLETED_EVENT_NAME, this.openLoginToast)
    window.removeEventListener(LOGOUT_EVENT_NAME, this.openLogoutToast)
  }

  toggleAccountDeletionInProgress = () => {
    const { accountDeletionInProgress } = this.state
    this.setState({
      accountDeletionInProgress: !accountDeletionInProgress,
    })
  }

  openEditCurrentUserDialog = () => this.setState({ editCurrentUserIsOpen: true })
  closeEditCurrentUserDialog = () => this.setState({ editCurrentUserIsOpen: false })
  openDeleteCurrentUserDialog = () => this.setState({ deleteCurrentUserIsOpen: true })
  closeDeleteCurrentUserDialog = () => this.setState({ deleteCurrentUserIsOpen: false })

  openLoginToast = () => {
    const { toast } = this.props
    toast({
      title: "Welcome Back.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    })
  }

  openLogoutToast = () => {
    const { toast } = this.props
    toast({
      title: "Logged Out.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    })
  }

  openAccountDeletedToast = () => {
    const { toast } = this.props
    toast({
      title: "Account Deleted.",
      description: "Thanks for using our software. Hope to see you again soon.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    })
  }

  render() {
    const { children } = this.props
    const { state, _cancelButtonRef } = this
    return (
      <usersUiContext.Provider value={state}>
        {children}

        {/* Create leaderboard dialog */}
        <Modal isOpen={state.editCurrentUserIsOpen} onClose={state.closeEditCurrentUserDialog}>
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>Account Info</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {state.editCurrentUserIsOpen && (
                  <EditUserForm
                    onFormFinished={state.closeEditCurrentUserDialog}
                    onSuccess={state.closeEditCurrentUserDialog}
                  />
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>

        <AlertDialog
          isOpen={state.deleteCurrentUserIsOpen}
          leastDestructiveRef={_cancelButtonRef}
          onClose={this.closeDeleteCurrentUserDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={this._cancelButtonRef} onClick={this.closeDeleteCurrentUserDialog}>
                  Cancel
                </Button>
                <Button
                  ml={3}
                  colorScheme="red"
                  isLoading={state.accountDeletionInProgress}
                  onClick={async () => {
                    this.toggleAccountDeletionInProgress()
                    try {
                      await deleteAccount()
                      this.closeDeleteCurrentUserDialog()
                    } catch (e) {
                      console.log(e)
                    } finally {
                      this.toggleAccountDeletionInProgress()
                    }
                  }}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </usersUiContext.Provider>
    )
  }
}

interface IPropsExt {
  children: React.ReactChild
}
const Provider = ({ children }: IPropsExt) => {
  return (
    <ToastContext.Consumer>
      {(toast) => <UsersUiDialogsProvider toast={toast}>{children}</UsersUiDialogsProvider>}
    </ToastContext.Consumer>
  )
}

export { usersUiContext }
export default Provider
