import * as React from "react"
import {
  Box,
  ButtonGroup,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/core"
import { darken } from "polished"
import { useCurrentUser } from "app/hooks/useCurrentUser"

const Header = () => {
  const currentUser = useCurrentUser()
  const [modalOpen, setModalOpen] = React.useState(false)

  return (
    <Box
      top={0}
      position="sticky"
      display="flex"
      alignItems="center"
      height="64px"
      minHeight="64px"
      color="rgba(255, 255, 255, .9)"
      backgroundColor="#B9A061"
      zIndex={1}
    >
      <Box>Stuff</Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginLeft="auto"
        paddingX="30px"
      >
        <ButtonGroup>
          <Button colorScheme="blue" size="md" mr={3} onClick={() => setModalOpen(true)}>
            Sign Up
          </Button>

          <Button
            backgroundColor="gray.600"
            _hover={{ backgroundColor: "gray.700" }}
            size="md"
            onClick={() => setModalOpen(true)}
          >
            Log In
          </Button>
        </ButtonGroup>
      </Box>

      <Box
        position="absolute"
        display="flex"
        justifyContent="flex-end"
        right={0}
        width={["62px", "92px"]}
        height="100%"
        backgroundColor="#A99156"
        zIndex={-1}
      >
        <Box width={["20px", "30px"]} backgroundColor={darken(0.15, "#A99156")} />
      </Box>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae itaque quod iure
              sed dolorum voluptas laborum esse. Repudiandae, in quam totam architecto omnis iusto
              odio optio sequi obcaecati molestias dolorem.
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => setModalOpen(false)}>
                Close
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Box>
  )
}

export default Header
