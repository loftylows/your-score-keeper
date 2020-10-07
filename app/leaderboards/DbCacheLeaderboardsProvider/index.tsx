import * as React from "react"
import { Maybe, UUID } from "common-types"
import {
  DbCacheCreateLeaderboard,
  DbCacheEditLeaderboard,
  DbCacheDeleteLeaderboard,
  DbCacheCreatePlayer,
  DbCacheEditPlayer,
  DbCacheDeletePlayer,
  FlushDbCacheLeaderboards,
  LoadDbCacheLeaderboards,
  SetDbCacheLeaderboards,
} from "./types"
import { Leaderboard, Player } from "@prisma/client"
import createLeaderboard from "../mutations/createLeaderboard"
import getLeaderboards from "../queries/getLeaderboards"
import updateLeaderboard from "../mutations/updateLeaderboard"
import deleteLeaderboard from "../mutations/deleteLeaderboard"
import createPlayer from "app/players/mutations/createPlayer"
import updatePlayer from "app/players/mutations/updatePlayer"

interface IState {
  leaderboards: Leaderboard[]
  players: Player[]
  isLoadingData: boolean
  userId: Maybe<UUID>
  dbCacheCreateLeaderboard: DbCacheCreateLeaderboard
  dbCacheEditLeaderboard: DbCacheEditLeaderboard
  dbCacheDeleteLeaderboard: DbCacheDeleteLeaderboard
  dbCacheCreatePlayer: DbCacheCreatePlayer
  dbCacheEditPlayer: DbCacheEditPlayer
  dbCacheDeletePlayer: DbCacheDeletePlayer
  flushDbCacheLeaderboards: FlushDbCacheLeaderboards
  loadDbCacheLeaderboards: LoadDbCacheLeaderboards
}

const dbCacheLeaderboardsContext = React.createContext<IState>({
  leaderboards: [],
  players: [],
  isLoadingData: false,
  userId: null,
  dbCacheCreateLeaderboard: async () => {},
  dbCacheEditLeaderboard: async () => {},
  dbCacheDeleteLeaderboard: async () => {},
  dbCacheCreatePlayer: async () => {},
  dbCacheEditPlayer: async () => {},
  dbCacheDeletePlayer: async () => {},
  flushDbCacheLeaderboards: () => {},
  loadDbCacheLeaderboards: async () => {},
})

interface IProps {
  userId: Maybe<UUID>
  sessionIsLoading: boolean
}
class DbCacheLeaderboardsProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      leaderboards: [],
      players: [],
      isLoadingData: false,
      userId: this.props.userId,
      dbCacheCreateLeaderboard: this.dbCacheCreateLeaderboard,
      dbCacheEditLeaderboard: this.dbCacheEditLeaderboard,
      dbCacheDeleteLeaderboard: this.dbCacheDeleteLeaderboard,
      dbCacheCreatePlayer: this.dbCacheCreatePlayer,
      dbCacheEditPlayer: this.dbCacheEditPlayer,
      dbCacheDeletePlayer: this.dbCacheDeletePlayer,
      flushDbCacheLeaderboards: this.flushDbCacheLeaderboards,
      loadDbCacheLeaderboards: this.loadDbCacheLeaderboards,
    }
  }

  componentDidMount = () => {
    window.addEventListener("beforeunload", (e) => {
      if (this.state.leaderboards.length > 0) {
        const confirmText =
          "You are about to leave without saving your leaderboards. Please log in to to keep your leaderboards."
        e.returnValue = confirmText
        return confirmText
      }
    })
  }

  public dbCacheCreateLeaderboard: DbCacheCreateLeaderboard = async (input) => {
    const { userId } = this.state
    if (!userId) return

    const leaderboard = await createLeaderboard({ data: input, ownerId: userId })
    this.setState({
      leaderboards: [...this.state.leaderboards, leaderboard],
    })

    try {
      const leaderboard = await createLeaderboard({ data: input, ownerId: userId })
      this.setState({
        leaderboards: [...this.state.leaderboards, leaderboard],
      })
    } catch (e) {
      // TODO: Notify user of error
    }
  }

  public dbCacheEditLeaderboard: DbCacheEditLeaderboard = async (input) => {
    const { leaderboards, userId } = this.state
    if (!userId) return

    const oldLeaderboardsState = { ...leaderboards }

    const updatedLeaderboards = leaderboards.map((board) => (board.id !== input.id ? board : input))

    this.setState({
      leaderboards: updatedLeaderboards,
    })

    try {
      await await updateLeaderboard({ where: { id: input.id }, data: input, userId })
    } catch (e) {
      // TODO: Notify user of error
      this.setState({
        leaderboards: oldLeaderboardsState,
      })
    }
  }

  public dbCacheDeleteLeaderboard: DbCacheDeleteLeaderboard = async (id: UUID) => {
    const { leaderboards, userId } = this.state
    if (!userId) return

    const oldLeaderboardsState = { ...leaderboards }

    this.setState({
      leaderboards: leaderboards.filter((l) => l.id === id),
    })

    try {
      await deleteLeaderboard({ where: { id } })
    } catch (e) {
      // TODO: Notify user of error
      this.setState({
        leaderboards: oldLeaderboardsState,
      })
    }
  }

  public dbCacheCreatePlayer: DbCacheCreatePlayer = async (leaderboardId, input) => {
    const { players, userId } = this.state
    if (!userId) return

    const oldPlayersState = { ...players }

    try {
      const player = await createPlayer({ data: input, leaderboardId })
      this.setState({
        players: [...players, player],
      })
    } catch (e) {
      // TODO: Notify user of error
      this.setState({
        players: oldPlayersState,
      })
    }
  }

  public dbCacheEditPlayer: DbCacheEditPlayer = async (input) => {
    const { players, userId } = this.state
    if (!userId) return

    const oldPlayersState = { ...players }

    try {
      this.setState({
        players: players.map((p) => (p.id === input.id ? { ...input } : p)),
      })
      await updatePlayer({
        where: { id: input.id },
        data: input,
        leaderboardId: input.leaderboardId,
      })
    } catch (e) {
      // TODO: Notify user of error
      this.setState({
        players: oldPlayersState,
      })
    }
  }

  public dbCacheDeletePlayer: DbCacheDeletePlayer = async (id: UUID) => {
    const { players } = this.state

    this.setState({
      players: players.filter((p) => p.id === id),
    })
  }

  public flushDbCacheLeaderboards: FlushDbCacheLeaderboards = () => {
    this.setState({
      leaderboards: [],
      players: [],
    })
  }

  public loadDbCacheLeaderboards: LoadDbCacheLeaderboards = async (userId: UUID) => {
    this.setState({ userId })

    const { leaderboards } = await getLeaderboards({ where: { ownerId: userId } })
    this.setState({
      leaderboards: leaderboards,
    })
  }

  public setDbCacheLeaderboards: SetDbCacheLeaderboards = (userId, leaderboards) => {
    this.setState({
      leaderboards: leaderboards,
      userId,
    })
  }

  render() {
    return (
      <dbCacheLeaderboardsContext.Provider value={this.state}>
        {this.props.children}
      </dbCacheLeaderboardsContext.Provider>
    )
  }
}

export { dbCacheLeaderboardsContext }
export default DbCacheLeaderboardsProvider
