import React from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    IconButton,
    Select,
    SimpleGrid,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    useColorModeValue,
    useToken,
} from "@chakra-ui/react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Briefcase,
    CheckCircle2,
    Clock3,
    Users2,
    Rocket,
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RTooltip,
    Legend as RLegend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import Layout from "@/Layout";

// ========================================================
// Pequeno tema para os gráficos (usa tokens do Chakra)
// ========================================================
function useChartTokens() {
    const [brand600, brand300, blue500, gray300, gray500, gray700] = useToken(
        "colors",
        ["brand.600", "brand.300", "secondary.500", "stone.300", "stone.500", "stone.700"]
    );
    const grid = useColorModeValue(gray300, gray700);
    const tick = useColorModeValue(gray500, gray300);
    const bg = useColorModeValue("white", "stone.900");
    const card = useColorModeValue("surface", "surface");
    return {
        brand600,
        brand300,
        blue500,
        grid,
        tick,
        bg,
        card,
    } as const;
}

// ========================================================
// Componentes base
// ========================================================
const ChartCard: React.FC<{
    title: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}> = ({ title, actions, children }) => {
    return (
        <Card bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl">
            <CardHeader pb={2}>
                <HStack justify="space-between" align="center">
                    <Heading as="h3" size="md">{title}</Heading>
                    {actions}
                </HStack>
            </CardHeader>
            <CardBody pt={0}>{children}</CardBody>
        </Card>
    );
};

const KPI: React.FC<{
    icon: React.ElementType;
    label: string;
    value: string | number;
    delta?: number;
}> = ({ icon, label, value, delta }) => {
    const isUp = (delta ?? 0) >= 0;
    const DeltaIcon = isUp ? ArrowUpRight : ArrowDownRight;
    const deltaColor = isUp ? "green.400" : "red.400";

    return (
        <Card bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl">
            <CardBody>
                <HStack align="center" justify="space-between">
                    <HStack spacing={3}>
                        <Icon as={icon} boxSize={6} color="brand.600" _dark={{ color: "brand.300" }} />
                        <Stat>
                            <StatLabel color="muted">{label}</StatLabel>
                            <StatNumber fontSize="2xl">{value}</StatNumber>
                            {delta !== undefined && (
                                <StatHelpText m={0} color={deltaColor} display="flex" alignItems="center" gap={1}>
                                    <Icon as={DeltaIcon} boxSize={4} />
                                    {Math.abs(delta)}%
                                </StatHelpText>
                            )}
                        </Stat>
                    </HStack>
                </HStack>
            </CardBody>
        </Card>
    );
};

// ========================================================
// Dados mockados (Great Talents)
// ========================================================
const weeklyApplications = [
    { w: "W1", applied: 42, qualified: 18 },
    { w: "W2", applied: 55, qualified: 22 },
    { w: "W3", applied: 61, qualified: 27 },
    { w: "W4", applied: 49, qualified: 20 },
    { w: "W5", applied: 70, qualified: 30 },
    { w: "W6", applied: 65, qualified: 31 },
];

const pipeline = [
    { stage: "Candidaturas", value: 320 },
    { stage: "Triagem", value: 210 },
    { stage: "Entrevistas", value: 130 },
    { stage: "Propostas", value: 36 },
    { stage: "Contratados", value: 18 },
];

const sources = [
    { name: "Orgânico", value: 42 },
    { name: "Indicação", value: 25 },
    { name: "Social", value: 19 },
    { name: "Universidades", value: 14 },
];

const openJobs = [
    { title: "Estágio em Front-end", applicants: 58, qualified: 21, status: "Triagem" },
    { title: "Analista de Dados Jr.", applicants: 34, qualified: 11, status: "Entrevistas" },
    { title: "Estágio Administrativo", applicants: 27, qualified: 9, status: "Candidaturas" },
    { title: "Designer Jr.", applicants: 45, qualified: 16, status: "Triagem" },
];

// ========================================================
// Tooltips customizados
// ========================================================
const TooltipBox: React.FC<{ title?: string; rows: { label: string; value: string | number; color?: string }[] }>
    = ({ title, rows }) => {
        const bg = useColorModeValue("stone.900", "stone.100");
        const color = useColorModeValue("stone.50", "stone.900");
        return (
            <Box bg={bg} color={color} p={3} borderRadius="md" boxShadow="md">
                {title && <Text fontWeight={700} mb={1}>{title}</Text>}
                <Stack spacing={1}>
                    {rows.map((r) => (
                        <HStack key={r.label} justify="space-between" gap={8}>
                            <HStack>
                                {r.color && <Box w="10px" h="10px" borderRadius="full" bg={r.color} />}
                                <Text fontSize="sm">{r.label}</Text>
                            </HStack>
                            <Text fontSize="sm" fontWeight={600}>{r.value}</Text>
                        </HStack>
                    ))}
                </Stack>
            </Box>
        );
    };

// ========================================================
// Gráficos
// ========================================================
const ApplicationsAreaChart: React.FC = () => {
    const t = useChartTokens();
    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyApplications} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id="applied" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.brand600} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={t.brand600} stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="qualified" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={t.blue500} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={t.blue500} stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <CartesianGrid stroke={t.grid} strokeDasharray="3 3" />
                <XAxis dataKey="w" tick={{ fill: t.tick }} axisLine={{ stroke: t.grid }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: t.tick }} axisLine={{ stroke: t.grid }} tickLine={false} />
                <RTooltip
                    content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const rows = [
                            { label: "Candidaturas", value: payload[0].payload.applied, color: t.brand600 },
                            { label: "Qualificados", value: payload[0].payload.qualified, color: t.blue500 },
                        ];
                        return <TooltipBox title={`Semana ${label}`} rows={rows} />;
                    }}
                />
                <Area type="monotone" dataKey="applied" name="Candidaturas" stroke={t.brand600} fill="url(#applied)" strokeWidth={2} />
                <Area type="monotone" dataKey="qualified" name="Qualificados" stroke={t.blue500} fill="url(#qualified)" strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

const PipelineFunnelChart: React.FC = () => {
    const t = useChartTokens();
    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipeline} layout="vertical" margin={{ left: 4, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke={t.grid} horizontal={false} />
                <XAxis type="number" tick={{ fill: t.tick }} axisLine={{ stroke: t.grid }} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fill: t.tick }} axisLine={{ stroke: t.grid }} tickLine={false} width={110} />
                <RTooltip
                    content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const { stage, value } = payload[0].payload as any;
                        return <TooltipBox rows={[{ label: stage, value }]} />;
                    }}
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                    {pipeline.map((_, i) => (
                        <Cell key={i} fill={i === pipeline.length - 1 ? t.blue500 : t.brand600} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const SourcesDonutChart: React.FC = () => {
    const t = useChartTokens();
    const palette = [t.brand600, t.blue500, t.brand300, "#A78BFA"];

    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <RTooltip
                    content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const p = payload[0].payload as any;
                        return <TooltipBox rows={[{ label: p.name, value: `${p.value}%` }]} />;
                    }}
                />
                <Pie
                    data={sources}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                >
                    {sources.map((_, i) => (
                        <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

// ========================================================
// Página principal — Dashboard da Empresa
// ========================================================
const CompanyDashboard: React.FC = () => {
    return (
        <Layout>
            <Box px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }}>
                {/* Header */}
                <Flex justify="space-between" align={{ base: "stretch", md: "center" }} direction={{ base: "column", md: "row" }} gap={4} mb={4}>
                    <Box>
                        <Heading size="lg">Visão Geral • Empresa</Heading>
                        <Text color="muted">Acompanhe seus processos seletivos dentro do Great Talents.</Text>
                    </Box>
                    <HStack>
                        <Select size="sm" defaultValue="30d" w="auto">
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                            <option value="ytd">Ano atual</option>
                        </Select>
                        <Button size="sm" variant="outline">Exportar</Button>
                    </HStack>
                </Flex>

                {/* KPIs */}
                <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={4} mb={6}>
                    <KPI icon={Briefcase} label="Vagas Abertas" value={12} delta={8} />
                    <KPI icon={Users2} label="Candidaturas" value={320} delta={5} />
                    <KPI icon={CheckCircle2} label="Qualificados" value={126} delta={12} />
                    <KPI icon={Clock3} label="Tempo Médio p/ Contratar" value={"18d"} delta={-6} />
                </SimpleGrid>

                {/* Charts grid */}
                <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap={6}>
                    <GridItem>
                        <ChartCard title="Candidaturas x Qualificados (semanal)">
                            <ApplicationsAreaChart />
                        </ChartCard>
                    </GridItem>
                    <GridItem>
                        <ChartCard title="Origem das Candidaturas">
                            <SourcesDonutChart />
                        </ChartCard>
                    </GridItem>
                </Grid>

                <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6} mt={6}>
                    <GridItem>
                        <ChartCard title="Funil do Processo Seletivo">
                            <PipelineFunnelChart />
                        </ChartCard>
                    </GridItem>

                    <GridItem>
                        <Card bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl">
                            <CardHeader pb={2}>
                                <Heading as="h3" size="md">Vagas Abertas</Heading>
                            </CardHeader>
                            <CardBody pt={0}>
                                <Table size="sm" variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Título</Th>
                                            <Th isNumeric>Aplicações</Th>
                                            <Th isNumeric>Qualificados</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {openJobs.map((j) => (
                                            <Tr key={j.title}>
                                                <Td>{j.title}</Td>
                                                <Td isNumeric>{j.applicants}</Td>
                                                <Td isNumeric>{j.qualified}</Td>
                                                <Td>{j.status}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </GridItem>
                </Grid>

                <Box mt={10}>
                    <Divider mb={3} />
                    <Text color="muted" fontSize="sm">
                        * Em breve: aba com gráficos do <b>Super Vagas</b> (via API) lado a lado com os do Great Talents.
                    </Text>
                </Box>
            </Box>
        </Layout>
    );
};

export default CompanyDashboard;
