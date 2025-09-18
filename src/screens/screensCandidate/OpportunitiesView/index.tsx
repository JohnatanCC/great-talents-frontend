import React, { useEffect, useState } from "react";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    List,
    ListItem,
    SimpleGrid,
    Stack,
    Text,
    useToast,
    Skeleton,
    SkeletonText,
    HStack,
    Icon,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { MapPin, Briefcase, Banknote, GraduationCap, Users } from "lucide-react";

import RegistrationsService from "../../../services/RegistrationsService";
import SelectionProcessOpenService from "../../../services/SelectionProcessOpenService";
import { toastTemplate } from "../../../templates/toast";
import type { StateSelectionProcessOpenDetails } from "../../../types/selectionProcessOpen.types";
import Content from "@/components/UI/Content";
import Layout from "@/Layout";

/* ===================== MOCK para visualização ===================== */
const MOCK_SELECTION: StateSelectionProcessOpenDetails = {
    id: 999,
    title: "Desenvolvedor Front-end React (Pleno)",
    description:
        "Estamos em busca de uma pessoa desenvolvedora Front-end para atuar com React + TypeScript. Valorizamos código limpo, testes e colaboração com time de produto/design.",
    profile: "Desenvolvedor(a) com foco em UI/UX e qualidade" as any,
    contract_type: "CLT",
    education: "SUPERIOR_COMPLETO" as any,
    work_modality: "HORISTA",
    show_salary: true,
    salary_range: "R$ 7.000 — R$ 10.000",
    state: "SP",
    city: "São Paulo",
    is_pcd: true,
    position: { id: 1, name: "Desenvolvedor Front-end" },
    selection_process_benefits: [
        { id: 1, description: "Vale Refeição / Alimentação" },
        { id: 2, description: "Plano de Saúde e Odontológico" },
        { id: 3, description: "Auxílio Home Office" },
        { id: 4, description: "Horário Flexível" },
        { id: 5, description: "Bônus por Performance" },
    ],
    selection_process_requirements: [
        { id: 1, name: "React + TypeScript", required: true },
        { id: 2, name: "Testes (Jest/RTL) e boas práticas", required: true },
        { id: 3, name: "Chakra UI (ou libs de design system)", required: false },
        { id: 4, name: "Experiência com CI/CD (Vercel/GitHub Actions)", required: false },
    ],
    company: {
        name: "Great Talents",
        description:
            "Plataforma que conecta talentos a oportunidades. Trabalhamos com alto padrão de UX e dados para seleções mais justas.",
        photo: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
        neighborhood: "Bela Vista",
    },
};

/* ===================== Página ===================== */
const OpportunitiesView: React.FC = () => {
    const toast = useToast();
    const params = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [currentSelectionProcess, setCurrentSelectionProcess] =
        useState<StateSelectionProcessOpenDetails | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (params.id) {
                    const response = await SelectionProcessOpenService.findOne(params.id);
                    // fallback para mock se a API não trouxer dados
                    setCurrentSelectionProcess(response && response.title ? response : MOCK_SELECTION);
                } else {
                    setCurrentSelectionProcess(MOCK_SELECTION);
                }
            } catch {
                setCurrentSelectionProcess(MOCK_SELECTION);
            } finally {
                setLoading(false);
            }
        })();
    }, [params.id]);

    const handleRegisterSelectionProcess = async () => {
        if (!params.id) return;
        try {
            await RegistrationsService.create(params.id as string);
            toast({ title: "Candidatura realizada com sucesso", status: "success" });
        } catch (error: any) {
            if (error?.response?.data?.message) {
                toast(
                    toastTemplate({
                        status: "info",
                        title: error.response.data.message,
                    }),
                );
            } else {
                toast(
                    toastTemplate({
                        status: "error",
                        title: "Não foi possível realizar sua candidatura.",
                    }),
                );
            }
        }
    };

    const job = currentSelectionProcess;

    return (
        <Layout>
            <Content>
                <Card variant="unstyled">
                    {/* HEADER */}
                    <CardHeader
                        display="flex"
                        flexDir={{ base: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ base: "start", md: "center" }}
                        gap={3}
                    >
                        <Box>
                            <Heading size="lg">
                                {loading ? <Skeleton w="320px" h="28px" /> : job?.title}
                            </Heading>
                            <HStack spacing={2} mt={2} flexWrap="wrap">
                                {loading ? (
                                    <>
                                        <Skeleton w="120px" h="22px" />
                                        <Skeleton w="120px" h="22px" />
                                    </>
                                ) : (
                                    <>
                                        {job?.position?.name && (
                                            <Badge colorScheme="secondary" variant="subtle">{job.position.name}</Badge>
                                        )}
                                        {job?.contract_type && (
                                            <Badge colorScheme="brand" variant="subtle">{job.contract_type}</Badge>
                                        )}
                                        {job?.work_modality && <Badge variant="subtle">{job.work_modality}</Badge>}
                                        {job?.salary_range && (
                                            <Badge variant="subtle" title="Faixa salarial">
                                                {job.salary_range}
                                            </Badge>
                                        )}
                                        {job?.is_pcd && (
                                            <Badge colorScheme="brand" variant="subtle">Vaga para PCD</Badge>
                                        )}
                                    </>
                                )}
                            </HStack>
                        </Box>

                        <Button colorScheme="green" onClick={handleRegisterSelectionProcess} isDisabled={loading}>
                            Candidate-se
                        </Button>
                    </CardHeader>

                    <Divider my={4} borderColor="border" />

                    {/* BODY */}
                    <CardBody>
                        {/* SOBRE */}
                        <Card variant="unstyled">
                            <CardHeader pb={2}>
                                <Heading size="md">Sobre a vaga</Heading>
                            </CardHeader>
                            <CardBody pt={0}>
                                {loading ? (
                                    <SkeletonText noOfLines={4} spacing="3" />
                                ) : (
                                    <Text lineHeight="1.8">{job?.description}</Text>
                                )}
                            </CardBody>
                        </Card>

                        {/* GRID DE INFORMACOES / BENEFICIOS / REQUISITOS */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={4}>
                            {/* Informações gerais */}
                            <Card size="sm" variant="outline">
                                <CardHeader pb={2}>
                                    <Heading size="md">Informações gerais</Heading>
                                </CardHeader>
                                <CardBody pt={0}>
                                    {loading ? (
                                        <Stack>
                                            <Skeleton h="18px" w="60%" />
                                            <Skeleton h="18px" w="50%" />
                                            <Skeleton h="18px" w="70%" />
                                            <Skeleton h="18px" w="40%" />
                                        </Stack>
                                    ) : (
                                        <List spacing={2}>
                                            <ListItem>
                                                <HStack align="start" spacing={2}>
                                                    <Icon as={Briefcase} boxSize={4} />
                                                    <Text><Text as="span" fontWeight="semibold">Perfil:</Text> {job?.profile || "—"}</Text>
                                                </HStack>
                                            </ListItem>
                                            <ListItem>
                                                <HStack align="start" spacing={2}>
                                                    <Icon as={Banknote} boxSize={4} />
                                                    <Text><Text as="span" fontWeight="semibold">Salário:</Text> {job?.salary_range || "—"}</Text>
                                                </HStack>
                                            </ListItem>
                                            <ListItem>
                                                <HStack align="start" spacing={2}>
                                                    <Icon as={GraduationCap} boxSize={4} />
                                                    <Text><Text as="span" fontWeight="semibold">Escolaridade:</Text> {job?.education || "—"}</Text>
                                                </HStack>
                                            </ListItem>
                                            <ListItem>
                                                <HStack align="start" spacing={2}>
                                                    <Icon as={Users} boxSize={4} />
                                                    <Text>
                                                        <Text as="span" fontWeight="semibold">Modalidade:</Text> {job?.work_modality || "—"}
                                                        {job?.is_pcd && <> • <Badge colorScheme="brand" variant="subtle">PCD</Badge></>}
                                                    </Text>
                                                </HStack>
                                            </ListItem>
                                        </List>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Benefícios */}
                            <Card size="sm" variant="outline">
                                <CardHeader pb={2}>
                                    <Heading size="md">Benefícios</Heading>
                                </CardHeader>
                                <CardBody pt={0}>
                                    {loading ? (
                                        <Stack>
                                            <Skeleton h="18px" w="70%" />
                                            <Skeleton h="18px" w="60%" />
                                            <Skeleton h="18px" w="50%" />
                                        </Stack>
                                    ) : job?.selection_process_benefits?.length ? (
                                        <List spacing={2}>
                                            {job.selection_process_benefits.map((b) => (
                                                <ListItem key={b.id}>
                                                    • {b.description}
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Text color="muted">Nenhum benefício informado.</Text>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Requisitos (2 col grid em desktop se quiser ajustar) */}
                            <Card size="sm" variant="outline" gridColumn={{ base: "auto", md: "1 / -1" }}>
                                <CardHeader pb={2}>
                                    <Heading size="md">Requisitos</Heading>
                                </CardHeader>
                                <CardBody pt={0}>
                                    {loading ? (
                                        <Stack>
                                            <Skeleton h="18px" w="70%" />
                                            <Skeleton h="18px" w="60%" />
                                            <Skeleton h="18px" w="50%" />
                                        </Stack>
                                    ) : job?.selection_process_requirements?.length ? (
                                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                                            {job.selection_process_requirements.map((r) => (
                                                <Box key={r.id}>
                                                    <Text>
                                                        {r.name}{" "}
                                                        <Badge ml={2} colorScheme={r.required ? "brand" : "secondary"} variant="subtle">
                                                            {r.required ? "Obrigatório" : "Opcional"}
                                                        </Badge>
                                                    </Text>
                                                </Box>
                                            ))}
                                        </SimpleGrid>
                                    ) : (
                                        <Text color="muted">Nenhum requisito listado.</Text>
                                    )}
                                </CardBody>
                            </Card>
                        </SimpleGrid>

                        {/* EMPRESA */}
                        <Card size="sm" bg="surfaceSubtle" variant="outline" mt={4}>
                            <CardHeader pb={2}>
                                <Heading size="md">Sobre a empresa</Heading>
                            </CardHeader>
                            <CardBody pt={0}>
                                {loading ? (
                                    <HStack align="start" spacing={4}>
                                        <Skeleton boxSize="16" borderRadius="full" />
                                        <Box flex="1">
                                            <Skeleton h="18px" w="50%" />
                                            <SkeletonText mt={3} noOfLines={3} spacing="3" />
                                        </Box>
                                    </HStack>
                                ) : (
                                    <HStack align="start" spacing={4} flexWrap="wrap">
                                        <Avatar
                                            size="lg"
                                            src={job?.company?.photo || undefined}
                                            name={job?.company?.name}
                                        />
                                        <Box flex="1" minW="240px">
                                            <Heading size="sm" mb={1}>{job?.company?.name}</Heading>
                                            <Text color="muted" mb={2}>{job?.company?.description}</Text>

                                            <HStack spacing={4} flexWrap="wrap">
                                                {(job?.city || job?.company?.neighborhood) && (
                                                    <HStack spacing={1}>
                                                        <Icon as={MapPin} boxSize={4} />
                                                        <Text fontSize="sm">
                                                            {job?.city && job?.state ? `${job.city} • ${job.state}` : job?.company?.neighborhood}
                                                        </Text>
                                                    </HStack>
                                                )}
                                            </HStack>
                                        </Box>
                                    </HStack>
                                )}
                            </CardBody>
                        </Card>
                    </CardBody>
                </Card>
            </Content>
            {/* CALL TO ACTION */}
            <Card size="sm" mt={6} textAlign="center">
                <CardBody>
                    <Text fontSize="lg" mb={4} color="muted">
                        Se interessou por esta vaga?
                    </Text>
                    <Button
                        colorScheme="green"
                        size="lg"
                        onClick={handleRegisterSelectionProcess}
                        isDisabled={loading}
                    >
                        Candidate-se
                    </Button>
                </CardBody>
            </Card>

        </Layout >
    );
};

export default OpportunitiesView;
