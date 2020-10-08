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
} from "./types"
import CreateLeaderboardForm from "../forms/CreateLeaderboardForm"

/*

dbCacheCreateLeaderboard: DbCacheCreateLeaderboard;
dbCacheEditLeaderboard: DbCacheEditLeaderboard;
inMemoryCreateLeaderboard: InMemoryCreateLeaderboard;
inMemoryEditLeaderboard: InMemoryEditLeaderboard;
dbCacheCreatePlayer: DbCacheCreatePlayer;
dbCacheEditPlayer: DbCacheEditPlayer;
inMemoryCreatePlayer: InMemoryCreatePlayer;
inMemoryEditPlayer: InMemoryEditPlayer;

*/

interface Context {
  createLeaderboardDialogIsOpen: boolean
  editLeaderboardDialogIsOpenWithId: Maybe<UUID>
  createPlayerDialogIsOpen: boolean
  editPlayerDialogIsOpenWithId: Maybe<UUID>
  openCreateLeaderboardDialog: OpenCreateLeaderboardDialog
  closeCreateLeaderboardDialog: CloseCreateLeaderboardDialog
  openEditLeaderboardDialog: OpenEditLeaderboardDialog
  closeEditLeaderboardDialog: CloseEditLeaderboardDialog
  openCreatePlayerDialog: OpenCreatePlayerDialog
  closeCreatePlayerDialog: CloseCreatePlayerDialog
  openEditPlayerDialog: OpenEditPlayerDialog
  closeEditPlayerDialog: CloseEditPlayerDialog
}
const dialogsContext = React.createContext<Context>({
  createLeaderboardDialogIsOpen: false,
  editLeaderboardDialogIsOpenWithId: null,
  createPlayerDialogIsOpen: false,
  editPlayerDialogIsOpenWithId: null,
  openCreateLeaderboardDialog: () => {},
  closeCreateLeaderboardDialog: () => {},
  openEditLeaderboardDialog: () => {},
  closeEditLeaderboardDialog: () => {},
  openCreatePlayerDialog: () => {},
  closeCreatePlayerDialog: () => {},
  openEditPlayerDialog: () => {},
  closeEditPlayerDialog: () => {},
})

interface IProps {
  children: React.ReactChild
  userId: Maybe<UUID>
}
const DialogsProvider = ({ children }: IProps) => {
  const [state, setState] = React.useState<Context>({
    createLeaderboardDialogIsOpen: false,
    editLeaderboardDialogIsOpenWithId: null,
    createPlayerDialogIsOpen: false,
    editPlayerDialogIsOpenWithId: null,
    openCreateLeaderboardDialog: () => setState({ ...state, createLeaderboardDialogIsOpen: true }),
    closeCreateLeaderboardDialog: () =>
      setState({ ...state, createLeaderboardDialogIsOpen: false }),
    openEditLeaderboardDialog: (leaderboardId) =>
      setState({ ...state, editLeaderboardDialogIsOpenWithId: leaderboardId }),
    closeEditLeaderboardDialog: () =>
      setState({ ...state, editLeaderboardDialogIsOpenWithId: null }),
    openCreatePlayerDialog: () => setState({ ...state, createPlayerDialogIsOpen: true }),
    closeCreatePlayerDialog: () => setState({ ...state, createPlayerDialogIsOpen: false }),
    openEditPlayerDialog: (playerId) =>
      setState({ ...state, editPlayerDialogIsOpenWithId: playerId }),
    closeEditPlayerDialog: () => setState({ ...state, editPlayerDialogIsOpenWithId: null }),
  })

  return (
    <dialogsContext.Provider value={state}>
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
    </dialogsContext.Provider>
  )
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

export { dialogsContext }
export default Provider
