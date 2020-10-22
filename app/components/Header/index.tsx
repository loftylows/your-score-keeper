import * as React from "react"
import { useSession, Link } from "blitz"
import { FaUserCircle, FaAlignJustify } from "react-icons/fa"
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
  Icon,
  IconButton,
  HStack,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
} from "@chakra-ui/core"
import { darken } from "polished"
import { authModalContext } from "app/auth/AuthModalProvider"
import logout from "app/auth/logout"
import { usersUiContext } from "app/users/UsersUiProvider"
import buildSearchQuery from "app/leaderboards/searchUrlBuilder"

const mobileNavLinksConfig = [
  { href: "/", title: "Home" },
  { href: buildSearchQuery({ sortBy: "latest", page: 1 }), title: "Leaderboards" },
  { href: "/my-leaderboards", title: "My Leaderboards" },
]

interface IProps {
  showingMobileSidebar?: boolean
  openSidebar?: () => void
}
const Header = ({ showingMobileSidebar, openSidebar }: IProps) => {
  const closeBtnRef = React.useRef<HTMLButtonElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const session = useSession()
  const { openAuthModal } = React.useContext(authModalContext)
  const { openEditCurrentUserDialog } = React.useContext(usersUiContext)
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" })

  const UnauthenticatedUserContent = () => (
    <ButtonGroup color="white">
      <Button
        colorScheme="blue"
        size={buttonSize}
        mr={3}
        onClick={() => openAuthModal({ type: "signup" })}
      >
        Sign Up
      </Button>

      <Button
        backgroundColor="gray.600"
        _hover={{ backgroundColor: "gray.700" }}
        size={buttonSize}
        onClick={() => openAuthModal({ type: "login" })}
      >
        Log In
      </Button>
    </ButtonGroup>
  )

  const AuthenticatedUserContent = () => {
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
          <MenuGroup title={undefined}>
            <Link href="/my-leaderboards">
              <a>
                <MenuItem>My Leaderboards</MenuItem>
              </a>
            </Link>
            <MenuItem onClick={() => openEditCurrentUserDialog()}>Account Settings</MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={async () => {
                await logout()
              }}
            >
              Log Out
            </MenuItem>
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
      boxShadow="sm"
      zIndex={1}
    >
      <Box display="flex" alignItems="center" marginLeft={{ base: "10px", md: "25px" }}>
        {showingMobileSidebar && openSidebar && (
          <IconButton
            icon={<Icon as={FaAlignJustify} />}
            colorScheme="white"
            onClick={openSidebar}
            aria-label="Open mobile sidebar"
            size="lg"
          />
        )}

        <Box display={{ base: "none", md: "flex" }}>
          <Link passHref href="/">
            <Box
              color="rgba(255, 255, 255, .9)"
              as="a"
              fontSize={{ base: "lg", md: "xl" }}
              marginRight="10px"
            >
              YourScoreKeeper
            </Box>
          </Link>

          <HStack marginLeft="10px" spacing={4} display="flex" alignItems="flex-end">
            <Link passHref href={buildSearchQuery({ sortBy: "latest", page: 1 })}>
              <Box color="rgba(255, 255, 255, .9)" as="a" fontSize={{ base: "sm", md: "md" }}>
                Leaderboards
              </Box>
            </Link>
          </HStack>
        </Box>
      </Box>

      <Button
        color="white"
        display={{ base: "flex", md: "none" }}
        size="md"
        variant="ghost"
        ref={closeBtnRef}
        onClick={() => setMobileMenuOpen(true)}
      >
        Menu
      </Button>

      {/* Header auth items */}
      {session.isLoading ? null : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          marginLeft="auto"
          paddingX={{ base: "10px", md: "30px" }}
        >
          {session.userId ? (
            <React.Suspense
              fallback={
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Spinner />
                </Box>
              }
            >
              <AuthenticatedUserContent />
            </React.Suspense>
          ) : (
            <UnauthenticatedUserContent />
          )}
        </Box>
      )}

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

      <Drawer
        isOpen={mobileMenuOpen}
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        finalFocusRef={closeBtnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody backgroundColor="gray.300" padding="0px">
            <Box as="ul">
              <VStack spacing={0} display="flex">
                {mobileNavLinksConfig.map((item) => {
                  return (
                    <Button
                      as="li"
                      padding="0px"
                      width="100%"
                      borderRadius="0px"
                      borderBottom="1px solid rgba(0,0,0,.05)"
                      onClick={() => setMobileMenuOpen(false)}
                      key={item.href}
                    >
                      <Link passHref href={item.href}>
                        <Box
                          as="a"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          width="100%"
                          height="100%"
                          fontSize={{ base: "sm", md: "md" }}
                        >
                          {item.title}
                        </Box>
                      </Link>
                    </Button>
                  )
                })}
              </VStack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Header
