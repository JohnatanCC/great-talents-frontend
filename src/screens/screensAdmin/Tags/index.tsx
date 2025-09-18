// src/pages/admin/tags/TagsList.tsx
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
import TagForm, { type TagDTO } from "./components/TagForm"
import api from "@/services/api"
import Layout from "@/Layout"
import SearchBar from "@/components/UI/SearchBar"
import TagCard from "./components/Tag"
import Content from "@/components/UI/Content"

// ===== Toggle para mock =====
const USE_MOCK = true

// ===== Mock (para testes sem backend) =====
const mockTags: TagDTO[] = [
  { id: 1, name: "Comunicação" },
  { id: 2, name: "Trabalho em equipe" },
  { id: 3, name: "Proatividade" },
  { id: 4, name: "Organização" },
  { id: 5, name: "Foco em resultados" },
  { id: 6, name: "Atendimento ao cliente" },
]

// ===== Helpers (API reais) =====
async function listTags(): Promise<TagDTO[]> {
  if (USE_MOCK) return Promise.resolve([...mockTags])
  const { data } = await api.get("/tags")
  return Array.isArray(data) ? data : (data?.results ?? [])
}
async function createTag(payload: { name: string }): Promise<TagDTO> {
  if (USE_MOCK) return Promise.resolve({ id: Number(Date.now()), name: payload.name })
  const { data } = await api.post("/tags", payload)
  return data
}
async function updateTag(id: number, payload: { name: string }): Promise<TagDTO> {
  if (USE_MOCK) return Promise.resolve({ id, name: payload.name })
  const { data } = await api.patch(`/tags/${id}`, payload)
  return data
}
async function deleteTag(id: number): Promise<void> {
  if (USE_MOCK) return Promise.resolve()
  await api.delete(`/tags/${id}`)
}

// ===== Page =====
export default function TagsList() {
  const toast = useToast()
  const [items, setItems] = useState<TagDTO[]>([])
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
      const data = await listTags()
      setItems(data)
    } catch {
      toast({ title: "Erro ao carregar tags", status: "error" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { void fetchAll() }, [fetchAll])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return items
    return items.filter((t) => t.name?.toLowerCase().includes(term))
  }, [items, search])

  // callbacks para filhos (CRUD)
  async function handleCreate(payload: { name: string }) {
    const created = await createTag(payload)
    setItems((prev) => [created, ...prev])
    return created
  }
  async function handleUpdate(id: number, payload: { name: string }) {
    const updated = await updateTag(id, payload)
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
    return updated
  }
  async function handleDelete(id: number) {
    await deleteTag(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <Layout>
      <Content >
        <CardHeader>
          <Flex align="center" justify="space-between" gap={3} wrap="wrap">
            <Heading size="lg">Tags</Heading>
          </Flex>

          {/* Criar */}
          <Box mt={4}>
            <TagForm
              existing={items}
              onCreateApi={handleCreate}
              placeholder="Crie sua tag (ex.: Comunicação)"
            />
            <Text mt={2} color="GrayText">
              Tags são palavras-chave que ajudam a categorizar e destacar habilidades ou características importantes em uma vaga. Elas facilitam a busca e o filtro de vagas pelos candidatos.
            </Text>
          </Box>

          {/* Busca — SearchBar padrão do projeto */}
          <HStack mt={4}>
            <SearchBar
              placeholder="Buscar tags"
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
              <Heading size="sm">Nenhuma tag encontrada</Heading>
              <Text fontSize="sm">Cadastre uma nova ou ajuste a busca.</Text>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
              {filtered.map((t) => (
                <TagCard
                  key={t.id}
                  tag={t}
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
