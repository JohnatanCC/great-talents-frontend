// src/pages/admin/positions/components/PositionForm.tsx
import React, { useMemo, useState } from "react"
import { Flex, IconButton, Input, Spinner, useToast } from "@chakra-ui/react"
import { Plus } from "lucide-react";

export type PositionDTO = { id: number; name: string }

type PositionFormProps = {
  /** Chamada real de criação (API). Deve retornar o registro criado. */
  onCreateApi?: (payload: { name: string }) => Promise<PositionDTO>
  /** Atualiza a lista no pai (opcional, útil para optimistic UI). */
  onCreate?: (created: PositionDTO) => void
  /** Lista atual para evitar duplicados (case-insensitive). */
  existing?: PositionDTO[]
  /** Placeholder do campo. */
  placeholder?: string
}

const PositionForm: React.FC<PositionFormProps> = ({
  onCreateApi,
  onCreate,
  existing = [],
  placeholder = "Crie seu cargo",
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
      toast({ title: "Informe o nome do cargo", status: "warning" })
      return
    }
    if (duplicates.has(name.toLowerCase())) {
      toast({ title: "Cargo já cadastrado", status: "info" })
      return
    }
    if (!onCreateApi && !onCreate) {
      toast({ title: "Ação indisponível — forneça onCreateApi ou onCreate", status: "warning" })
      return
    }

    try {
      setLoading(true)
      console.log("🔄 [PositionForm] Enviando criação:", name)

      const created = onCreateApi
        ? await onCreateApi({ name })
        : { id: Number(Math.random().toString().slice(2)), name }

      onCreate?.(created)
      setValue("")
      console.log("✅ [PositionForm] Cargo criado e form limpo")
      toast({ title: "Cargo criado com sucesso", status: "success" })
    } catch (error) {
      console.error("❌ [PositionForm] Erro ao criar cargo:", error)
      toast({ title: "Erro ao criar cargo", status: "error" })
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
      <IconButton type="submit" aria-label="Adicionar" colorScheme="green" isDisabled={loading} icon={loading ? <Spinner size="sm" /> : <Plus />} />
    </Flex>
  )
}

export default PositionForm
