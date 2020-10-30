import PageMeta from "app/components/PageMeta"
import { ErrorComponent } from "blitz"

// ------------------------------------------------------
// This page is rendered if a route match is not found
// ------------------------------------------------------
export default function Page404() {
  const statusCode = 404
  const title = "This page could not be found"
  return (
    <>
      <PageMeta title={`${statusCode}: ${title}`} description="" />
      <ErrorComponent statusCode={statusCode} title={title} />
    </>
  )
}
