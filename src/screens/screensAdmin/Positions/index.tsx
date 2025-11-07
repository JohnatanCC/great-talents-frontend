// src/pages/admin/positions/PositionsList.tsx
import { useEffect, useMemo, useState } from "react"
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

  const getPositions = async () => {
    try {
      setLoading(true)
      const response = await api.get('/positions')
      setItems(response.data)
    } catch (error) {
      toast({
        title: "Erro ao carregar cargos",
        status: "error",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPositions()
  }, [])

  // Filtro de busca
  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const lower = search.toLowerCase()
    return items.filter((item) => item.name.toLowerCase().includes(lower))
  }, [items, search])

  // Criar cargo
  const handleCreate = async (payload: { name: string }): Promise<PositionDTO> => {
    const response = await api.post('/positions', payload)
    const newPosition = response.data
    setItems((prev) => [...prev, newPosition])
    return newPosition
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
                <PositionCard key={p.id} position={p} />
              ))}
            </SimpleGrid>
          )}
        </CardBody>
      </Content>
    </Layout>
  )
}
