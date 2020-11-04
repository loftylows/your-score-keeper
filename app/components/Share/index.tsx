import * as React from "react"
import {
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  VKIcon,
  VKShareButton,
  WeiboIcon,
  WeiboShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share"
import { useBreakpointValue } from "@chakra-ui/media-query"
import { Box, HStack } from "@chakra-ui/core"
import { facebookAppId } from "app/utils/constants"

interface IProps {
  shareUrl: string
  shareTitle: string
  flexDirection?: "row" | "column"
}
const Share = ({ shareUrl, shareTitle, flexDirection }: IProps) => {
  const shareFlexDirection = useBreakpointValue({ base: "column", md: "row" }) as "column" | "row"
  return (
    <Box
      display="flex"
      marginBottom="15px"
      alignItems="center"
      flexDirection={flexDirection || shareFlexDirection}
    >
      <Box
        marginRight="10px"
        fontWeight="bold"
        fontSize="lg"
        marginBottom={shareFlexDirection === "column" || flexDirection === "column" ? "8px" : "0"}
      >
        Social Share:
      </Box>
      <HStack spacing={2} maxWidth="100%" flexWrap="wrap">
        <Box title="Share on WhatsApp">
          <WhatsappShareButton url={shareUrl}>
            <WhatsappIcon size={32} borderRadius={50} />
          </WhatsappShareButton>
        </Box>
        <Box title="Share on Telegram">
          <TelegramShareButton url={shareUrl}>
            <TelegramIcon size={32} borderRadius={50} />
          </TelegramShareButton>
        </Box>
        <Box title="Share on Facebook">
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={32} borderRadius={50} />
          </FacebookShareButton>
        </Box>
        <Box title="Share using Messenger">
          <FacebookMessengerShareButton url={shareUrl} appId={facebookAppId}>
            <FacebookMessengerIcon size={32} borderRadius={50} />
          </FacebookMessengerShareButton>
        </Box>
        <Box title="Share on LinkedIn">
          <LinkedinShareButton url={shareUrl}>
            <LinkedinIcon size={32} borderRadius={50} />
          </LinkedinShareButton>
        </Box>
        <Box title="Share on Reddit">
          <RedditShareButton url={shareUrl}>
            <RedditIcon size={32} borderRadius={50} />
          </RedditShareButton>
        </Box>
        <Box title="Share on Pintrest">
          <PinterestShareButton url={shareUrl} media={shareTitle}>
            <PinterestIcon size={32} borderRadius={50} />
          </PinterestShareButton>
        </Box>
        <Box title="Share on Tumblr">
          <TumblrShareButton url={shareUrl}>
            <TumblrIcon size={32} borderRadius={50} />
          </TumblrShareButton>
        </Box>
        <Box title="Share on Line">
          <LineShareButton url={shareUrl}>
            <LineIcon size={32} borderRadius={50} />
          </LineShareButton>
        </Box>
        <Box title="Share on Weibo">
          <WeiboShareButton url={shareUrl}>
            <WeiboIcon size={32} borderRadius={50} />
          </WeiboShareButton>
        </Box>
        <Box title="Share on VK">
          <VKShareButton url={shareUrl}>
            <VKIcon size={32} borderRadius={50} />
          </VKShareButton>
        </Box>
      </HStack>
    </Box>
  )
}

export default Share
