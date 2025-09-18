import React, { useState } from "react"
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react"
import { EditIcon, DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons"

export type Benefit = { id: number; description: string }

export type BenefitCardProps = {
  benefit: Benefit
  /**
   * Atualiza o benefício no backend. Deve retornar o registro atualizado
   * ou lançar erro. O componente cuida do loading/UX.
   */
  onUpdate?: (id: number, payload: { description: string }) => Promise<Benefit>
  /** Exclui no backend e retorna void */
  onDelete?: (id: number) => Promise<void>
}

export default function BenefitCard({ benefit, onUpdate, onDelete }: BenefitCardProps) {
  const toast = useToast()
  const editDlg = useDisclosure()
  const delDlg = useDisclosure()
  const [desc, setDesc] = useState(benefit.description)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  async function handleSave() {
    const value = desc.trim()
    if (!value) {
      toast({ title: "Informe a descrição", status: "warning" })
      return
    }
    if (!onUpdate) { editDlg.onClose(); return }
    try {
      setSaving(true)
      await onUpdate(benefit.id, { description: value })
      toast({ title: "Benefício atualizado", status: "success" })
      editDlg.onClose()
    } catch (e) {
      toast({ title: "Erro ao atualizar", status: "error" })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!onDelete) { delDlg.onClose(); return }
    try {
      setDeleting(true)
      await onDelete(benefit.id)
      toast({ title: "Benefício removido", status: "success" })
      delDlg.onClose()
    } catch (e) {
      toast({ title: "Erro ao excluir", status: "error" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Stack>
      <HStack
        bg="surfaceSubtle"
        borderWidth="1px"
        borderColor="ring"
        borderRadius="md"
        spacing={2}
        px={2}
        py={1.5}
        align="center"
        justify="space-between"
      >
        <Tooltip hasArrow label={benefit.description}>
          <Text noOfLines={1} fontWeight="medium">{benefit.description}</Text>
        </Tooltip>
        <Menu>
          <MenuButton disabled as={IconButton} aria-label="Ações" icon={<ChevronDownIcon />} variant="ghost" colorScheme="blue" size="sm" />
          <MenuList>
            <MenuItem icon={<EditIcon />} color="blue.500" onClick={editDlg.onOpen}>Editar</MenuItem>
            <MenuItem icon={<DeleteIcon />} color="red.500" onClick={delDlg.onOpen}>Excluir</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Editar */}
      <Modal isOpen={editDlg.isOpen} onClose={editDlg.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar benefício</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave() } }} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={handleSave} isLoading={saving}>Salvar</Button>
            <Button variant="ghost" onClick={editDlg.onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Excluir */}
      <Modal isOpen={delDlg.isOpen} onClose={delDlg.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Excluir benefício</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Tem certeza que deseja excluir "{benefit.description}"?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete} isLoading={deleting}>Excluir</Button>
            <Button variant="ghost" onClick={delDlg.onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}
