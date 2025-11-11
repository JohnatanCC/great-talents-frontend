// src/pages/admin/positions/PositionsList.tsx
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
  Text,
  useToast,
} from "@chakra-ui/react"
import api from "@/services/api"

import PositionForm, { type PositionDTO } from "./components/PositionForm"
import SearchBar from "@/components/UI/SearchBar"
import PositionCard from "./components/Position"
import Layout from "@/Layout"
import Content from "@/components/UI/Content"
import Loader from "@/components/UI/Loader"
import NoDataFound from "@/components/UI/NoDataFound"

// ===== Page =====
export default function PositionsList() {
  const toast = useToast()
  const hasInitialized = useRef(false)

  const [items, setItems] = useState<PositionDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  // debounce da busca
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  const getPositions = useCallback(async () => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    try {
      setLoading(true)
      console.log("🔄 [Admin/Positions] Carregando cargos...")
      const response = await api.get('/positions')
      setItems(response.data)
      console.log(`✅ [Admin/Positions] ${response.data.length} cargos carregados`)
    } catch (error) {
      console.error("❌ [Admin/Positions] Erro ao carregar cargos:", error)
      toast({
        title: "Erro ao carregar cargos",
        status: "error",
        duration: 3000,
      })
      setItems([]) // Garantir estado limpo em caso de erro
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void getPositions()
  }, [])

  // Filtro de busca
  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const lower = search.toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(lower))
  }, [items, search])

  // Criar cargo
  const handleCreate = useCallback(async (payload: { name: string }): Promise<PositionDTO> => {
    try {
      console.log("🔄 [Admin/Positions] Criando cargo:", payload.name)
      const response = await api.post('/positions', payload)
      const newPosition = response.data
      setItems((prev) => [...prev, newPosition])
      console.log("✅ [Admin/Positions] Cargo criado com sucesso:", newPosition.name)
      return newPosition
    } catch (error) {
      console.error("❌ [Admin/Positions] Erro ao criar cargo:", error)
      throw error // Re-throw para que o componente possa lidar com o erro
    }
  }, [])

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
            <Text mt={2} color="muted">
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
            <Loader message="Carregando cargos..." />
          ) : filtered.length === 0 ? (
            <NoDataFound
              context={search.trim() ? "search" : "create"}
              title={search.trim() ? "Nenhum cargo encontrado" : "Nenhum cargo cadastrado"}
              description={
                search.trim()
                  ? "Tente ajustar o termo de busca ou limpar os filtros."
                  : "Comece criando o primeiro cargo da sua organização."
              }
            />
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
              {filtered.map((p) => (
                <PositionCard key={p.id} position={p} />
              ))}
            </SimpleGrid>
          )}
        </CardBody>
      </Content>
    </Layout>
  )
}
