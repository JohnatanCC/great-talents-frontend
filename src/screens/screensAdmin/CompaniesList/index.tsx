import { useEffect, useMemo, useRef, useState } from "react"
import {
    Avatar,
    Badge,
    Button,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure,
    useToast,
} from "@chakra-ui/react"
import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"

import CompanyService from "@/services/CompanyService"
import { normalize } from "@/utils/normalize"
import type { Company } from "@/types/companies.types"

import SearchBar from "@/components/UI/SearchBar"
import Content from "@/components/UI/Content"



const PAGE_SIZE = 10

function toArrayResponse(resp: any): Company[] {
    if (Array.isArray(resp)) return resp
    if (Array.isArray(resp?.data)) return resp.data
    if (Array.isArray(resp?.results)) return resp.results
    return []
}

export default function CompaniesList() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [rawCompanies, setRawCompanies] = useState<Company[]>([])
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("") // debounced
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
    const [page, setPage] = useState(1)
    const [error, setError] = useState<string | null>(null)
    const toast = useToast()
    const navigate = useNavigate()

    // Debounce searchInput -> search
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 250)
        return () => clearTimeout(t)
    }, [searchInput])

    // Fetch data with retry mechanism
    const isMounted = useRef(true)
    const [retryCount, setRetryCount] = useState(0)

    const fetchCompanies = async (isRetry = false) => {
        try {
            if (!isRetry) {
                setIsLoading(true)
                setError(null)
            }

            const response = await CompanyService.findAll()

            if (isMounted.current) {
                const companies = toArrayResponse(response)
                setRawCompanies(companies)
                setError(null)
                setRetryCount(0)
                setIsLoading(false)
            }
        } catch (error) {
            if (isMounted.current) {
                const errorMessage = (error as any)?.response?.data?.message || "Erro ao obter os dados das empresas"
                setError(errorMessage)

                if (!isRetry) {
                    toast({
                        title: "Erro ao carregar empresas",
                        description: `${errorMessage}${retryCount < 2 ? ' - Você pode tentar recarregar a página.' : ''}`,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    })
                }
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        isMounted.current = true
        fetchCompanies()

        return () => {
            isMounted.current = false
        }
    }, [toast])

    // Filtering & pagination (com guardas)
    const filtered: Company[] = useMemo(() => {
        const list = Array.isArray(rawCompanies) ? rawCompanies : []
        const term = normalize(search)
        if (!term) return list
        return list.filter((c) =>
            [c.name, c.company_name, c.category?.name, c.type?.name, c.size?.name, c.cnpj, c.email]
                .filter(Boolean)
                .map((v) => normalize(String(v)))
                .some((v) => v.includes(term))
        )
    }, [rawCompanies, search])

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    useEffect(() => {
        // quando buscar/filtrar reduzir páginas, mantenha page válida
        setPage((p) => Math.min(Math.max(1, p), pages))
    }, [pages])

    useEffect(() => {
        // termo mudou -> volta p/ página 1
        setPage(1)
    }, [search])

    const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Delete flow
    const askDelete = (id: number) => {
        setSelectedCompanyId(id)
        onOpen()
    }

    const handleDeleteCompany = async () => {
        if (selectedCompanyId === null) return

        try {
            await CompanyService.delete(selectedCompanyId)
            setRawCompanies(prevCompanies =>
                prevCompanies.filter(company => company.id !== selectedCompanyId)
            )
            toast({
                title: "Empresa removida com sucesso",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
            onClose()
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.message || "Erro ao deletar empresa"
            toast({
                title: "Erro ao deletar empresa",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <Content >
            <CardHeader>
                <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                    <Heading size="lg">Empresas cadastradas</Heading>
                    <HStack>
                        <Button
                            variant="outline"
                            onClick={() => fetchCompanies()}
                            isLoading={isLoading}
                            size="sm"
                        >
                            Atualizar
                        </Button>
                        <Button colorScheme="brand" onClick={() => navigate("/admin/empresas/nova")}>Cadastrar</Button>
                    </HStack>
                </Flex>

                <Flex mt={4}>
                    <SearchBar
                        placeholder="Buscar por nome, CNPJ, e‑mail…"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </Flex>
            </CardHeader>
            <Divider />
            <CardBody>
                <TableContainer>
                    <Table size="sm">
                        <Thead position="sticky" top={0} zIndex={1}>
                            <Tr>
                                <Th>Logo</Th>
                                <Th>Nome</Th>
                                <Th>Email</Th>
                                <Th>Razão social</Th>
                                <Th>Ramo</Th>
                                <Th>Tipo</Th>
                                <Th>Tamanho</Th>
                                <Th>CNPJ</Th>
                                <Th w={24}>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {isLoading && Array.from({ length: 6 }).map((_, i) => (
                                <Tr key={`skeleton-${i}`}>
                                    {Array.from({ length: 9 }).map((__, j) => (
                                        <Td key={j}><Skeleton height="4" /></Td>
                                    ))}
                                </Tr>
                            ))}

                            {!isLoading && error && (
                                <Tr>
                                    <Td colSpan={9}>
                                        <Flex py={8} direction="column" align="center" gap={3} color="red.500">
                                            <Heading size="sm">Erro ao carregar empresas</Heading>
                                            <Text fontSize="sm" textAlign="center">{error}</Text>
                                            <Button size="sm" colorScheme="red" variant="outline" onClick={() => fetchCompanies()}>
                                                Tentar novamente
                                            </Button>
                                        </Flex>
                                    </Td>
                                </Tr>
                            )}

                            {!isLoading && !error && slice.length === 0 && (
                                <Tr>
                                    <Td colSpan={9}>
                                        <Flex py={8} direction="column" align="center" gap={2} color="muted">
                                            <Heading size="sm">Nenhuma empresa encontrada</Heading>
                                            <Text fontSize="sm">Ajuste a busca ou cadastre uma nova empresa.</Text>
                                        </Flex>
                                    </Td>
                                </Tr>
                            )}

                            {!isLoading && slice.map((company) => (
                                <Tr key={company.id}>
                                    <Td>
                                        <Avatar size="sm" src={company.file?.url} name={company.name} borderRadius="md" />
                                    </Td>
                                    <Td>{company.name}</Td>
                                    <Td>{company.email}</Td>
                                    <Td>{company.company_name}</Td>
                                    <Td>{company.category?.name}</Td>
                                    <Td>{company.type?.name}</Td>
                                    <Td>{company.size?.name}</Td>
                                    <Td><Badge variant="subtle">{company.cnpj}</Badge></Td>
                                    <Td>
                                        <HStack spacing={2}>
                                            <Tooltip label="Editar">
                                                <IconButton aria-label="Editar" size="sm" colorScheme="blue" icon={<EditIcon />} onClick={() => navigate(`/admin/empresas/${company.id}/editar`)} />
                                            </Tooltip>
                                            <Tooltip label="Excluir">
                                                <IconButton aria-label="Excluir" size="sm" colorScheme="red" icon={<DeleteIcon />} onClick={() => askDelete(company.id)} />
                                            </Tooltip>
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>

                {/* Paginação */}
                {!isLoading && Math.max(1, pages) > 1 && (
                    <HStack justify="flex-end" mt={4} spacing={2}>
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} isDisabled={page === 1}>Anterior</Button>
                        <Text fontSize="sm">Página {page} de {pages}</Text>
                        <Button size="sm" variant="outline" colorScheme="brand" onClick={() => setPage((p) => Math.min(pages, p + 1))} isDisabled={page === pages}>Próxima</Button>
                    </HStack>
                )}
            </CardBody>
            {/* Modal de confirmação */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar exclusão</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Tem certeza de que deseja excluir permanentemente esta empresa? Esta ação não pode ser desfeita.</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleDeleteCompany}>Deletar</Button>
                        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Content>

    )
}
