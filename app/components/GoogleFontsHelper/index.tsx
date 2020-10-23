import { Head } from "blitz"
import * as React from "react"

interface IProps {
  href: string
}

let hydrated = false

const GoogleFonts = ({ href }: IProps) => {
  const hydratedRef = React.useRef(false)
  const [, rerender] = React.useState(false)

  React.useEffect(() => {
    if (!hydratedRef.current) {
      hydrated = true
      hydratedRef.current = true
      rerender(true)
    }
  }, [])

  return (
    <Head>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
        key="preconnect-google-fonts"
      />
      <link key="google-fonts-preload" rel="preload" as="style" href={href} />
      <link
        key="google-fonts-roboto"
        href={href}
        rel="stylesheet"
        media={!hydrated ? "print" : "all"}
      />
    </Head>
  )
}

export default GoogleFonts
