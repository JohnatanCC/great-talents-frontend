// src/pages/admin/processes/SelectiveProcesses.tsx
import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import {
    CardHeader, CardBody,
    Flex, Heading, HStack,
    Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid,
    Text, useToast,
    Button,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import Layout from "@/Layout"
import SearchBar from "@/components/UI/SearchBar"
import { SelectiveProcessCard } from "./components/SelectiveProcessCard"
import Content from "@/components/UI/Content"
import SelectionProcessService from "@/services/SelectionProcessService"
import { normalize } from "@/utils/normalize"
import type { SelectionProcess } from "@/types/selectionProcess.types"
import Loader from "@/components/UI/Loader"
import NoDataFound from "@/components/UI/NoDataFound"

// ===== Toggle de mock =====
const USE_MOCK = true // Temporariamente habilitado devido a erro 500 no backend

// ===== Tipos =====
type SelectionProcessesByStatus = {
    open: SelectionProcess[]
    created: SelectionProcess[]
    paused: SelectionProcess[]
    finished: SelectionProcess[]
}

// ===== Mock =====
const now = new Date().toISOString()
const mockData: SelectionProcessesByStatus = {
    open: [
        {
            id: 1,
            title: "Atendente de loja",
            state: "CE",
            city: "Fortaleza",
            contract_type: "CLT",
            is_pcd: true,
            created_at: now,
            profile: "OPERATIONAL",
            position_id: 1,
            work_modality: "TEMPO_INTEGRAL",
            salary_range: "R$ 1.500 - R$ 2.000",
            education: "ENSINO_MEDIO_COMPLETO",
            description: "Vaga para atendente",
            with_video: false,
            status: "OPEN",
            updated_at: now,
            created_by: 1,
            updated_by: 1,
            selection_process_benefits: [],
            selection_process_tags: [],
            selection_process_requirements: [],
            position: { id: 1, name: "Atendente" },
            user_company: {
                id: 1,
                company_id: "1",
                user_id: "1",
                user: { id: 1, name: "Empresa Teste" }
            }
        } as SelectionProcess,
        {
            id: 2,
            title: "Repositor",
            state: "RN",
            city: "Natal",
            contract_type: "CLT",
            is_pcd: false,
            created_at: now,
            profile: "OPERATIONAL",
            position_id: 2,
            work_modality: "TEMPO_INTEGRAL",
            salary_range: "R$ 1.400 - R$ 1.800",
            education: "ENSINO_MEDIO_COMPLETO",
            description: "Vaga para repositor",
            with_video: false,
            status: "OPEN",
            updated_at: now,
            created_by: 1,
            updated_by: 1,
            selection_process_benefits: [],
            selection_process_tags: [],
            selection_process_requirements: [],
            position: { id: 2, name: "Repositor" },
            user_company: {
                id: 1,
                company_id: "1",
                user_id: "1",
                user: { id: 1, name: "Empresa Teste" }
            }
        } as SelectionProcess,
    ],
    created: [
        {
            id: 3,
            title: "Operador de caixa",
            state: "PE",
            city: "Recife",
            contract_type: "CLT",
            is_pcd: false,
            created_at: now,
            profile: "OPERATIONAL",
            position_id: 3,
            work_modality: "TEMPO_INTEGRAL",
            salary_range: "R$ 1.600 - R$ 2.200",
            education: "ENSINO_MEDIO_COMPLETO",
            description: "Vaga para operador de caixa",
            with_video: false,
            status: "CREATED",
            updated_at: now,
            created_by: 1,
            updated_by: 1,
            selection_process_benefits: [],
            selection_process_tags: [],
            selection_process_requirements: [],
            position: { id: 3, name: "Operador de Caixa" },
            user_company: {
                id: 1,
                company_id: "1",
                user_id: "1",
                user: { id: 1, name: "Empresa Teste" }
            }
        } as SelectionProcess,
    ],
    paused: [
        {
            id: 4,
            title: "Auxiliar de estoque",
            state: "PB",
            city: "João Pessoa",
            contract_type: "PJ",
            is_pcd: false,
            created_at: now,
            profile: "OPERATIONAL",
            position_id: 4,
            work_modality: "TEMPO_INTEGRAL",
            salary_range: "R$ 1.300 - R$ 1.700",
            education: "ENSINO_MEDIO_COMPLETO",
            description: "Vaga para auxiliar de estoque",
            with_video: false,
            status: "PAUSED",
            updated_at: now,
            created_by: 1,
            updated_by: 1,
            selection_process_benefits: [],
            selection_process_tags: [],
            selection_process_requirements: [],
            position: { id: 4, name: "Auxiliar de Estoque" },
            user_company: {
                id: 1,
                company_id: "1",
                user_id: "1",
                user: { id: 1, name: "Empresa Teste" }
            }
        } as SelectionProcess,
    ],
    finished: [
        {
            id: 5,
            title: "Vendedor interno",
            state: "CE",
            city: "Maracanaú",
            contract_type: "CLT",
            is_pcd: false,
            created_at: now,
            profile: "OPERATIONAL",
            position_id: 5,
            work_modality: "TEMPO_INTEGRAL",
            salary_range: "R$ 1.800 - R$ 2.500",
            education: "ENSINO_MEDIO_COMPLETO",
            description: "Vaga para vendedor interno",
            with_video: false,
            status: "FINISHED",
            updated_at: now,
            created_by: 1,
            updated_by: 1,
            selection_process_benefits: [],
            selection_process_tags: [],
            selection_process_requirements: [],
            position: { id: 5, name: "Vendedor Interno" },
            user_company: {
                id: 1,
                company_id: "1",
                user_id: "1",
                user: { id: 1, name: "Empresa Teste" }
            }
        } as SelectionProcess,
    ],
}

// ===== Helpers (API real com fallback para mock) =====
async function listByStatus(): Promise<SelectionProcessesByStatus> {
    if (USE_MOCK) {
        console.log("🔄 [SelectiveProcess] Usando dados mock (USE_MOCK = true)")
        return Promise.resolve(mockData)
    }

    try {
        console.log("🔄 [SelectiveProcess] Tentando carregar dados da API...")
        const resp = await SelectionProcessService.findAllByStatus()

        // Garantir que a resposta está no formato correto e filtrar dados nulos
        const cleanedResponse = {
            open: Array.isArray(resp.open) ? resp.open.filter(item => item && item.id) : [],
            created: Array.isArray(resp.created) ? resp.created.filter(item => item && item.id) : [],
            paused: Array.isArray(resp.paused) ? resp.paused.filter(item => item && item.id) : [],
            finished: Array.isArray(resp.finished) ? resp.finished.filter(item => item && item.id) : []
        }

        console.log("✅ [SelectiveProcess] Dados carregados da API com sucesso")
        return cleanedResponse
    } catch (error) {
        console.warn("⚠️ [SelectiveProcess] Erro na API, usando fallback para mock:", error)
        return mockData // Fallback para mock em caso de erro
    }
} export default function SelectiveProcesses() {
    const toast = useToast()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SelectionProcessesByStatus>({ open: [], created: [], paused: [], finished: [] })
    const [activeTab, setActiveTab] = useState(0)
    const hasInitialized = useRef(false)

    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")
    // debounce
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 250)
        return () => clearTimeout(t)
    }, [searchInput])

    const fetchAll = useCallback(async () => {
        if (hasInitialized.current) return
        hasInitialized.current = true

        try {
            setLoading(true)
            console.log("🔄 Iniciando requisição de processos seletivos...")
            const res = await listByStatus() // Esta função já tem fallback para mock
            setData(res)
            console.log("✅ Processos carregados com sucesso")
        } catch (error: any) {
            console.error("❌ Erro crítico ao carregar processos:", error)

            // Log detalhado do erro para debug
            if (error?.response) {
                console.error("📋 Detalhes do erro de resposta:", {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data,
                    headers: error.response.headers
                })
            }

            // Verifica se é erro de autenticação ou permissão
            const isAuthError = error?.response?.status === 401 || error?.response?.status === 403
            const is500Error = error?.response?.status === 500

            let errorMessage = "Verifique sua conexão e tente novamente"
            let title = "Erro ao carregar processos"

            if (is500Error) {
                errorMessage = "Erro interno do servidor. Usando dados de exemplo temporariamente."
                title = "Servidor temporariamente indisponível"
            } else if (isAuthError) {
                title = "Erro de permissão"
                errorMessage = error?.response?.data?.message || "Você não tem permissão para acessar estes dados"
            }

            toast({
                title,
                description: errorMessage,
                status: is500Error ? "warning" : "error",
                duration: 5000,
                isClosable: true,
            })

            // Em caso de erro 500, usa dados mock como fallback
            if (is500Error) {
                console.log("🔄 Usando dados mock como fallback para erro 500...")
                setData(mockData)
            } else {
                // Para outros erros, mantém dados vazios
                setData({ open: [], created: [], paused: [], finished: [] })
            }
        } finally {
            setLoading(false)
        }
    }, [])    // Reset function para permitir reload manual se necessário
    // const resetAndFetch = useCallback(() => {
    //     hasInitialized.current = false
    //     void fetchAll()
    // }, [fetchAll])

    useEffect(() => {
        void fetchAll()
    }, [])

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
        const validList = currentList.filter(v => v && v.id) // Remove dados nulos
        if (!term) return validList
        return validList.filter((v) =>
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
                        <HStack>
                            {USE_MOCK && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    bg="primary"
                                    color="white"
                                    _hover={{ bg: "primary.600" }}
                                    onClick={async () => {
                                        console.log("🧪 [Debug] Testando API diretamente...")
                                        try {
                                            const result = await SelectionProcessService.findAllByStatus()
                                            console.log("✅ [Debug] API funcionando:", result)
                                            toast({
                                                title: "API funcionando!",
                                                description: "Dados carregados com sucesso da API",
                                                status: "success"
                                            })
                                        } catch (error) {
                                            console.error("❌ [Debug] API com erro:", error)
                                            toast({
                                                title: "API com erro",
                                                description: "Verifique o console para detalhes",
                                                status: "error"
                                            })
                                        }
                                    }}
                                >
                                    🧪 Testar API
                                </Button>
                            )}
                            <Button 
                                onClick={() => navigate("/empresa/processo-seletivo/novo")} 
                                bg="success" 
                                color="white" 
                                _hover={{ bg: "success.600" }}
                            >
                                Novo processo
                            </Button>
                        </HStack>
                    </Flex>

                    {USE_MOCK && (
                        <Flex mt={4} p={3} bg="warning.50" borderWidth={1} borderColor="warning.200" borderRadius="md">
                            <Text fontSize="sm" color="warning.700">
                                ⚠️ <strong>Modo desenvolvimento:</strong> Exibindo dados de exemplo devido a erro 500 no servidor.
                                Use o botão "🧪 Testar API" para verificar se o servidor está funcionando.
                            </Text>
                        </Flex>
                    )}

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
                                        <Loader
                                            message="Carregando processos seletivos..."
                                            minHeight="200px"
                                        />
                                    ) : list.length === 0 ? (
                                        <NoDataFound
                                            context={search.trim() ? "search" : "create"}
                                            title={search.trim() ? "Nenhum processo encontrado" : "Nenhum processo seletivo"}
                                            description={
                                                search.trim()
                                                    ? "Tente ajustar o termo de busca ou limpar os filtros."
                                                    : "Crie seu primeiro processo seletivo para começar a recrutar."
                                            }
                                            onActionClick={() => navigate("/company/selective-process/create")}
                                            actionButtonText="Criar processo"
                                        />
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                                            {filtered
                                                .filter((vaga) => vaga && vaga.id) // Filtra dados nulos/inválidos
                                                .map((vaga) => (
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
