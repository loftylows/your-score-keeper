import qs from "querystringify"

type CreatedFilter = "latest" | "oldest"
interface QueryOptions {
  sortBy?: CreatedFilter
  name?: string
}

export type BuildSearchQuery = (queryOptions?: QueryOptions) => string
const buildSearchQuery: BuildSearchQuery = (queryOptions) => {
  const baseUrl = "/leaderboards"
  if (!queryOptions) return baseUrl
  const query = qs.stringify(queryOptions)
  if (query) return `${baseUrl}?${query}`
  return baseUrl
}

export default buildSearchQuery
