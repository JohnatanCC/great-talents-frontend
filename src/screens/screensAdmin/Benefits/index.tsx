// src/pages/admin/benefits/Benefits.tsx
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Box,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react"
import Layout from "@/Layout"
import api from "@/services/api"
import BenefitForm from "./components/BenefitForm"
import BenefitCard from "./components/BenefitCard"
import SearchBar from "@/components/UI/SearchBar" // ✅ use seu componente
import Content from "@/components/UI/Content"


export interface BenefitDTO {
  id: number
  description: string
}

// Lista estática para testes
export const mockBenefits: BenefitDTO[] = [
  { id: 1, description: "Vale-refeição" },
  { id: 2, description: "Plano de saúde" },
  { id: 3, description: "Vale-transporte" },
  { id: 4, description: "Auxílio educação" },
  { id: 5, description: "Gympass" },
  { id: 6, description: "Seguro de vida" },
  { id: 7, description: "Day off no aniversário" },
]


// Flag para alternar entre mock e API real
const USE_MOCK = true // Altere para false para usar a API real

// Mock CRUD
let mockState = [...mockBenefits]

async function listBenefits(): Promise<BenefitDTO[]> {
  if (USE_MOCK) {
    return Promise.resolve([...mockState])
  }
  const { data } = await api.get("/benefits")
  return Array.isArray(data) ? data : (data?.results ?? [])
}
async function createBenefit(payload: { description: string }): Promise<BenefitDTO> {
  if (USE_MOCK) {
    const newId = Math.max(0, ...mockState.map(b => b.id)) + 1
    const created = { id: newId, description: payload.description }
    mockState = [created, ...mockState]
    return Promise.resolve(created)
  }
  const { data } = await api.post("/benefits", payload)
  return data
}
async function updateBenefit(id: number, payload: { description: string }): Promise<BenefitDTO> {
  if (USE_MOCK) {
    mockState = mockState.map(b => b.id === id ? { ...b, ...payload } : b)
    const updated = mockState.find(b => b.id === id)!
    return Promise.resolve(updated)
  }
  const { data } = await api.patch(`/benefits/${id}`, payload)
  return data
}
async function deleteBenefit(id: number): Promise<void> {
  if (USE_MOCK) {
    mockState = mockState.filter(b => b.id !== id)
    return Promise.resolve()
  }
  await api.delete(`/benefits/${id}`)
}

export default function Benefits() {
  const toast = useToast()
  const [items, setItems] = useState<BenefitDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listBenefits()
      setItems(data)
    } catch {
      toast({ title: "Erro ao carregar benefícios", status: "error" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { void fetchAll() }, [fetchAll])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const base = Array.isArray(items) ? items : []
    if (!term) return base
    return base.filter((b) => b.description?.toLowerCase().includes(term))
  }, [items, search])

  // callbacks para filhos
  async function handleCreate(payload: { description: string }) {
    const created = await createBenefit(payload)
    setItems((prev) => [created, ...prev])
    return created
  }
  async function handleUpdate(id: number, payload: { description: string }) {
    const updated = await updateBenefit(id, payload)
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
    return updated
  }
  async function handleDelete(id: number) {
    await deleteBenefit(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <Layout>
      <Content>
        <CardHeader>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Heading size="lg">Benefícios</Heading>
          </Flex>

          {/* Criar */}
          <Box mt={4}>
            <BenefitForm
              existing={items}
              onCreateApi={handleCreate}
              placeholder="Adicionar novo benefício (ex.: Vale-refeição)"
            />
            <Text mt={2} color="GrayText">
              Destacar os benefícios ao criar uma vaga é crucial para atrair
              os candidatos ideais e despertar interesse no cargo. Isso mostra
              o compromisso da empresa com o bem-estar dos colaboradores,
              resultando em candidaturas mais qualificadas e uma maior
              retenção de talentos.
            </Text>
          </Box>

          {/* Busca — usando seu SearchBar */}
          <HStack mt={4}>
            <SearchBar
              placeholder="Buscar benefícios"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </HStack>
        </CardHeader>

        <Divider />

        <CardBody>
          {loading ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} height="40px" borderRadius="md" />
              ))}
            </SimpleGrid>
          ) : filtered.length === 0 ? (
            <Flex py={8} direction="column" align="center" gap={2} color="muted">
              <Heading size="sm">Nenhum benefício encontrado</Heading>
              <Text fontSize="sm">Cadastre um novo ou ajuste a busca.</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
              {filtered.map((b) => (
                <BenefitCard
                  key={b.id}
                  benefit={b}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </SimpleGrid>
          )}
        </CardBody>
      </Content>
    </Layout>
  )
}
