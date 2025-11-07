// src/pages/admin/benefits/Benefits.tsx
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
import Layout from "@/Layout"
import api from "@/services/api"
import BenefitForm from "./components/BenefitForm"
import BenefitCard from "./components/BenefitCard"
import SearchBar from "@/components/UI/SearchBar"
import Content from "@/components/UI/Content"

export interface BenefitDTO {
  id: number
  description: string
}

export default function Benefits() {
  const toast = useToast()
  const [items, setItems] = useState<BenefitDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  // debounce da busca
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250)
    return () => clearTimeout(t)
  }, [searchInput])

  const getBenefits = async () => {
    try {
      setLoading(true)
      const response = await api.get('/benefits')
      setItems(response.data)
    } catch (error) {
      toast({
        title: "Erro ao carregar benefícios",
        status: "error",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBenefits()
  }, [])

  // Filtro de busca
  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const lower = search.toLowerCase()
    return items.filter((item) => item.description.toLowerCase().includes(lower))
  }, [items, search])

  // Criar benefício
  const handleCreate = async (payload: { description: string }): Promise<BenefitDTO> => {
    const response = await api.post('/benefits', payload)
    const newBenefit = response.data
    setItems((prev) => [...prev, newBenefit])
    return newBenefit
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
                <BenefitCard key={b.id} benefit={b} />
              ))}
            </SimpleGrid>
          )}
        </CardBody>
      </Content>
    </Layout>
  )
}
