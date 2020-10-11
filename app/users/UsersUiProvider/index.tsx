import { Maybe, UUID } from "common-types"
import * as React from "react"
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
} from "@chakra-ui/core"
import { OpenEditCurrentUserDialog, CloseEditCurrentUserDialog } from "./types"
import EditUserForm from "../components/forms/EditUserForm"

interface IProps {
  children: React.ReactChild
}
interface IState {
  editCurrentUserIsOpen: boolean
  openEditCurrentUserDialog: OpenEditCurrentUserDialog
  closeEditCurrentUserDialog: CloseEditCurrentUserDialog
}

const usersUiContext = React.createContext<IState>({
  editCurrentUserIsOpen: false,
  openEditCurrentUserDialog: () => {},
  closeEditCurrentUserDialog: () => {},
})
class UsersUiDialogsProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      editCurrentUserIsOpen: false,
      openEditCurrentUserDialog: this.openEditCurrentUserDialog,
      closeEditCurrentUserDialog: this.closeEditCurrentUserDialog,
    }
  }

  openEditCurrentUserDialog = () => this.setState({ editCurrentUserIsOpen: true })
  closeEditCurrentUserDialog = () => this.setState({ editCurrentUserIsOpen: false })

  render() {
    const { children } = this.props
    const { state } = this
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
      </usersUiContext.Provider>
    )
  }
}

export { usersUiContext }
export default UsersUiDialogsProvider
