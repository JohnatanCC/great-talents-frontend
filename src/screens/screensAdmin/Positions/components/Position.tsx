import React, { useState } from "react"
import {
  Flex,
  Text,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  useToast,
  Input,
  HStack,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react"
import { EditIcon, DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons"

interface PositionProps {
  position: {
    id: number;
    name: string;
  };
}


interface PositionCardProps {
  position: PositionProps["position"]
  onUpdate?: (id: number, payload: { name: string }) => Promise<void>
  onDelete?: (id: number) => Promise<void>
}

const PositionCard: React.FC<PositionCardProps> = ({ position, onUpdate, onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: delOpen, onOpen: delModalOpen, onClose: delClose } = useDisclosure()
  const [newName, setNewName] = useState(position.name)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()
  const handleSave = async () => {
    if (!onUpdate) return
    setLoading(true)
    try {
      await onUpdate(position.id, { name: newName })
      toast({ title: "Cargo atualizado", status: "success" })
      onClose()
    } catch {
      toast({ title: "Erro ao atualizar cargo", status: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setDeleting(true)
    try {
      await onDelete(position.id)
      toast({ title: "Cargo excluído", status: "success" })
      delClose()
    } catch {
      toast({ title: "Erro ao excluir cargo", status: "error" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Flex
        bg="surfaceSubtle"
        borderWidth="1px"
        borderColor="ring"
        borderRadius="md"
        p={2}
        align="center"
        justify="space-between"
        shadow="sm"
      >
        <Tooltip label={position.name} hasArrow>
          <Text fontWeight="medium" noOfLines={1}>
            {position.name}
          </Text>
        </Tooltip>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Ações"
            icon={<ChevronDownIcon />}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            disabled
          />
          <MenuList>
            <MenuItem color="blue.500" icon={<EditIcon />} onClick={onOpen}>
              Editar
            </MenuItem>
            <MenuItem icon={<DeleteIcon />} onClick={delModalOpen} color="red.500">
              Excluir
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Modal de edição */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar cargo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do cargo"
            />
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button onClick={onClose} variant="ghost">Cancelar</Button>
              <Button colorScheme="brand" onClick={handleSave} isLoading={loading}>
                Salvar
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de exclusão */}
      <Modal isOpen={delOpen} onClose={delClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir cargo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza que deseja excluir o cargo "{position.name}"?
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button onClick={delClose} variant="ghost">Cancelar</Button>
              <Button colorScheme="red" onClick={handleDelete} isLoading={deleting}>
                Excluir
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default PositionCard
