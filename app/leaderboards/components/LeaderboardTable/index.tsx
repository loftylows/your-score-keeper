import * as React from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { FaEllipsisV } from "react-icons/fa"
import {
  InMemoryLeaderboard,
  InMemoryPlayer,
} from "app/leaderboards/InMemoryLeaderboardsProvider/types"
import { DefaultColumnFilter, NumberRangeColumnFilter } from "./tableFilters"
import { IconButton, Icon, Box } from "@chakra-ui/core"
import { uiContext } from "app/leaderboards/UiProvider"
import { lighten } from "polished"

interface ITitleBoxProps {
  title: string
}
const TitleBox = ({ title }: ITitleBoxProps) => (
  <Box display="flex" justifyContent="flex-start" paddingX="10px">
    {title}
  </Box>
)

interface IProps {
  leaderboard: InMemoryLeaderboard
  players: InMemoryPlayer[]
}
const LeaderboardTable = ({ players }: IProps) => {
  const { openEditPlayerDialog } = React.useContext(uiContext)
  const rankedPlayers = players
    .sort((a, b) => b.score - a.score)
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
        Header: <TitleBox title="Rank" />,
        accessor: "rank", // accessor is the "key" in the data
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: <TitleBox title="Name" />,
        accessor: "name",
      },
      {
        Header: <TitleBox title="Score" />,
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
    useFilters,
    useSortBy // useFilters!
  )

  return (
    <>
      <Box as="table" {...getTableProps()} width="100%">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <Box display="flex" alignItems="center" marginBottom="5px">
                    {column.render("Header")}
                    {
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        marginLeft="0px"
                        title="Sort"
                        {...column.getSortByToggleProps()}
                      >
                        <TriangleDownIcon
                          fontSize="11px"
                          color={column.isSorted && column.isSortedDesc ? "gray.700" : "gray.200"}
                        />
                        <TriangleUpIcon
                          fontSize="11px"
                          color={column.isSorted && !column.isSortedDesc ? "gray.700" : "gray.200"}
                        />
                      </Box>
                    }
                  </Box>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <Box as="tbody" {...getTableBodyProps()}>
          <Box height="05x" minHeight="10px" />
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <Box
                as="tr"
                {...row.getRowProps()}
                backgroundColor={(i + 1) % 2 !== 0 ? "gray.50" : "transparent"}
              >
                {row.cells.map((cell) => {
                  return (
                    <Box as="td" {...cell.getCellProps()} padding="5px 10px">
                      {cell.render("Cell")}
                    </Box>
                  )
                })}
              </Box>
            )
          })}
        </Box>
      </Box>

      {!rows.length && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height={{ base: "120px", md: "150px" }}
          fontWeight="bold"
          borderRadius="10px"
          border={`1px solid ${lighten(0.2, "#4C7BF4")}`}
          backgroundColor={`${lighten(0.35, "#4C7BF4")}`}
        >
          No players...
        </Box>
      )}
    </>
  )
}

export default LeaderboardTable
