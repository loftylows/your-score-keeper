import React from "react"
import { Box, Button, ButtonGroup } from "@chakra-ui/core"
import { Link } from "blitz"
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"

interface IPageData {
  currentPage: number
  totalPages: number
  pageLimit: number
  totalRecords: number
}

const LEFT_PAGE = "LEFT"
const RIGHT_PAGE = "RIGHT"

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from: number, to: number, step = 1) => {
  let i = from
  const range: number[] = []

  while (i <= to) {
    range.push(i)
    i += step
  }

  return range
}
type FetchPageNumbers = (data: {
  totalPages: number
  currentPage: number
  pageNeighbors: number
}) => (string | number)[]
const fetchPageNumbers: FetchPageNumbers = ({ totalPages, currentPage, pageNeighbors }) => {
  /**
   * totalNumbers: the total page numbers to show on the control
   * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
   */
  const totalNumbers = pageNeighbors * 2 + 3
  const totalBlocks = totalNumbers + 2

  if (totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - pageNeighbors)
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbors)
    let pages: (string | number)[] = range(startPage, endPage)

    /**
     * hasLeftSpill: has hidden pages to the left
     * hasRightSpill: has hidden pages to the right
     * spillOffset: number of hidden pages either to the left or to the right
     */
    const hasLeftSpill = startPage > 2
    const hasRightSpill = totalPages - endPage > 1
    const spillOffset = totalNumbers - (pages.length + 1)

    switch (true) {
      // handle: (1) < {5 6} [7] {8 9} (10)
      case hasLeftSpill && !hasRightSpill: {
        const extraPages = range(startPage - spillOffset, startPage - 1)
        pages = [LEFT_PAGE, ...extraPages, ...pages]
        break
      }

      // handle: (1) {2 3} [4] {5 6} > (10)
      case !hasLeftSpill && hasRightSpill: {
        const extraPages = range(endPage + 1, endPage + spillOffset)
        pages = [...pages, ...extraPages, RIGHT_PAGE]
        break
      }

      // handle: (1) < {4 5} [6] {7 8} > (10)
      case hasLeftSpill && hasRightSpill:
      default: {
        pages = [LEFT_PAGE, ...pages, RIGHT_PAGE]
        break
      }
    }

    return [1, ...pages, totalPages]
  }

  return range(1, totalPages)
}

type OnPageChanged = (d: IPageData) => any
interface GotoPageInput {
  page: number
  totalPages: number
  pageLimit: number
  totalRecords: number
  onPageChanged: OnPageChanged
}
type GotoPage = (data: GotoPageInput) => number
const gotoPage: GotoPage = ({ page, totalPages, pageLimit, totalRecords, onPageChanged }) => {
  const currentPage = Math.max(0, Math.min(page, totalPages))
  const paginationData = {
    currentPage,
    totalPages: totalPages,
    pageLimit: pageLimit,
    totalRecords: totalRecords,
  }

  onPageChanged(paginationData)

  return currentPage
}

type HandleClick = (input: GotoPageInput) => (evt: React.MouseEvent) => any
const handleClick: HandleClick = (input) => (evt) => {
  evt.preventDefault()
  gotoPage(input)
}

interface HandleMoveInput extends IPageData {
  pageNeighbors: number
  onPageChanged: OnPageChanged
}
type HandleMoveLeft = (input: HandleMoveInput) => number
const handleMoveLeft: HandleMoveLeft = (input) => {
  const currentPage = input.currentPage - input.pageNeighbors * 2 - 1
  gotoPage({
    ...input,
    page: input.currentPage - input.pageNeighbors * 2 - 1,
  })

  return currentPage
}

type HandleMoveRight = (input: HandleMoveInput) => number
const handleMoveRight: HandleMoveRight = (input) => {
  const currentPage = input.currentPage + input.pageNeighbors * 2 + 1
  gotoPage({
    ...input,
    page: input.currentPage + input.pageNeighbors * 2 + 1,
  })

  return currentPage
}

export type LinkBuilder = (page: number) => any
interface IProps {
  currentPage: number
  totalRecords: number
  pageLimit?: number
  pageNeighbors?: number
  onPageChanged?: (data: IPageData) => any
  linkBuilder: LinkBuilder
}
const Pagination = ({
  currentPage,
  totalRecords,
  pageLimit = 20,
  pageNeighbors = 0,
  onPageChanged = (f) => f,
  linkBuilder,
}: IProps) => {
  //  Max of 2
  const internalPageNeighbors =
    typeof pageNeighbors === "number" ? Math.max(0, Math.min(pageNeighbors, 2)) : 0
  const totalPages = Math.ceil(totalRecords / pageLimit)

  if (!totalRecords || totalPages === 1) return null

  const pages = fetchPageNumbers({ totalPages, pageNeighbors: internalPageNeighbors, currentPage })
  const pageData = {
    pageLimit,
    currentPage,
    pageNeighbors: internalPageNeighbors,
    totalPages,
    totalRecords,
    onPageChanged,
  }
  return (
    <Box as="nav" aria-label="Leaderboards Pagination">
      <ButtonGroup
        as="ul"
        display="flex"
        className="pagination"
        listStyleType="none"
        isAttached
        variant="outline"
      >
        {pages.map((page, index) => {
          const isCurrentPage = currentPage === page
          if (page === LEFT_PAGE)
            return (
              <Button as="li" key={index} padding="0">
                <Link href={linkBuilder(handleMoveLeft(pageData))} passHref>
                  <Box
                    as="a"
                    aria-label="Previous"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    width="100%"
                    fontSize="12px"
                  >
                    <FaChevronLeft />
                  </Box>
                </Link>
              </Button>
            )

          if (page === RIGHT_PAGE)
            return (
              <Button as="li" key={index} className="page-item" padding="0">
                <Link href={linkBuilder(handleMoveRight(pageData))} passHref>
                  <Box
                    as="a"
                    aria-label="Next"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    width="100%"
                    fontSize="12px"
                  >
                    <FaChevronRight />
                  </Box>
                </Link>
              </Button>
            )

          return (
            <Button
              as="li"
              key={index}
              colorScheme={isCurrentPage ? "blue" : undefined}
              padding="0"
            >
              <Link href={linkBuilder(gotoPage({ ...pageData, page: page as number }))} passHref>
                <Box
                  as="a"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  width="100%"
                >
                  {page}
                </Box>
              </Link>
            </Button>
          )
        })}
      </ButtonGroup>
    </Box>
  )
}

export default Pagination
