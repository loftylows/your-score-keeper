import { Maybe, UUID } from "common-types"
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
} from "@chakra-ui/core"
import { toast } from "react-toastify"
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
  SetPublishingLeaderboardWithId,
  SetUnpublishingLeaderboardWithId,
  SetDeletingLeaderboardWithId,
} from "./types"
import CreateLeaderboardForm from "../components/forms/CreateLeaderboardForm"
import EditLeaderboardForm from "../components/forms/EditLeaderboardForm"
import EditPlayerForm from "../components/forms/EditPlayerForm"
import {
  DbCacheDeleteLeaderboard,
  DbCachePublishLeaderboard,
  DbCacheUnpublishLeaderboard,
} from "../DbCacheLeaderboardsProvider/types"
import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons"
import { inMemoryLeaderboardsContext } from "../InMemoryLeaderboardsProvider"
import { InMemoryDeleteLeaderboard } from "../InMemoryLeaderboardsProvider/types"

interface IProps {
  children: React.ReactChild
  userId: Maybe<UUID>
  dbCachePublishLeaderboard: DbCachePublishLeaderboard
  dbCacheUnpublishLeaderboard: DbCacheUnpublishLeaderboard
  dbCacheDeleteLeaderboard: DbCacheDeleteLeaderboard
  inMemoryDeleteLeaderboard: InMemoryDeleteLeaderboard
}
interface IState {
  createLeaderboardDialogIsOpen: boolean
  editLeaderboardDialogIsOpenWithId: Maybe<UUID>
  createPlayerDialogIsOpen: boolean
  editPlayerDialogIsOpenWithId: Maybe<UUID>
  currentlySelectedLeaderboardId: Maybe<UUID>
  publishingLeaderboardWithId: Maybe<UUID>
  leaderboardPublishingInProgress: boolean
  unpublishingLeaderboardWithId: Maybe<UUID>
  leaderboardUnpublishingInProgress: boolean
  deletingLeaderboardWithId: Maybe<UUID>
  leaderboardDeletingInProgress: boolean
  setPublishingLeaderboardWithId: SetPublishingLeaderboardWithId
  setUnpublishingLeaderboardWithId: SetUnpublishingLeaderboardWithId
  setDeletingLeaderboardWithId: SetDeletingLeaderboardWithId
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
  publishingLeaderboardWithId: null,
  leaderboardPublishingInProgress: false,
  unpublishingLeaderboardWithId: null,
  leaderboardUnpublishingInProgress: false,
  deletingLeaderboardWithId: null,
  leaderboardDeletingInProgress: false,
  setPublishingLeaderboardWithId: () => {},
  setUnpublishingLeaderboardWithId: () => {},
  setDeletingLeaderboardWithId: () => {},
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
  _cancelPublishingLeaderboardButtonRef = React.createRef<HTMLButtonElement>()
  _cancelUnpublishingLeaderboardButtonRef = React.createRef<HTMLButtonElement>()
  _cancelDeletingLeaderboardButtonRef = React.createRef<HTMLButtonElement>()
  constructor(props: IProps) {
    super(props)

    this.state = {
      createLeaderboardDialogIsOpen: false,
      editLeaderboardDialogIsOpenWithId: null,
      createPlayerDialogIsOpen: false,
      editPlayerDialogIsOpenWithId: null,
      currentlySelectedLeaderboardId: null,
      publishingLeaderboardWithId: null,
      leaderboardPublishingInProgress: false,
      unpublishingLeaderboardWithId: null,
      leaderboardUnpublishingInProgress: false,
      deletingLeaderboardWithId: null,
      leaderboardDeletingInProgress: false,
      setPublishingLeaderboardWithId: this.setPublishingLeaderboardWithId,
      setUnpublishingLeaderboardWithId: this.setUnpublishingLeaderboardWithId,
      setDeletingLeaderboardWithId: this.setDeletingLeaderboardWithId,
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

  setCurrentlySelectedLeaderboardId = (id: UUID) =>
    this.setState({ currentlySelectedLeaderboardId: id })
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
  setPublishingLeaderboardWithId: SetPublishingLeaderboardWithId = (id) =>
    this.setState({ publishingLeaderboardWithId: id })
  toggleLeaderboardPublishingInProgress = () =>
    this.setState({ leaderboardPublishingInProgress: !this.state.leaderboardPublishingInProgress })
  setUnpublishingLeaderboardWithId: SetUnpublishingLeaderboardWithId = (id) =>
    this.setState({ unpublishingLeaderboardWithId: id })
  toggleLeaderboardUnpublishingInProgress = () =>
    this.setState({
      leaderboardUnpublishingInProgress: !this.state.leaderboardPublishingInProgress,
    })
  setDeletingLeaderboardWithId: SetDeletingLeaderboardWithId = (id) =>
    this.setState({ deletingLeaderboardWithId: id })
  toggleLeaderboardDeletingInProgress = () =>
    this.setState({
      leaderboardDeletingInProgress: !this.state.leaderboardDeletingInProgress,
    })

  render() {
    const {
      children,
      dbCachePublishLeaderboard,
      dbCacheUnpublishLeaderboard,
      dbCacheDeleteLeaderboard,
      inMemoryDeleteLeaderboard,
      userId,
    } = this.props
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

        <Modal isOpen={!!state.editPlayerDialogIsOpenWithId} onClose={state.closeEditPlayerDialog}>
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>Edit Player</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {state.editPlayerDialogIsOpenWithId && (
                  <EditPlayerForm
                    onFormFinished={state.closeEditPlayerDialog}
                    onSuccess={state.closeEditPlayerDialog}
                  />
                )}
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>

        <AlertDialog
          isOpen={!!state.publishingLeaderboardWithId}
          leastDestructiveRef={this._cancelPublishingLeaderboardButtonRef}
          onClose={() => this.setPublishingLeaderboardWithId(null)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Publish Leaderboard
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to publish this leaderboard? It will be publicly visible for
                all.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={this._cancelPublishingLeaderboardButtonRef}
                  onClick={() => this.setPublishingLeaderboardWithId(null)}
                >
                  Cancel
                </Button>
                <Button
                  ml={3}
                  colorScheme="green"
                  isLoading={state.leaderboardPublishingInProgress}
                  onClick={async () => {
                    if (!state.publishingLeaderboardWithId) return

                    this.toggleLeaderboardPublishingInProgress()
                    try {
                      await dbCachePublishLeaderboard(state.publishingLeaderboardWithId)
                      this.setPublishingLeaderboardWithId(null)
                      toast.success(
                        <Box paddingX="8px">
                          <CheckCircleIcon color="white" marginRight="3px" /> Leaderboard published.
                        </Box>,
                        { progress: undefined }
                      )
                    } catch (e) {
                      toast.error(<Box paddingX="8px">{e.message}</Box>, { progress: undefined })
                    } finally {
                      this.toggleLeaderboardPublishingInProgress()
                    }
                  }}
                >
                  Publish
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={!!state.deletingLeaderboardWithId}
          leastDestructiveRef={this._cancelDeletingLeaderboardButtonRef}
          onClose={() => this.setDeletingLeaderboardWithId(null)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Leaderboard
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete this leaderboard? This action is permanent and you
                will no longer have access to it.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={this._cancelDeletingLeaderboardButtonRef}
                  onClick={() => this.setDeletingLeaderboardWithId(null)}
                >
                  Cancel
                </Button>
                <Button
                  ml={3}
                  colorScheme="red"
                  isLoading={state.leaderboardDeletingInProgress}
                  onClick={async () => {
                    if (!state.deletingLeaderboardWithId) return

                    this.toggleLeaderboardDeletingInProgress()
                    try {
                      if (userId) {
                        await dbCacheDeleteLeaderboard(state.deletingLeaderboardWithId)
                      } else {
                        inMemoryDeleteLeaderboard(state.deletingLeaderboardWithId)
                      }

                      this.setDeletingLeaderboardWithId(null)
                      toast.warning(
                        <Box paddingX="8px" color="black">
                          <CheckCircleIcon marginRight="3px" /> Leaderboard deleted.
                        </Box>,
                        { progress: undefined }
                      )
                    } catch (e) {
                      toast.error(<Box paddingX="8px">{e.message}</Box>, { progress: undefined })
                    } finally {
                      this.toggleLeaderboardDeletingInProgress()
                    }
                  }}
                >
                  Delete Leaderboard
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={!!state.unpublishingLeaderboardWithId}
          leastDestructiveRef={this._cancelPublishingLeaderboardButtonRef}
          onClose={() => this.setUnpublishingLeaderboardWithId(null)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold" display="flex" alignItems="center">
                <WarningTwoIcon marginRight="5px" color="red.500" /> Unpublish Leaderboard
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to unpublish this leaderboard? It will only be visible to you
                once this is done and all public links to this leaderboard will no longer work.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={this._cancelPublishingLeaderboardButtonRef}
                  onClick={() => this.setUnpublishingLeaderboardWithId(null)}
                >
                  Cancel
                </Button>
                <Button
                  ml={3}
                  colorScheme="orange"
                  isLoading={state.leaderboardUnpublishingInProgress}
                  onClick={async () => {
                    if (!state.unpublishingLeaderboardWithId) return

                    this.toggleLeaderboardUnpublishingInProgress()
                    try {
                      await dbCacheUnpublishLeaderboard(state.unpublishingLeaderboardWithId)
                      this.setUnpublishingLeaderboardWithId(null)

                      toast.warning(
                        <Box paddingX="8px" color="black">
                          <CheckCircleIcon marginRight="3px" /> Leaderboard unpublished..
                        </Box>,
                        { progress: undefined }
                      )
                    } catch (e) {
                      toast.error(<Box paddingX="8px">{e.message}</Box>, { progress: undefined })
                    } finally {
                      this.toggleLeaderboardUnpublishingInProgress()
                    }
                  }}
                >
                  Unpublish
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
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
      {({
        userId,
        dbCachePublishLeaderboard,
        dbCacheUnpublishLeaderboard,
        dbCacheDeleteLeaderboard,
      }) => (
        <inMemoryLeaderboardsContext.Consumer>
          {({ inMemoryDeleteLeaderboard }) => (
            <DialogsProvider
              userId={userId}
              dbCachePublishLeaderboard={dbCachePublishLeaderboard}
              dbCacheUnpublishLeaderboard={dbCacheUnpublishLeaderboard}
              dbCacheDeleteLeaderboard={dbCacheDeleteLeaderboard}
              inMemoryDeleteLeaderboard={inMemoryDeleteLeaderboard}
            >
              {children}
            </DialogsProvider>
          )}
        </inMemoryLeaderboardsContext.Consumer>
      )}
    </dbCacheLeaderboardsContext.Consumer>
  )
}

export { uiContext }
export default Provider
