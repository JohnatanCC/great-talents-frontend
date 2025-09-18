// src/pages/admin/positions/PositionsList.tsx
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
import api from "@/services/api"

import PositionForm, { type PositionDTO } from "./components/PositionForm"
import SearchBar from "@/components/UI/SearchBar"
import PositionCard from "./components/Position"
import Layout from "@/Layout"
import Content from "@/components/UI/Content"


// ===== Mock =====
const mockPositions: PositionDTO[] = [
  { id: 1, name: "Analista de RH" },
  { id: 2, name: "Desenvolvedor Frontend" },
  { id: 3, name: "Gerente de Projetos" },
  { id: 4, name: "Operador de Caixa" },
  { id: 5, name: "Auxiliar Administrativo" },
  { id: 6, name: "Designer Gráfico" },
  { id: 7, name: "Coordenador de Marketing" },
]

const USE_MOCK = true // Altere para false para usar a API real
let mockState = [...mockPositions]

async function listPositions(): Promise<PositionDTO[]> {
  if (USE_MOCK) {
    return Promise.resolve([...mockState])
  }
  const { data } = await api.get("/positions")
  return Array.isArray(data) ? data : (data?.results ?? [])
}
async function createPosition(payload: { name: string }): Promise<PositionDTO> {
  if (USE_MOCK) {
    const newId = Math.max(0, ...mockState.map(p => p.id)) + 1
    const created = { id: newId, name: payload.name }
    mockState = [created, ...mockState]
    return Promise.resolve(created)
  }
  const { data } = await api.post("/positions", payload)
  return data
}
async function updatePosition(id: number, payload: { name: string }): Promise<PositionDTO> {
  if (USE_MOCK) {
    mockState = mockState.map(p => p.id === id ? { ...p, ...payload } : p)
    const updated = mockState.find(p => p.id === id)!
    return Promise.resolve(updated)
  }
  const { data } = await api.patch(`/positions/${id}`, payload)
  return data
}
async function deletePosition(id: number): Promise<void> {
  if (USE_MOCK) {
    mockState = mockState.filter(p => p.id !== id)
    return Promise.resolve()
  }
  await api.delete(`/positions/${id}`)
}

// ===== Page =====
export default function PositionsList() {
  const toast = useToast()
  const [items, setItems] = useState<PositionDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  // debounce da busca
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const data = await listPositions()
      setItems(data)
    } catch {
      toast({ title: "Erro ao carregar cargos", status: "error" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { void fetchAll() }, [fetchAll])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return items
    return items.filter((p) => p.name?.toLowerCase().includes(term))
  }, [items, search])

  // callbacks para filhos
  async function handleCreate(payload: { name: string }) {
    const created = await createPosition(payload)
    setItems((prev) => [created, ...prev])
    return created
  }
  async function handleUpdate(id: number, payload: { name: string }) {
    const updated = await updatePosition(id, payload)
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
    return updated
  }
  async function handleDelete(id: number) {
    await deletePosition(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <Layout>
      <Content>
        <CardHeader>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Heading size="lg">Cargos</Heading>
          </Flex>

          {/* Criar */}
          <Box mt={4}>
            <PositionForm
              existing={items}
              onCreateApi={handleCreate}
              placeholder="Crie seu cargo (ex.: Operador de Caixa)"
            />
            <Text mt={2} color="GrayText">
              Cargos são funções ou posições de trabalho em sua organização. Eles ajudam a categorizar e organizar as diferentes responsabilidades e níveis hierárquicos.
            </Text>
          </Box>

          {/* Busca — usando seu SearchBar */}
          <HStack mt={4} >
            <SearchBar
              placeholder="Buscar cargos"
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
              <Heading size="sm">Nenhum cargo encontrado</Heading>
              <Text fontSize="sm">Cadastre um novo ou ajuste a busca.</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
              {filtered.map((p) => (
                <PositionCard
                  key={p.id}
                  position={p}
                  onUpdate={async (id, payload) => { await handleUpdate(id, payload) }}
                  onDelete={async (id) => { await handleDelete(id) }}
                />
              ))}
            </SimpleGrid>
          )}
        </CardBody>
      </Content>
    </Layout>
  )
}
