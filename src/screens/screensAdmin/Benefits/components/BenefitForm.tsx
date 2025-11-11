import { useMemo, useState } from "react"
import { Flex, IconButton, Input, Spinner, useToast } from "@chakra-ui/react"
import { Plus } from "lucide-react"

export type BenefitFormProps = {
  /**
   * Cria no backend e retorna o registro criado. Se não for informado,
   * o componente cai num modo "controlado por pai" via onCreate.
   */
  onCreateApi?: (payload: { description: string }) => Promise<{ id: number; description: string }>
  /**
   * Callback opcional para o pai atualizar a lista local (ex.: optimistic UI)
   */
  onCreate?: (created: { id: number; description: string }) => void
  /**
   * Lista atual para evitar duplicados pelo front (case-insensitive). Opcional.
   */
  existing?: Array<{ id: number; description: string }>
  /**
   * Placeholder customizado
   */
  placeholder?: string
}

export default function BenefitForm({ onCreateApi, onCreate, existing = [], placeholder = "Adicione o benefício" }: BenefitFormProps) {
  const toast = useToast()
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const duplicates = useMemo(() => new Set(existing.map((e) => e.description.trim().toLowerCase())), [existing])

  async function submit() {
    const description = value.trim()
    if (!description) {
      toast({ title: "Informe a descrição", status: "warning" })
      return
    }
    if (duplicates.has(description.toLowerCase())) {
      toast({ title: "Benefício já cadastrado", status: "info" })
      return
    }

    if (!onCreateApi && !onCreate) {
      // fallback: apenas limpar
      setValue("")
      toast({ title: "Ação indisponível — forneça onCreateApi ou onCreate", status: "warning" })
      return
    }

    try {
      setLoading(true)
      console.log("🔄 [BenefitForm] Enviando criação:", description)

      const created = onCreateApi
        ? await onCreateApi({ description })
        : { id: Number(Math.random().toString().slice(2)), description }

      onCreate?.(created)
      setValue("")
      console.log("✅ [BenefitForm] Benefício criado e form limpo")
      toast({ title: "Benefício criado", status: "success" })
    } catch (e) {
      console.error("❌ [BenefitForm] Erro ao criar benefício:", e)
      toast({ title: "Erro ao criar benefício", status: "error" })
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
