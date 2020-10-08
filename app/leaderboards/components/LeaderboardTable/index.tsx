import * as React from "react"
import { useTable, useFilters } from "react-table"
import { FaEllipsisV } from "react-icons/fa"
import {
  InMemoryLeaderboard,
  InMemoryPlayer,
} from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import { DefaultColumnFilter, NumberRangeColumnFilter } from "./tableFilters"
import { IconButton, Icon, Box } from "@chakra-ui/core"
import { uiContext } from "app/leaderboards/UiProvider"

interface IProps {
  leaderboard: InMemoryLeaderboard
  players: InMemoryPlayer[]
}
const LeaderboardTable = ({ players }: IProps) => {
  const { openEditPlayerDialog } = React.useContext(uiContext)
  const rankedPlayers = players
    .sort((a, b) => a.score - b.score)
    .map((p, i) => {
      const icon = <Icon as={FaEllipsisV} />
      return {
        rank: i + 1,
        name: p.name,
        score: p.score,
        extra: (
          <IconButton
            variant="ghost"
            aria-label="More options"
            icon={icon}
            onClick={() => openEditPlayerDialog(p.id)}
          />
        ),
      }
    })
  const memoizedRankedPlayers = React.useMemo(() => rankedPlayers, [players])
  const columns = React.useMemo(
    () => [
      {
        Header: (
          <Box display="flex" justifyContent="flex-start" paddingX="10px" marginBottom="3px">
            Rank
          </Box>
        ),
        accessor: "rank", // accessor is the "key" in the data
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: (
          <Box display="flex" justifyContent="flex-start" paddingX="10px" marginBottom="3px">
            Name
          </Box>
        ),
        accessor: "name",
      },
      {
        Header: (
          <Box display="flex" justifyContent="flex-start" paddingX="10px" marginBottom="3px">
            Score
          </Box>
        ),
        accessor: "score",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "",
        accessor: "extra",
        disableFilters: true,
      },
    ],
    []
  )

  const filterTypes = React.useMemo(
    () => ({
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: memoizedRankedPlayers,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters // useFilters!
  )

  return (
    <>
      <Box as="table" {...getTableProps()} width="100%">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <Box
                as="tr"
                {...row.getRowProps()}
                backgroundColor={(i + 1) % 2 === 0 ? "gray.50" : "transparent"}
              >
                {row.cells.map((cell) => {
                  return (
                    <Box as="td" {...cell.getCellProps()} paddingX="10px">
                      {cell.render("Cell")}
                    </Box>
                  )
                })}
              </Box>
            )
          })}
        </tbody>
      </Box>
    </>
  )
}

export default LeaderboardTable
