import qs from "querystringify"

export type CreatedFilter = "latest" | "oldest"
export interface QueryOptions {
  sortBy?: CreatedFilter
  name?: string
  page?: number
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
