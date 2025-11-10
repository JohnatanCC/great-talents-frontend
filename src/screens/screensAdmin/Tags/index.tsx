// src/pages/admin/tags/TagsList.tsx
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
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

// ===== Page =====
export default function TagsList() {
  const toast = useToast()
  const hasInitialized = useRef(false)

  const [items, setItems] = useState<TagDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  // debounce da busca
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  const getTags = useCallback(async () => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    try {
      setLoading(true)
      console.log("🔄 [Admin/Tags] Carregando tags...")
      const response = await api.get('/tags')
      setItems(response.data)
      console.log(`✅ [Admin/Tags] ${response.data.length} tags carregadas`)
    } catch (error) {
      console.error("❌ [Admin/Tags] Erro ao carregar tags:", error)
      toast({
        title: "Erro ao carregar tags",
        status: "error",
        duration: 3000,
      })
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void getTags()
  }, [])

  // Filtro de busca
  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const lower = search.toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(lower))
  }, [items, search])

  // Criar tag
  const handleCreate = useCallback(async (payload: { name: string }): Promise<TagDTO> => {
    try {
      console.log("🔄 [Admin/Tags] Criando tag:", payload.name)
      const response = await api.post('/tags', payload)
      const newTag = response.data
      setItems((prev) => [...prev, newTag])
      console.log("✅ [Admin/Tags] Tag criada com sucesso:", newTag.name)
      return newTag
    } catch (error) {
      console.error("❌ [Admin/Tags] Erro ao criar tag:", error)
      throw error
    }
  }, [])

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
                <TagCard key={t.id} tag={t} />
              ))}
            </SimpleGrid>
          )}
        </CardBody>
      </Content>
    </Layout>
  )
}
