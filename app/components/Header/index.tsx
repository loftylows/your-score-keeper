import * as React from "react"
import { useSession, Link } from "blitz"
import { FaUserCircle } from "react-icons/fa"
import {
  Box,
  ButtonGroup,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  MenuGroup,
  MenuDivider,
  Spinner,
} from "@chakra-ui/core"
import { darken } from "polished"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { authModalContext } from "app/auth/AuthModalProvider"
import logout from "app/auth/mutations/logout"
import { capitalize } from "utils/string"

const Header = () => {
  const session = useSession()
  const { openAuthModal } = React.useContext(authModalContext)

  const UnauthenticatedUserContent = () => (
    <ButtonGroup color="white">
      <Button colorScheme="blue" size="md" mr={3} onClick={() => openAuthModal({ type: "signup" })}>
        Sign Up
      </Button>

      <Button
        backgroundColor="gray.600"
        _hover={{ backgroundColor: "gray.700" }}
        size="md"
        onClick={() => openAuthModal({ type: "login" })}
      >
        Log In
      </Button>
    </ButtonGroup>
  )

  const AuthenticatedUserContent = () => {
    const currentUser = useCurrentUser()

    return (
      <Menu>
        <MenuButton
          display="flex"
          fontSize="28px"
          backgroundColor="rgba(0,0,0,.4)"
          borderRadius="50%"
          color="white.300"
          zIndex={1}
          padding="0px"
          height="40px"
          minHeight="40px"
          minWidth="40px"
          width="40px"
          transition="all 250ms ease-out"
          _hover={{
            backgroundColor: "rgba(0,0,0,.6)",
            color: "white",
          }}
          _active={{
            backgroundColor: "rgba(0,0,0,.6)",
            color: "white",
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <FaUserCircle color="white" />
          </Box>
        </MenuButton>

        <MenuList>
          <MenuGroup title={currentUser ? capitalize(currentUser.name) : undefined}>
            <MenuDivider />
            <MenuItem onClick={async () => logout()}>Log Out</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    )
  }

  return (
    <Box
      top={0}
      position="sticky"
      display="flex"
      alignItems="center"
      height="64px"
      minHeight="64px"
      bgColor="brand.400"
      zIndex={1}
    >
      <Link passHref href="/">
        <Box color="rgba(255, 255, 255, .9)" as="a" marginLeft="25px" fontSize="xl">
          YourScoreKeeper
        </Box>
      </Link>

      {/* Header auth items */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginLeft="auto"
        paddingX="30px"
      >
        {session.userId ? (
          <React.Suspense
            fallback={() => (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Spinner />
              </Box>
            )}
          >
            <AuthenticatedUserContent />
          </React.Suspense>
        ) : (
          <UnauthenticatedUserContent />
        )}
      </Box>

      {/* Header accent colors */}
      <Box
        position="absolute"
        display="flex"
        justifyContent="flex-end"
        right={0}
        width={["62px", "92px"]}
        height="100%"
        backgroundColor="#A99156"
        bgColor="brand.500"
        zIndex={-1}
      >
        <Box
          width={["20px", "30px"]}
          backgroundColor={darken(0.15, "#A99156")}
          bgColor="brand.600"
        />
      </Box>
    </Box>
  )
}

export default Header
