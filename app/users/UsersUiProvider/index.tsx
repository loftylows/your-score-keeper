import * as React from "react"
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
  Box,
  Spinner,
} from "@chakra-ui/core"
import { toast } from "react-toastify"
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
import { CheckCircleIcon } from "@chakra-ui/icons"

interface IProps {
  children: React.ReactChild
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
    toast.success(
      <Box paddingX="8px">
        <CheckCircleIcon color="white" marginRight="3px" /> Welcome back!
      </Box>,
      { progress: undefined }
    )
  }

  openLogoutToast = () => {
    toast.success(
      <Box paddingX="8px">
        <CheckCircleIcon color="white" marginRight="3px" /> Logged out.
      </Box>,
      { progress: undefined }
    )
  }

  openAccountDeletedToast = () => {
    toast.success(
      <Box paddingX="8px">
        <CheckCircleIcon color="white" marginRight="3px" /> Account deleted. Hope to see you agin
        soon.
      </Box>,
      { progress: undefined }
    )
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
                  <React.Suspense
                    fallback={
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                      >
                        <Spinner />
                      </Box>
                    }
                  >
                    <EditUserForm
                      onFormFinished={state.closeEditCurrentUserDialog}
                      onSuccess={state.closeEditCurrentUserDialog}
                    />
                  </React.Suspense>
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

export { usersUiContext }
export default UsersUiDialogsProvider
