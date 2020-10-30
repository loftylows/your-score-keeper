import Head from "next/head"

export interface IPageMeta {
  title: string
  description: string
  canonicalUrl?: string
  siteName?: string
}
type IProps = IPageMeta
const PageMeta = ({ title, description, canonicalUrl, siteName = "YourScoreKeeper" }: IProps) => (
  <Head>
    <title key="head-title">{title}</title>
    <meta key="head-description" name="description" content={description} />
    <meta key="head-og:type" property="og:type" content="website" />
    <meta key="head-og:title" name="og:title" property="og:title" content={title} />
    <meta
      key="head-og:description"
      name="og:description"
      property="og:description"
      content={description}
    />
    <meta key="head-og:site_name" property="og:site_name" content={siteName} />
    {canonicalUrl && <meta key="head-og:url" property="og:url" content={canonicalUrl} />}
    <meta key="head-twitter:card" name="twitter:card" content="summary" />
    <meta key="head-twitter:title" name="twitter:title" content={title} />
    <meta key="head-twitter:description" name="twitter:description" content={description} />
    {/* <meta name="twitter:site" content="" /> */}
    {/* <meta name="twitter:creator" content="" /> */}
    {/* <meta property="og:image" content="" /> */}
    {/* <meta name="twitter:image" content="" /> */}
    {canonicalUrl && <link key="head-canonical-url" rel="canonical" href={canonicalUrl} />}
  </Head>
)
export default PageMeta
