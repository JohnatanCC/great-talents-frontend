import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    AlertIcon,
    Badge,
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    HStack,
    Heading,
    Skeleton,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import RegistrationsService from "@/services/RegistrationsService";
import { toastTemplate } from "@/templates/toast";
import type { StepState } from "@/types/registrations.types";
import Layout from "@/Layout";
import Loader from "@/components/UI/Loader";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

/* ===================== Mock para visualização ===================== */
const MOCK_STEP: StepState = {
    title: "Desenvolvedor Front-end React (Pleno)",
    company_name: "Great Talents",
    description: "ENTREVISTA",
    // se sua API tiver esse campo, mostramos “atualizado há…”
    // @ts-ignore
    updated_at: new Date().toISOString(),
} as StepState;

/* ===================== Utilidades ===================== */
const strip = (s = "") =>
    s
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

// ordem de etapas no funil (terminais no fim)
const PIPELINE = [
    "CANDIDATOS",
    "ANALISE",
    "ENTREVISTA",
    "AVALIACAO",
    "PROPOSTA",
    "APROVADO",
    "REPROVADO",
    "DECLINADO",
] as const;
type PipelineKey = (typeof PIPELINE)[number];

const toKey = (status?: string): PipelineKey | null => {
    const k = strip(status);
    return (PIPELINE.find((p) => p === k) as PipelineKey) ?? null;
};

const statusMeta: Record<
    PipelineKey,
    { label: string; color: string; message: string }
> = {
    CANDIDATOS: {
        label: "Candidatura confirmada",
        color: "secondary.500",
        message:
            "Sua candidatura foi recebida e está em andamento. Aguarde as próximas etapas.",
    },
    ANALISE: {
        label: "Em análise",
        color: "secondary.500",
        message:
            "Seu currículo está em avaliação. Em breve entraremos em contato com os próximos passos.",
    },
    ENTREVISTA: {
        label: "Entrevista",
        color: "brand.600",
        message:
            "Parabéns! Você está na etapa de entrevistas. Fique atento(a) ao seu e-mail/telefone.",
    },
    AVALIACAO: {
        label: "Avaliação",
        color: "brand.600",
        message:
            "Entrevista realizada! Seu perfil está em avaliação. Assim que possível, retornaremos.",
    },
    PROPOSTA: {
        label: "Proposta",
        color: "brand.600",
        message:
            "Estamos finalizando a etapa de proposta. Aguarde o contato do nosso time.",
    },
    APROVADO: {
        label: "Aprovado",
        color: "green.500",
        message:
            "Parabéns! Você foi aprovado(a) no processo. Em breve alinharemos os próximos passos.",
    },
    REPROVADO: {
        label: "Reprovado",
        color: "red.500",
        message:
            "Desta vez não foi. Seu perfil permanecerá em nosso banco para futuras oportunidades.",
    },
    DECLINADO: {
        label: "Declinado",
        color: "orange.500",
        message: "Você optou por não seguir neste processo seletivo.",
    },
};

/* ===================== Página ===================== */
const MotionBox = motion(Box);

const OpportunitieFeedbacks: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const toast = useToast();

    const [step, setStep] = useState<StepState | null>(null);
    const [loading, setLoading] = useState(true);

    // carrega o status atual
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (id) {
                    const res = await RegistrationsService.detailsSteps(id);
                    setStep(res && (res as any)?.title ? res : MOCK_STEP);
                } else {
                    setStep(MOCK_STEP);
                }
            } catch {
                toast(
                    toastTemplate({
                        description:
                            "Erro ao buscar as etapas do processo seletivo — mostrando exemplo.",
                        status: "warning",
                    })
                );
                setStep(MOCK_STEP);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const currentKey = useMemo(
        () => toKey(step?.description),
        [step?.description]
    );
    const meta = currentKey ? statusMeta[currentKey] : null;

    return (
        <Layout>
            <Alert status="info" mb={4} borderRadius="md">
                <AlertIcon />
                Acompanhe abaixo o andamento das etapas do seu processo. Você receberá
                notificações sobre qualquer avanço importante.
            </Alert>

            {loading ? (
                <Loader />
            ) : step ? (
                <MotionBox
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <Card>
                        <CardHeader pb={2}>
                            <Flex
                                direction={{ base: "column", md: "row" }}
                                justify="space-between"
                                align={{ base: "start", md: "center" }}
                                gap={2}
                            >
                                <Flex direction="column" gap={1}>
                                    <Heading size="lg">
                                        {step?.title || <Skeleton w="260px" h="28px" />}
                                    </Heading>
                                    <HStack alignItems={{ base: "start", md: "center" }} flexDir={{ base: "column", md: "row" }} spacing={3} mt={1}>
                                        <Text color="muted">
                                            {step?.company_name || <Skeleton w="180px" h="18px" />}
                                        </Text>
                                        {/* Última atualização (se houver timestamp) */}
                                        {"updated_at" in (step as any) && (step as any).updated_at && (
                                            <Text color="muted" fontSize="sm">
                                                • Atualizado há{" "}
                                                {formatDistanceToNow(
                                                    new Date((step as any).updated_at),
                                                    { addSuffix: true, locale: ptBR }
                                                )}
                                            </Text>
                                        )}
                                    </HStack>
                                </Flex>

                                {/* status atual como badge com bom contraste */}
                                <Badge
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    colorScheme={
                                        currentKey === "APROVADO" ? "green" :
                                            currentKey === "REPROVADO" ? "red" :
                                                currentKey === "DECLINADO" ? "orange" :
                                                    currentKey === "ENTREVISTA" || currentKey === "AVALIACAO" || currentKey === "PROPOSTA" ? "blue" :
                                                        "gray"
                                    }
                                    textTransform="none"
                                    fontWeight="700"
                                    fontSize="sm"
                                >
                                    {meta?.label ?? (step?.description ?? "—")}
                                </Badge>
                            </Flex>
                        </CardHeader>

                        <CardBody pt={0}>
                            <Divider my={3} />

                            {/* Mensagem do status — compacta, com aria-live */}
                            <Alert
                                status={
                                    currentKey === "APROVADO" ? "success" :
                                        currentKey === "REPROVADO" ? "error" :
                                            currentKey === "DECLINADO" ? "warning" :
                                                "info"
                                }
                                borderRadius="md"
                                mb={3}
                                aria-live="polite"
                            >
                                <AlertIcon />
                                <Box flex="1">
                                    <Text>{meta ? meta.message : "Status desconhecido."}</Text>
                                </Box>
                            </Alert>

                            <Box mt={5}>
                                <Heading size="sm" mb={2}>Histórico</Heading>
                                <Stack spacing={2} fontSize="sm" color="muted">
                                    <Text>• 12/03 — Candidatura realizada</Text>
                                    <Text>• 14/03 — Currículo em análise</Text>
                                    <Text>• 20/03 — Entrevista agendada</Text>
                                </Stack>
                            </Box>
                        </CardBody>
                    </Card>
                </MotionBox>
            ) : (
                <Text color="red.500" textAlign="center">
                    Nenhuma etapa encontrada para este processo seletivo.
                </Text>
            )}
        </Layout>
    );
};

export default OpportunitieFeedbacks;
