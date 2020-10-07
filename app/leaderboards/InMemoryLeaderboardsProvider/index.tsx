import * as React from "react"
import { UUID } from "common-types"
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

interface IProps {}
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
        const confirmText =
          "You are about to leave without saving your leaderboards. Please log in to to keep your leaderboards."
        e.returnValue = confirmText
        return confirmText
      }
    })
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

  render() {
    return (
      <inMemoryLeaderboardsContext.Provider value={this.state}>
        {this.props.children}
      </inMemoryLeaderboardsContext.Provider>
    )
  }
}

export { inMemoryLeaderboardsContext }
export default InMemoryLeaderboardsProvider
