// src/pages/admin/candidates/CandidatesList.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    Card,
    CardBody,
    CardHeader,
    Container,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    SimpleGrid,
    Skeleton,
    Text,
    Tooltip,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react"
import { RepeatIcon } from "@chakra-ui/icons"
import Layout from "@/Layout"
import type { CandidateDTO } from "./components/CandidateCard"
import SearchBar from "@/components/UI/SearchBar"
import CandidateCard from "./components/CandidateCard"
import Content from "@/components/UI/Content"

// ========= toggle de mock =========
const USE_MOCK = true

// ========= mock =========
const mockCandidates: CandidateDTO[] = [
    {
        id: 1, name: "Ana Clara Nogueira", email: "ana@example.com", cpf: "000.000.000-00",
        contact: "(85) 98888-7777", date_birth: "1996-03-12", genre: "F", cep: "60000-000",
        city: "Fortaleza", neighborhood: "Meireles", number: "200", street: "Rua das Flores", state: "CE",
        file: { id: 101, url: "https://i.pravatar.cc/120?img=5" },
    },
    {
        id: 2, name: "João Pedro Lima", email: "joao@example.com", cpf: "111.111.111-11",
        contact: "(85) 97777-6666", date_birth: "1994-08-01", genre: "M", cep: "59000-000",
        city: "Natal", neighborhood: "Tirol", number: "500", street: "Av. Central", state: "RN",
        file: { id: 102, url: "https://i.pravatar.cc/120?img=12" },
    },
    {
        id: 3, name: "Beatriz Souza", email: "bia@example.com", cpf: "222.222.222-22",
        contact: "(81) 96666-5555", date_birth: "1999-11-23", genre: "F", cep: "52000-000",
        city: "Recife", neighborhood: "Boa Viagem", number: "999", street: "Rua Praia", state: "PE",
        file: { id: 103, url: "https://i.pravatar.cc/120?img=47" },
    },
    {
        id: 4, name: "Carlos Eduardo", email: "cadu@example.com", cpf: "333.333.333-33",
        contact: "(85) 95555-4444", date_birth: "1992-01-15", genre: "M", cep: "60100-000",
        city: "Fortaleza", neighborhood: "Aldeota", number: "45", street: "Rua Norte", state: "CE",
        file: { id: 104, url: "https://i.pravatar.cc/120?img=23" },
    },
    {
        id: 5, name: "Marina Alves", email: "marina@example.com", cpf: "444.444.444-44",
        contact: "(83) 94444-3333", date_birth: "1998-06-30", genre: "F", cep: "58000-000",
        city: "João Pessoa", neighborhood: "Manaíra", number: "123", street: "Av. Atlântica", state: "PB",
        file: { id: 105, url: "https://i.pravatar.cc/120?img=32" },
    },
]

// ========= helpers =========
async function listCandidates(): Promise<CandidateDTO[]> {
    if (USE_MOCK) return Promise.resolve([...mockCandidates])
    // const resp = await CandidateService.findAll()
    // return resp as CandidateDTO[]
    return []
}

// normaliza texto (sem acento/espacos extras)
function normalize(str: string) {
    return (str || "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim()
}

export default function CandidatesList() {
    const toast = useToast()
    const cardBg = useColorModeValue("surface", "surface")
    const border = useColorModeValue("border", "border")
    const rowSkeletons = 10

    const [items, setItems] = useState<CandidateDTO[]>([])
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
            const data = await listCandidates()
            setItems(data)
        } catch {
            toast({ title: "Erro ao carregar candidatos", status: "error" })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => { void fetchAll() }, [fetchAll])

    const filtered = useMemo(() => {
        const term = normalize(search)
        if (!term) return items
        return items.filter((c) =>
            [c.name, c.city, c.state]
                .filter(Boolean)
                .map((v) => normalize(String(v)))
                .some((v) => v.includes(term))
        )
    }, [items, search])

    return (
        <Layout>
            <Content
            >
                <CardHeader pb={2}>
                    <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                        <Heading size="lg" >Candidatos</Heading>
                    </Flex>

                    {/* busca */}
                    <HStack mt={6}>
                        <SearchBar
                            placeholder="Pesquisar por nome, cidade ou estado"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </HStack>
                </CardHeader>
                <Divider mb={2} />

                <CardBody>
                    {loading ? (
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={6}>
                            {Array.from({ length: rowSkeletons }).map((_, i) => (
                                <Skeleton key={i} height="110px" borderRadius="2xl" />
                            ))}
                        </SimpleGrid>
                    ) : filtered.length === 0 ? (
                        <Flex py={10} direction="column" align="center" gap={2} color="muted">
                            <Heading size="sm">Nenhum candidato encontrado</Heading>
                            <Text fontSize="sm">Tente ajustar a busca.</Text>
                        </Flex>
                    ) : (
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} gap={6}>
                            {filtered.map((c) => (
                                <CandidateCard key={c.id} candidate={c} />
                            ))}
                        </SimpleGrid>
                    )}
                </CardBody>
            </Content>
        </Layout>
    )
}
