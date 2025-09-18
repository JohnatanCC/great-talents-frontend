// src/pages/admin/tags/components/TagForm.tsx
import React, { useMemo, useState } from "react"
import { Flex, IconButton, Input, Spinner, useToast } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons";
import InputForm from "@/components/UI/InputForm";

export type TagDTO = { id: number; name: string }

type TagFormProps = {
  /** Chamada real de criação (API). Deve retornar a tag criada. */
  onCreateApi?: (payload: { name: string }) => Promise<TagDTO>
  /** Callback opcional para atualizar a lista no pai. */
  onCreate?: (created: TagDTO) => void
  /** Lista atual para evitar duplicados (case-insensitive). */
  existing?: TagDTO[]
  /** Placeholder do campo. */
  placeholder?: string
}

const TagForm: React.FC<TagFormProps> = ({
  onCreateApi,
  onCreate,
  existing = [],
  placeholder = "Crie sua tag",
}) => {
  const toast = useToast()
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const duplicates = useMemo(
    () => new Set(existing.map((e) => e.name.trim().toLowerCase())),
    [existing]
  )

  async function submit() {
    const name = value.trim()
    if (!name) {
      toast({ title: "Informe o nome da tag", status: "warning" })
      return
    }
    if (duplicates.has(name.toLowerCase())) {
      toast({ title: "Tag já cadastrada", status: "info" })
      return
    }
    if (!onCreateApi && !onCreate) {
      toast({ title: "Ação indisponível — forneça onCreateApi ou onCreate", status: "warning" })
      return
    }

    try {
      setLoading(true)
      const created = onCreateApi
        ? await onCreateApi({ name })
        : { id: Number(Math.random().toString().slice(2)), name }

      onCreate?.(created)
      setValue("")
      toast({ title: "Tag criada com sucesso", status: "success" })
    } catch {
      toast({ title: "Erro ao criar tag", status: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Flex as="form" onSubmit={(e) => { e.preventDefault(); submit() }} w="full" gap={2}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit() } }}
      />
      <IconButton type="submit" aria-label="Adicionar" colorScheme="green" isDisabled={loading} icon={loading ? <Spinner size="sm" /> : <AddIcon />} />
    </Flex>
  )
}

export default TagForm
