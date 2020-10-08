import * as React from "react"
import { Maybe, UUID } from "common-types"
import { v4 as uuid } from "uuid"
import {
  InMemoryLeaderboard,
  InMemoryCreateLeaderboard,
  InMemoryEditLeaderboard,
  InMemoryDeleteLeaderboard,
  InMemoryPlayer,
  InMemoryCreatePlayer,
  InMemoryEditPlayer,
  InMemoryDeletePlayer,
  FlushInMemoryLeaderboards,
} from "./types"
import { LOGIN_COMPLETED_EVENT_NAME, SIGNUP_COMPLETED_EVENT_NAME } from "app/browserEvents"
import { dbCacheLeaderboardsContext } from "../DbCacheLeaderboardsProvider"
import { SaveLeaderboardsFromMemoryToDb } from "../DbCacheLeaderboardsProvider/types"

interface IState {
  leaderboards: InMemoryLeaderboard[]
  players: InMemoryPlayer[]
  inMemoryCreateLeaderboard: InMemoryCreateLeaderboard
  inMemoryEditLeaderboard: InMemoryEditLeaderboard
  inMemoryDeleteLeaderboard: InMemoryDeleteLeaderboard
  inMemoryCreatePlayer: InMemoryCreatePlayer
  inMemoryEditPlayer: InMemoryEditPlayer
  inMemoryDeletePlayer: InMemoryDeletePlayer
  flushInMemoryLeaderboards: FlushInMemoryLeaderboards
}

const inMemoryLeaderboardsContext = React.createContext<IState>({
  leaderboards: [],
  players: [],
  inMemoryCreateLeaderboard: () => {},
  inMemoryEditLeaderboard: () => {},
  inMemoryDeleteLeaderboard: () => {},
  inMemoryCreatePlayer: () => {},
  inMemoryEditPlayer: () => {},
  inMemoryDeletePlayer: () => {},
  flushInMemoryLeaderboards: () => {},
})

interface IProps {
  saveLeaderboardsFromMemoryToDb: SaveLeaderboardsFromMemoryToDb
  children: React.ReactChild
}
class InMemoryLeaderboardsProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      leaderboards: [],
      players: [],
      inMemoryCreateLeaderboard: this.inMemoryCreateLeaderboard,
      inMemoryEditLeaderboard: this.inMemoryEditLeaderboard,
      inMemoryDeleteLeaderboard: this.inMemoryDeleteLeaderboard,
      inMemoryCreatePlayer: this.inMemoryCreatePlayer,
      inMemoryEditPlayer: this.inMemoryEditPlayer,
      inMemoryDeletePlayer: this.inMemoryDeletePlayer,
      flushInMemoryLeaderboards: this.flushInMemoryLeaderboards,
    }
  }

  componentDidMount = () => {
    window.addEventListener("beforeunload", (e) => {
      if (this.state.leaderboards.length > 0) {
        console.log("wjhwjevwubik")
        const confirmText =
          "You are about to leave without saving your leaderboards. Please log in to to keep your leaderboards."
        e.returnValue = confirmText
        return confirmText
      }
    })

    window.addEventListener(LOGIN_COMPLETED_EVENT_NAME, this.onAuthCompleted)
    window.addEventListener(SIGNUP_COMPLETED_EVENT_NAME, this.onAuthCompleted)
  }

  componentWillUnmount = () => {
    window.removeEventListener(LOGIN_COMPLETED_EVENT_NAME, this.onAuthCompleted)
    window.removeEventListener(SIGNUP_COMPLETED_EVENT_NAME, this.onAuthCompleted)
  }

  public inMemoryCreateLeaderboard: InMemoryCreateLeaderboard = (leaderboardInput) => {
    this.setState({
      leaderboards: [
        ...this.state.leaderboards,
        {
          ...leaderboardInput,
          id: uuid(),
        },
      ],
    })
  }

  public inMemoryEditLeaderboard: InMemoryEditLeaderboard = (input) => {
    const { leaderboards } = this.state

    const updatedLeaderboards = leaderboards.map((board) => (board.id !== input.id ? board : input))

    this.setState({
      leaderboards: updatedLeaderboards,
    })
  }

  public inMemoryDeleteLeaderboard: InMemoryDeleteLeaderboard = (id: UUID) => {
    const { leaderboards } = this.state

    this.setState({
      leaderboards: leaderboards.filter((l) => l.id === id),
    })
  }

  public inMemoryCreatePlayer: InMemoryCreatePlayer = (leaderboardId, playerInput) => {
    const { players } = this.state

    this.setState({
      players: [...players, { ...playerInput, id: uuid(), leaderboardId }],
    })
  }

  public inMemoryEditPlayer: InMemoryEditPlayer = (input) => {
    const { players } = this.state

    this.setState({
      players: players.map((p) => (p.id === input.id ? { ...input } : p)),
    })
  }

  public inMemoryDeletePlayer: InMemoryDeletePlayer = (id: UUID) => {
    const { players } = this.state

    this.setState({
      players: players.filter((p) => p.id === id),
    })
  }

  public flushInMemoryLeaderboards: FlushInMemoryLeaderboards = () => {
    this.setState({
      leaderboards: [],
      players: [],
    })
  }

  public onAuthCompleted = async (e: Event) => {
    const { saveLeaderboardsFromMemoryToDb } = this.props
    const { leaderboards } = this.state
    const userId: Maybe<UUID> = (e as CustomEvent).detail?.userId
    if (!userId || !leaderboards.length) return
    await saveLeaderboardsFromMemoryToDb(userId, leaderboards)
    this.flushInMemoryLeaderboards()
  }

  render() {
    return (
      <inMemoryLeaderboardsContext.Provider value={this.state}>
        {this.props.children}
      </inMemoryLeaderboardsContext.Provider>
    )
  }
}

const Provider = ({ children }: { children: React.ReactChild }) => (
  <dbCacheLeaderboardsContext.Consumer>
    {({ saveLeaderboardsFromMemoryToDb }) => (
      <InMemoryLeaderboardsProvider saveLeaderboardsFromMemoryToDb={saveLeaderboardsFromMemoryToDb}>
        {children}
      </InMemoryLeaderboardsProvider>
    )}
  </dbCacheLeaderboardsContext.Consumer>
)

export { inMemoryLeaderboardsContext }
export default Provider
