import React, { useState } from "react"
import {
  Flex,
  Text,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { DeleteIcon, EditIcon } from "lucide-react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface TagCardProps {
  tag: { id: number; name: string }
  onUpdate?: (id: number, payload: { name: string }) => Promise<void>
  onDelete?: (id: number) => Promise<void>
}

const TagCard: React.FC<TagCardProps> = ({ tag, onUpdate, onDelete }) => {
  const [editValue, setEditValue] = useState(tag.name)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const handleSave = async () => {
    if (!editValue.trim()) {
      toast({ title: "Informe o nome da tag", status: "warning" })
      return
    }
    try {
      await onUpdate?.(tag.id, { name: editValue })
      toast({ title: "Tag atualizada", status: "success" })
      onClose()
    } catch {
      toast({ title: "Erro ao atualizar tag", status: "error" })
    }
  }

  return (
    <>
      <Flex
        bg="surfaceSubtle"
        alignItems="center"
        boxShadow="sm"
        p={2}
        borderWidth={1}
        borderColor="ring"
        borderRadius="md"
        justify="space-between"
      >
        <Tooltip hasArrow label={tag.name} fontSize="md">
          <Text fontWeight="medium" noOfLines={1}>
            {tag.name}
          </Text>
        </Tooltip>

        <Menu>
          <MenuButton disabled as={IconButton} aria-label="Ações" icon={<ChevronDownIcon />} variant="ghost" colorScheme="blue" size="sm" />
          <MenuList>
            <MenuItem icon={<EditIcon />} color="blue.500">Editar</MenuItem>
            <MenuItem icon={<DeleteIcon />} color="red.500">Excluir</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Modal editar */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Tag</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="Nome da tag" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleSave}>
              Salvar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TagCard
