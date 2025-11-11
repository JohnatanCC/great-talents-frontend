import {
    Box,
    CardBody,
    CardHeader,
    Heading,
    SimpleGrid,
    Stack,
    Text,
    Flex,
    Badge,
    useColorModeValue,
    Spinner,
    HStack,
    IconButton,
    Switch,
    Tooltip,
    Card,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

// Ajuste estes imports conforme seus aliases
import Content from "@/components/UI/Content";
import SearchBar from "@/components/UI/SearchBar";
import OpportunitieCard from "@/components/UI/OpportunitieCard";
import SelectionProcessOpenService from "@/services/SelectionProcessOpenService";
import type { StateSelectionProcessOpen } from "@/types/selectionProcessOpen.types";
import { normalize } from "@/utils/normalize";
import Layout from "@/Layout";

// ===================== Helpers =====================
const safeNorm = (v: unknown) => normalize(String(v ?? ""));

function extractArrayFromService(resp: unknown): StateSelectionProcessOpen[] {
    if (Array.isArray(resp)) return resp as StateSelectionProcessOpen[];
    const anyResp = resp as any;
    if (Array.isArray(anyResp?.data)) return anyResp.data as StateSelectionProcessOpen[];
    if (Array.isArray(anyResp?.open)) return anyResp.open as StateSelectionProcessOpen[];
    if (Array.isArray(anyResp?.results)) return anyResp.results as StateSelectionProcessOpen[];
    return [];
}

const LoaderWithTimer = () => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, []);
    return (
        <Flex direction="column" align="center" justify="center" py={10} gap={3}>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="orange.500" />
            <Text color="fg.subtle" fontSize="sm">Carregando… {seconds}s</Text>
        </Flex>
    );
};

// ===================== MOCK (para layout) =====================
const USE_MOCK_WHEN_EMPTY = true; // <- coloque false em produção
const MOCK: StateSelectionProcessOpen[] = [
    {
        id: 1,
        profile: "OPERATIONAL",
        title: "Atendente de Loja",
        neighborhood: "Centro",
        show_salary: true,
        city: "Fortaleza",
        state: "CE",
        salary: "1800",
        is_pcd: false,
        company: { name: "Rede Mais", photo: "" },
    },
    {
        id: 2,
        profile: "TRAINEE",
        title: "Assistente Administrativo",
        neighborhood: "Aldeota",
        show_salary: false,
        city: "Fortaleza",
        state: "CE",
        salary: "",
        is_pcd: true,
        company: { name: "Super Show", photo: "" },
    },
    {
        id: 3,
        profile: "OPERATIONAL",
        title: "Repositor(a) de Mercadorias",
        neighborhood: "Tirol",
        show_salary: true,
        city: "Natal",
        state: "RN",
        salary: "1600",
        is_pcd: false,
        company: { name: "Uniforça", photo: "" },
    },
    {
        id: 4,
        profile: "APPRENTICE",
        title: "Aprendiz de Caixa",
        neighborhood: "Meireles",
        show_salary: true,
        city: "Fortaleza",
        state: "CE",
        salary: "R$ 900",
        is_pcd: true,
        company: { name: "Integrada", photo: "" },
    },
];

// ===================== Componente =====================
const OpportunitiesList = () => {
    const [data, setData] = useState<StateSelectionProcessOpen[] | unknown>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [onlyPCD, setOnlyPCD] = useState(false);
    const [withSalary, setWithSalary] = useState(false);

    const chipBg = useColorModeValue("gray.50", "whiteAlpha.100");
    const chipBorder = useColorModeValue("gray.200", "whiteAlpha.200");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await SelectionProcessOpenService.getSelectionProcessOpen();
            const arr = extractArrayFromService(response);
            if (arr.length === 0 && USE_MOCK_WHEN_EMPTY) setData(MOCK);
            else setData(arr);
        } catch (e) {
            console.error("Erro ao carregar vagas:", e);
            setData(USE_MOCK_WHEN_EMPTY ? MOCK : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sempre um array para operar
    const list: StateSelectionProcessOpen[] = useMemo(
        () => (Array.isArray(data) ? data : []),
        [data]
    );

    // Índice normalizado para busca mais rápida e limpa
    const indexed = useMemo(() =>
        list.map((v) => ({
            raw: v,
            norm: {
                empresa: safeNorm(v?.company?.name),
                titulo: safeNorm(v?.title),
                bairro: safeNorm(v?.neighborhood),
                cidade: safeNorm(v?.city),
                estado: safeNorm(v?.state),
                salario: safeNorm(v?.salary),
                perfil: safeNorm(v?.profile),
            },
            haystack: [
                v?.company?.name,
                v?.title,
                v?.neighborhood,
                v?.city,
                v?.state,
                v?.salary,
                v?.profile,
            ].map(safeNorm).join(" | "),
        })),
        [list]);

    // Busca tokenizada com qualificadores
    const tokens = useMemo(() => safeNorm(search).split(/\s+/).filter(Boolean), [search]);

    const filtered = useMemo(() => {
        if (indexed.length === 0) return [] as StateSelectionProcessOpen[];

        const matchByTokens = (it: typeof indexed[number]) => {
            if (tokens.length === 0) return true;
            // cada token precisa estar presente em algum campo
            return tokens.every((t) => {
                if (t === "pcd") return !!it.raw.is_pcd; // token especial
                // qualificadores
                if (t.startsWith("empresa:")) return it.norm.empresa.includes(t.slice(8));
                if (t.startsWith("cidade:")) return it.norm.cidade.includes(t.slice(7));
                if (t.startsWith("estado:")) return it.norm.estado.includes(t.slice(7));
                if (t.startsWith("bairro:")) return it.norm.bairro.includes(t.slice(7));
                if (t.startsWith("perfil:")) return it.norm.perfil.includes(t.slice(7));
                // genérico (cai no haystack)
                return it.haystack.includes(t);
            });
        };

        const base = indexed
            .filter((it) => matchByTokens(it))
            .map((it) => it.raw)
            .filter((vaga) => (onlyPCD ? !!vaga.is_pcd : true))
            .filter((vaga) => (withSalary ? !!vaga.show_salary : true));

        // ordena por cidade -> título -> empresa
        return base.sort((a, b) => {
            const c = safeNorm(a.city).localeCompare(safeNorm(b.city));
            if (c !== 0) return c;
            const t = safeNorm(a.title).localeCompare(safeNorm(b.title));
            if (t !== 0) return t;
            return safeNorm(a.company?.name).localeCompare(safeNorm(b.company?.name));
        });
    }, [indexed, tokens, onlyPCD, withSalary]);

    const total = filtered.length;

    return (
        <Layout>
            <Content>
                <CardHeader pb={0}>
                    <Heading size="lg" as="h1">
                        Vagas disponíveis
                    </Heading>
                    <Text color="muted" mt={2}>
                        Encontre a oportunidade que combina com você
                    </Text>
                </CardHeader>

                <CardBody>
                    {/* Busca + filtros rápidos */}
                    <Stack display="flex" direction="column" spacing={3} align="start">
                        <SearchBar
                            aria-label="Buscar vagas"
                            placeholder="Busque por empresa, cargo, bairro ou cidade (ex.: empresa:uniforça cidade:fortaleza pcd)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <HStack h="full" spacing={2} justify={{ base: "space-between", md: "flex-end" }}>
                            <Tooltip label="Exibir apenas vagas PCD">
                                <HStack h="full" px={3} py={2} borderRadius="md" bg={chipBg} borderWidth={1} borderColor={chipBorder} gap={2}>
                                    <Text fontSize="sm">PCD</Text>
                                    <Switch size="sm" isChecked={onlyPCD} onChange={(e) => setOnlyPCD(e.target.checked)} />
                                </HStack>
                            </Tooltip>

                            <Tooltip label="Exibir somente vagas com salário visível">
                                <HStack h="full" px={3} py={2} borderRadius="md" bg={chipBg} borderWidth={1} borderColor={chipBorder} gap={2}>
                                    <Text fontSize="sm">Com salário</Text>
                                    <Switch size="sm" isChecked={withSalary} onChange={(e) => setWithSalary(e.target.checked)} />
                                </HStack>
                            </Tooltip>
                        </HStack>
                    </Stack>

                    {/* Contagem total */}
                    <Flex mt={4} mb={6} align="center" gap={2} wrap="wrap">
                        <Heading as="h5" size="sm" color="fg.muted">
                            Total de vagas:
                        </Heading>
                        <Badge px={2} py={1} colorScheme="orange" borderRadius="md" fontWeight="semibold">
                            {loading ? "…" : total}
                        </Badge>
                        {onlyPCD && <Badge variant="subtle" colorScheme="blue">Filtrando: PCD</Badge>}
                        {withSalary && <Badge variant="subtle" colorScheme="green">Com salário</Badge>}
                    </Flex>

                    {loading ? (
                        <LoaderWithTimer />
                    ) : total > 0 ? (
                        <SimpleGrid gap={4} columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} alignItems="stretch">
                            {filtered.map((vaga) => (
                                <OpportunitieCard key={vaga.id} vaga={vaga} />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Box textAlign="center" mt={8} color="fg.subtle">
                            <Text fontSize="lg" fontWeight="medium">Nenhuma vaga encontrada</Text>
                            <Text fontSize="sm">Tente outra busca, remova filtros ou volte mais tarde.</Text>
                        </Box>
                    )}
                </CardBody>
            </Content>
        </Layout>
    );
};

export default OpportunitiesList;
