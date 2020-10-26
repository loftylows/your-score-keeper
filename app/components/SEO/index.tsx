/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

/*

import React from "react";
import { Head } from "blitz"

interface IMetaData {
  name: string;
  content: string;
}

interface IProps {
  keywords: string[];
  title: string;
  description?: string;
  lang?: string;
  meta?: IMetaData[];
}

const SEO = ({ description, lang, meta, keywords, title }: IProps) => {
  const metaDescription = description || site.siteMetadata.description;
  const metaData = meta || [];

  return (
    <Helmet
      htmlAttributes={{
        lang: lang || "en",
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
          keywords.length > 0
            ? {
              name: `keywords`,
              content: keywords.join(`, `),
            }
            : []
        )
        .concat(metaData)}
    />
  );
};

*/

const SEO = () => <div></div>

export default SEO
