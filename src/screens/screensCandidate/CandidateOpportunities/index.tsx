import { useEffect, useMemo, useState } from "react";
import {
    Alert, AlertIcon, Badge, Box, Button, ButtonGroup, Card, CardBody, CardHeader,
    HStack, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement,
    SimpleGrid, Stack, Stat, StatHelpText, StatLabel, StatNumber, Text,
    useColorModeValue, useToast, Skeleton, SkeletonText, Divider
} from "@chakra-ui/react";
import { RefreshCw, Search } from "lucide-react";
import RegistrationsService from "@/services/RegistrationsService";
import { toastTemplate } from "@/templates/toast";
import type { Registration } from "@/types/registrations.types";
import Layout from "@/Layout";
import Content from "@/components/UI/Content";
import { OpportunitieViewCard } from "./OpportunitieViewCard";
import SearchBar from "@/components/UI/SearchBar";

export const MOCK_REGISTRATIONS: Registration[] = [
    { id: 101, title: "Desenvolvedor Frontend React", companyName: "Tech Solutions", status: "EM ANÁLISE" },
    { id: 102, title: "Estágio em Suporte TI", companyName: "Dr. Estágio", status: "ENTREVISTA AGENDADA" },
    { id: 103, title: "UX/UI Designer Júnior", companyName: "Pixel&Co", status: "TESTE TÉCNICO" },
    { id: 104, title: "Back-end Node.js Pleno", companyName: "InovaBank", status: "APROVADO" },
    { id: 105, title: "QA Analyst", companyName: "QualityLab", status: "DECLINADO" },
    { id: 106, title: "Product Owner", companyName: "Startify", status: "EM ANÁLISE" },
    { id: 107, title: "Data Analyst", companyName: "Insight Data", status: "ENTREVISTA AGENDADA" },
    { id: 108, title: "Estágio Full Stack", companyName: "Great Talents", status: "TESTE TÉCNICO" },
];

type View = "ALL" | "ACTIVE" | "APPROVED" | "DECLINED";

const statusKey = (s?: string) =>
    (s || "")
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

// Normaliza qualquer retorno do service para um array de Registration
const normalizeRegistrations = (raw: any): Registration[] => {
    if (Array.isArray(raw)) return raw as Registration[];
    if (raw?.data && Array.isArray(raw.data)) return raw.data as Registration[];
    if (raw?.results && Array.isArray(raw.results)) return raw.results as Registration[];
    // último recurso: se vier objeto com chaves numéricas
    if (raw && typeof raw === "object") {
        const vals = Object.values(raw);
        if (vals.length && vals.every(v => typeof v === "object")) return vals as Registration[];
    }
    return [];
};

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "1";
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function CandidateOpportunities() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [query, setQuery] = useState("");
    const [view, setView] = useState<View>("ALL");

    const load = async () => {
        try {
            setLoading(true);

            if (USE_MOCK) {
                await delay(300);
                setRegistrations(MOCK_REGISTRATIONS);
                return;
            }

            const raw = await RegistrationsService.findAll();
            const normalized = normalizeRegistrations(raw);

            if (normalized.length > 0) {
                setRegistrations(normalized);
            } else {
                setRegistrations(MOCK_REGISTRATIONS);
                toast(
                    toastTemplate({
                        status: "warning",
                        description: "API sem dados ou formato inesperado. Exibindo dados de exemplo.",
                    })
                );
            }
        } catch {
            setRegistrations(MOCK_REGISTRATIONS);
            toast(
                toastTemplate({
                    status: "error",
                    description: "Erro ao buscar suas vagas. Exibindo dados de exemplo.",
                })
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // sempre garanta array
    const list: Registration[] = Array.isArray(registrations) ? registrations : [];

    // estatísticas
    const stats = useMemo(() => {
        const total = list.length;
        const approved = list.filter(r => statusKey(r.status).includes("APROVADO")).length;
        const declined = list.filter(r => statusKey(r.status).includes("DECLINADO")).length;
        const active = total - approved - declined;
        return { total, active, approved, declined };
    }, [list]);

    // filtro por aba + busca
    const filtered = useMemo(() => {
        const byView = list.filter((r) => {
            const k = statusKey(r.status);
            switch (view) {
                case "ACTIVE": return !(k.includes("APROVADO") || k.includes("DECLINADO"));
                case "APPROVED": return k.includes("APROVADO");
                case "DECLINED": return k.includes("DECLINADO");
                default: return true;
            }
        });
        if (!query.trim()) return byView;
        const q = query.trim().toLowerCase();
        return byView.filter(r =>
            r.title?.toLowerCase().includes(q) ||
            r.companyName?.toLowerCase().includes(q) ||
            r.status?.toLowerCase().includes(q)
        );
    }, [list, query, view]);

    const surf = useColorModeValue("surface", "surface");
    const border = useColorModeValue("stone.200", "stone.800");

    return (
        <Layout>
            <Content>

                <CardHeader mb={4} pb={2}>
                    <HStack justify="space-between" align="center">
                        <Heading size="lg">Minhas vagas</Heading>
                    </HStack>
                </CardHeader>

                <CardBody pt={0}>
                    {/* Estatísticas */}
                    <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={4}>
                        <Stat borderWidth="1px" borderColor={border} rounded="md" p={3} bg={surf}>
                            <StatLabel>Total</StatLabel>
                            <StatNumber>{stats.total}</StatNumber>
                            <StatHelpText>todas candidaturas</StatHelpText>
                        </Stat>
                        <Stat borderWidth="1px" borderColor={border} rounded="md" p={3} bg={surf}>
                            <StatLabel>Ativas</StatLabel>
                            <StatNumber>{stats.active}</StatNumber>
                            <StatHelpText>em processo</StatHelpText>
                        </Stat>
                        <Stat borderWidth="1px" borderColor={border} rounded="md" p={3} bg={surf}>
                            <StatLabel>Aprovadas</StatLabel>
                            <StatNumber color="green.500">{stats.approved}</StatNumber>
                            <StatHelpText>finalizadas</StatHelpText>
                        </Stat>
                        <Stat borderWidth="1px" borderColor={border} rounded="md" p={3} bg={surf}>
                            <StatLabel>Removidas</StatLabel>
                            <StatNumber color="red.500">{stats.declined}</StatNumber>
                            <StatHelpText>ou recusadas</StatHelpText>
                        </Stat>
                    </SimpleGrid>

                    {/* Filtros */}
                    <Stack direction={{ base: "column", md: "row" }} gap={3} align="center" mb={2}>
                        <SearchBar
                            placeholder="Buscar por título, empresa ou status…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <ButtonGroup display="flex" size="sm" isAttached>
                            <Button variant={view === "ALL" ? "solid" : "outline"} onClick={() => setView("ALL")}>Todas</Button>
                            <Button variant={view === "ACTIVE" ? "solid" : "outline"} onClick={() => setView("ACTIVE")}>Ativas</Button>
                            <Button variant={view === "APPROVED" ? "solid" : "outline"} onClick={() => setView("APPROVED")}>Aprovadas</Button>
                            <Button variant={view === "DECLINED" ? "solid" : "outline"} onClick={() => setView("DECLINED")}>Removidas</Button>
                        </ButtonGroup>
                    </Stack>

                    <Divider my={3} />

                    {/* Lista / estados */}
                    {loading ? (
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Box key={i} borderWidth="1px" borderColor={border} rounded="lg" p={4}>
                                    <Skeleton height="18px" w="60%" />
                                    <Skeleton height="16px" mt={2} w="40%" />
                                    <SkeletonText mt={4} noOfLines={3} spacing="3" />
                                    <HStack mt={4} spacing={3}>
                                        <Skeleton height="36px" w="110px" />
                                        <Skeleton height="36px" w="100px" />
                                    </HStack>
                                </Box>
                            ))}
                        </SimpleGrid>
                    ) : filtered.length ? (
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                            {filtered.map((reg) => (
                                <OpportunitieViewCard key={reg.id} registration={reg} onChanged={load} />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Stack align="center" textAlign="center" spacing={2}>
                            <Heading size="md">Nada por aqui…</Heading>
                            <Text color="muted">
                                {query
                                    ? "Nenhuma candidatura corresponde à sua busca."
                                    : "Você ainda não se registrou em nenhuma vaga."}
                            </Text>
                        </Stack>
                    )}
                </CardBody>
            </Content>
        </Layout>
    );
}
