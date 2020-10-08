import * as React from "react"
import { Maybe, ThenArgRecursive, UUID } from "common-types"
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
  SaveLeaderboardsFromMemoryToDb,
} from "./types"
import { Leaderboard, Player } from "@prisma/client"
import createLeaderboard from "../mutations/createLeaderboard"
import getLeaderboards from "../queries/getLeaderboards"
import updateLeaderboard from "../mutations/updateLeaderboard"
import deleteLeaderboard from "../mutations/deleteLeaderboard"
import createPlayer from "app/players/mutations/createPlayer"
import updatePlayer from "app/players/mutations/updatePlayer"
import {
  LOGIN_COMPLETED_EVENT_NAME,
  LOGOUT_EVENT_NAME,
  SIGNUP_COMPLETED_EVENT_NAME,
} from "app/browserEvents"
import getPlayers from "app/players/queries/getPlayers"

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
  setDbCacheLeaderboards: SetDbCacheLeaderboards
  saveLeaderboardsFromMemoryToDb: SaveLeaderboardsFromMemoryToDb
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
  setDbCacheLeaderboards: () => {},
  saveLeaderboardsFromMemoryToDb: async () => {},
})

interface IProps {
  userId: Maybe<UUID>
  leaderboardsFromServer: Leaderboard[]
  playersFromServer: Player[]
}
class DbCacheLeaderboardsProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    const { userId, playersFromServer, leaderboardsFromServer } = this.props
    this.state = {
      leaderboards: leaderboardsFromServer,
      players: playersFromServer,
      isLoadingData: false,
      userId: userId,
      dbCacheCreateLeaderboard: this.dbCacheCreateLeaderboard,
      dbCacheEditLeaderboard: this.dbCacheEditLeaderboard,
      dbCacheDeleteLeaderboard: this.dbCacheDeleteLeaderboard,
      dbCacheCreatePlayer: this.dbCacheCreatePlayer,
      dbCacheEditPlayer: this.dbCacheEditPlayer,
      dbCacheDeletePlayer: this.dbCacheDeletePlayer,
      flushDbCacheLeaderboards: this.flushDbCacheLeaderboards,
      loadDbCacheLeaderboards: this.loadDbCacheLeaderboards,
      setDbCacheLeaderboards: this.setDbCacheLeaderboards,
      saveLeaderboardsFromMemoryToDb: this.saveLeaderboardsFromMemoryToDb,
    }
  }

  componentDidMount = () => {
    window.addEventListener(LOGIN_COMPLETED_EVENT_NAME, this.onAuthCompleted)
    window.addEventListener(SIGNUP_COMPLETED_EVENT_NAME, this.onAuthCompleted)
    window.addEventListener(LOGOUT_EVENT_NAME, this.onLogout)
  }

  componentWillUnmount = () => {
    window.removeEventListener(LOGIN_COMPLETED_EVENT_NAME, this.onAuthCompleted)
    window.removeEventListener(SIGNUP_COMPLETED_EVENT_NAME, this.onAuthCompleted)
    window.removeEventListener(LOGOUT_EVENT_NAME, this.onLogout)
  }

  public dbCacheCreateLeaderboard: DbCacheCreateLeaderboard = async (input) => {
    const { userId } = this.state
    if (!userId) return

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

    const oldLeaderboardsState: IState["leaderboards"] = [...leaderboards]

    const updatedLeaderboards = leaderboards.map((board) =>
      board.id !== input.id ? board : { ...input, ownerId: userId }
    )

    this.setState({
      leaderboards: updatedLeaderboards,
    })

    try {
      await updateLeaderboard({ where: { id: input.id }, data: input })
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
    this.setState({ userId, isLoadingData: true })

    try {
      const { leaderboards } = await getLeaderboards({ where: { ownerId: userId } })
      let players: Player[] = []
      if (leaderboards.length) {
        const res = await getPlayers({
          where: { leaderboardId: { in: leaderboards.map((l) => l.id) } },
        })
        players = res.players
      }
      this.setState({
        leaderboards,
        players,
        isLoadingData: false,
      })
    } catch (e) {
      // TODO: Notify user of error
      this.setState({
        isLoadingData: false,
      })

      throw e
    }
  }

  public setDbCacheLeaderboards: SetDbCacheLeaderboards = (userId, leaderboards, players) => {
    this.setState({
      leaderboards,
      players,
      userId,
    })
  }

  public onAuthCompleted = (e: Event) => {
    const userId: Maybe<UUID> = (e as CustomEvent).detail?.userId
    if (!userId) return
    this.loadDbCacheLeaderboards(userId)
  }
  public onLogout = () => {
    this.setState({
      leaderboards: [],
      userId: null,
    })
  }

  public saveLeaderboardsFromMemoryToDb: SaveLeaderboardsFromMemoryToDb = async (
    userId,
    leaderboards,
    players
  ) => {
    const promises = leaderboards.map(async (leaderboard) => {
      const oldLeaderboardId = leaderboard.id
      const newLeaderboard = await createLeaderboard({
        data: { ...leaderboard, id: undefined, owner: { connect: { id: userId } } },
        ownerId: userId,
      })
      const playerPromises = players
        .filter((p) => p.leaderboardId === oldLeaderboardId)
        .map((p) =>
          createPlayer({ data: { ...p, id: undefined }, leaderboardId: newLeaderboard.id })
        )

      const res = await Promise.allSettled(playerPromises)
      const newPlayers = res
        .filter((item) => item.status === "fulfilled")
        .map(
          (item) =>
            (item as PromiseFulfilledResult<ThenArgRecursive<ReturnType<typeof createPlayer>>>)
              .value
        )
      return { newLeaderboard, newPlayers }
    })

    const res = await Promise.allSettled(promises)
    const newLeaderboardsRes = res
      .filter((item) => item.status === "fulfilled")
      .map(
        (item) =>
          (item as PromiseFulfilledResult<{ newLeaderboard: Leaderboard; newPlayers: Player[] }>)
            .value
      )
      .reduce(
        (accu, item) => {
          const res = { ...accu }
          res.newLeaderboards = [...accu.newLeaderboards, item.newLeaderboard]
          res.newPlayers = [...res.newPlayers, ...item.newPlayers]

          return res
        },
        { newLeaderboards: [] as Leaderboard[], newPlayers: [] as Player[] }
      )

    this.setState({
      leaderboards: [...this.state.leaderboards, ...newLeaderboardsRes.newLeaderboards],
      players: [...this.state.players, ...newLeaderboardsRes.newPlayers],
      userId: userId,
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