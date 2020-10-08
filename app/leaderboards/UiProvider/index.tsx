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
import { dbCacheLeaderboardsContext } from "../DbCacheLeaderboardsProvider"
import {
  OpenCreateLeaderboardDialog,
  CloseCreateLeaderboardDialog,
  OpenEditLeaderboardDialog,
  CloseEditLeaderboardDialog,
  OpenCreatePlayerDialog,
  CloseCreatePlayerDialog,
  OpenEditPlayerDialog,
  CloseEditPlayerDialog,
  SetCurrentlySelectedLeaderboardId,
  RemoveCurrentlySelectedLeaderboardId,
} from "./types"
import CreateLeaderboardForm from "../forms/CreateLeaderboardForm"
import EditLeaderboardForm from "../forms/EditLeaderboardForm"

interface IProps {
  children: React.ReactChild
  userId: Maybe<UUID>
}
interface IState {
  createLeaderboardDialogIsOpen: boolean
  editLeaderboardDialogIsOpenWithId: Maybe<UUID>
  createPlayerDialogIsOpen: boolean
  editPlayerDialogIsOpenWithId: Maybe<UUID>
  currentlySelectedLeaderboardId: Maybe<UUID>
  setCurrentlySelectedLeaderboardId: SetCurrentlySelectedLeaderboardId
  removeCurrentlySelectedLeaderboardId: RemoveCurrentlySelectedLeaderboardId
  openCreateLeaderboardDialog: OpenCreateLeaderboardDialog
  closeCreateLeaderboardDialog: CloseCreateLeaderboardDialog
  openEditLeaderboardDialog: OpenEditLeaderboardDialog
  closeEditLeaderboardDialog: CloseEditLeaderboardDialog
  openCreatePlayerDialog: OpenCreatePlayerDialog
  closeCreatePlayerDialog: CloseCreatePlayerDialog
  openEditPlayerDialog: OpenEditPlayerDialog
  closeEditPlayerDialog: CloseEditPlayerDialog
}

const uiContext = React.createContext<IState>({
  createLeaderboardDialogIsOpen: false,
  editLeaderboardDialogIsOpenWithId: null,
  createPlayerDialogIsOpen: false,
  editPlayerDialogIsOpenWithId: null,
  currentlySelectedLeaderboardId: null,
  setCurrentlySelectedLeaderboardId: () => {},
  removeCurrentlySelectedLeaderboardId: () => {},
  openCreateLeaderboardDialog: () => {},
  closeCreateLeaderboardDialog: () => {},
  openEditLeaderboardDialog: () => {},
  closeEditLeaderboardDialog: () => {},
  openCreatePlayerDialog: () => {},
  closeCreatePlayerDialog: () => {},
  openEditPlayerDialog: () => {},
  closeEditPlayerDialog: () => {},
})
class DialogsProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      createLeaderboardDialogIsOpen: false,
      editLeaderboardDialogIsOpenWithId: null,
      createPlayerDialogIsOpen: false,
      editPlayerDialogIsOpenWithId: null,
      currentlySelectedLeaderboardId: null,
      setCurrentlySelectedLeaderboardId: this.setCurrentlySelectedLeaderboardId,
      removeCurrentlySelectedLeaderboardId: this.removeCurrentlySelectedLeaderboardId,
      openCreateLeaderboardDialog: this.openCreateLeaderboardDialog,
      closeCreateLeaderboardDialog: this.closeCreateLeaderboardDialog,
      openEditLeaderboardDialog: this.openEditLeaderboardDialog,
      closeEditLeaderboardDialog: this.closeEditLeaderboardDialog,
      openCreatePlayerDialog: this.openCreatePlayerDialog,
      closeCreatePlayerDialog: this.closeCreatePlayerDialog,
      openEditPlayerDialog: this.openEditPlayerDialog,
      closeEditPlayerDialog: this.closeEditPlayerDialog,
    }
  }

  setCurrentlySelectedLeaderboardId = (id) => this.setState({ currentlySelectedLeaderboardId: id })
  removeCurrentlySelectedLeaderboardId = () =>
    this.setState({ currentlySelectedLeaderboardId: null })
  openCreateLeaderboardDialog = () => this.setState({ createLeaderboardDialogIsOpen: true })
  closeCreateLeaderboardDialog = () => this.setState({ createLeaderboardDialogIsOpen: false })
  openEditLeaderboardDialog = (leaderboardId) =>
    this.setState({ editLeaderboardDialogIsOpenWithId: leaderboardId })
  closeEditLeaderboardDialog = () => this.setState({ editLeaderboardDialogIsOpenWithId: null })
  openCreatePlayerDialog = () => this.setState({ createPlayerDialogIsOpen: true })
  closeCreatePlayerDialog = () => this.setState({ createPlayerDialogIsOpen: false })
  openEditPlayerDialog = (playerId) => this.setState({ editPlayerDialogIsOpenWithId: playerId })
  closeEditPlayerDialog = () => this.setState({ editPlayerDialogIsOpenWithId: null })

  render() {
    const { children } = this.props
    const { state } = this
    return (
      <uiContext.Provider value={state}>
        {children}

        {/* Create leaderboard dialog */}
        <Modal
          isOpen={state.createLeaderboardDialogIsOpen}
          onClose={state.closeCreateLeaderboardDialog}
        >
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>Create Leaderboard</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {state.createLeaderboardDialogIsOpen && (
                  <CreateLeaderboardForm
                    onFormFinished={state.closeCreateLeaderboardDialog}
                    onSuccess={state.closeCreateLeaderboardDialog}
                  />
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>

        <Modal
          isOpen={!!state.editLeaderboardDialogIsOpenWithId}
          onClose={state.closeEditLeaderboardDialog}
        >
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>Edit Leaderboard</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {state.editLeaderboardDialogIsOpenWithId && (
                  <EditLeaderboardForm
                    onFormFinished={state.closeEditLeaderboardDialog}
                    onSuccess={state.closeEditLeaderboardDialog}
                  />
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </uiContext.Provider>
    )
  }
}
interface IProviderProps {
  children: React.ReactChild
}
const Provider = ({ children }: IProviderProps) => {
  return (
    <dbCacheLeaderboardsContext.Consumer>
      {({ userId }) => <DialogsProvider userId={userId}>{children}</DialogsProvider>}
    </dbCacheLeaderboardsContext.Consumer>
  )
}

export { uiContext }
export default Provider
