// src/pages/admin/processes/SelectiveProcesses.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    Card, CardHeader, CardBody,
    Container, Divider, Flex, Heading, HStack, IconButton,
    Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid,
    Text, Tooltip, Skeleton, useColorModeValue, useToast,
    Button,
} from "@chakra-ui/react"
import { RepeatIcon, AddIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"
import Layout from "@/Layout"
import SearchBar from "@/components/UI/SearchBar"
import SelectiveProcessCard, { type SelectionProcessDTO } from "./components/SelectiveProcessCard"
import Content from "@/components/UI/Content"
// import SelectionProcessService from "@/services/SelectionProcessService"

// ===== Toggle de mock =====
const USE_MOCK = true

// ===== Tipos =====
type SelectionProcessesByStatus = {
    open: SelectionProcessDTO[]
    created: SelectionProcessDTO[]
    paused: SelectionProcessDTO[]
    finished: SelectionProcessDTO[]
}

// ===== Mock =====
const now = new Date().toISOString()
const mockData: SelectionProcessesByStatus = {
    open: [
        { id: 1, title: "Atendente de loja", state: "CE", city: "Fortaleza", contract_type: "CLT", is_pcd: true, created_at: now },
        { id: 2, title: "Repositor", state: "RN", city: "Natal", contract_type: "Temporário", created_at: now },
    ],
    created: [
        { id: 3, title: "Operador de caixa", state: "PE", city: "Recife", contract_type: "CLT", created_at: now },
    ],
    paused: [
        { id: 4, title: "Auxiliar de estoque", state: "PB", city: "João Pessoa", contract_type: "PJ", created_at: now },
    ],
    finished: [
        { id: 5, title: "Vendedor interno", state: "CE", city: "Maracanaú", contract_type: "CLT", created_at: now },
    ],
}

// ===== Helpers (API real) =====
async function listByStatus(): Promise<SelectionProcessesByStatus> {
    if (USE_MOCK) return Promise.resolve(mockData)
    // const resp = await SelectionProcessService.findAllByStatus()
    // return resp as SelectionProcessesByStatus
    return { open: [], created: [], paused: [], finished: [] }
}

// ===== Normalizador simples =====
function normalize(s: string) {
    return (s || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim()
}

// ===== Página =====
export default function SelectiveProcesses() {
    const toast = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SelectionProcessesByStatus>({ open: [], created: [], paused: [], finished: [] })
    const [activeTab, setActiveTab] = useState(0)

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
            const res = await listByStatus()
            setData(res)
        } catch {
            toast({ title: "Erro ao carregar processos", status: "error" })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => { void fetchAll() }, [fetchAll])

    // dataset corrente por aba
    const currentList = useMemo(() => {
        switch (activeTab) {
            case 0: return data.open
            case 1: return data.created
            case 2: return data.paused
            case 3: return data.finished
            default: return []
        }
    }, [activeTab, data])

    const filtered = useMemo(() => {
        const term = normalize(search)
        if (!term) return currentList
        return currentList.filter((v) =>
            [v.title, v.city, v.state, v.contract_type]
                .filter(Boolean)
                .map((x) => normalize(String(x)))
                .some((x) => x.includes(term))
        )
    }, [currentList, search])

    const totalForTab = currentList.length

    return (
        <Layout>
            <Content
            >
                <CardHeader pb={2}>
                    <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                        <Heading size="lg" fontWeight={800} letterSpacing={-1}>Processos seletivos</Heading>
                        <Button onClick={() => navigate("/empresa/processo-seletivo/novo")} colorScheme="green">
                            Novo processo
                        </Button>
                    </Flex>

                    {/* contador + busca */}
                    <Flex mt={6} gap={6} align="center" wrap="wrap">
                        <HStack>
                            <Text fontWeight="semibold">Total por etapa:</Text>
                            <Heading size="md">{totalForTab}</Heading>
                        </HStack>
                        <HStack flex={1}>
                            <SearchBar
                                placeholder="Buscar por título, cidade, estado ou contrato"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </HStack>
                    </Flex>

                    <Tabs
                        mt={6}
                        variant="enclosed"
                        colorScheme="brand"
                        onChange={(i) => setActiveTab(i)}
                    >
                        <TabList fontWeight={700} fontSize="md">
                            <Tab>Abertos</Tab>
                            <Tab>Salvos</Tab>
                            <Tab>Pausados</Tab>
                            <Tab>Finalizados</Tab>
                        </TabList>

                        <TabPanels>
                            {[data.open, data.created, data.paused, data.finished].map((list, idx) => (
                                <TabPanel key={idx} px={0} pt={6}>
                                    {loading ? (
                                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <Skeleton key={i} height="160px" borderRadius="2xl" />
                                            ))}
                                        </SimpleGrid>
                                    ) : list.length === 0 ? (
                                        <Flex py={10} direction="column" align="center" gap={2} color="muted">
                                            <Heading size="sm">Nenhum processo encontrado</Heading>
                                            <Text fontSize="sm">Crie um novo ou ajuste a busca.</Text>
                                        </Flex>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                            {filtered.map((vaga) => (
                                                <SelectiveProcessCard key={vaga.id} vaga={vaga} />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </Tabs>
                </CardHeader>

                <CardBody pt={0} />
            </Content>
        </Layout>
    )
}
