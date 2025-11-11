import { useEffect, useState } from "react";
import {
    AspectRatio,
    Avatar,
    Badge,
    Box,
    Button,
    CardBody,
    CardHeader,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    Stack,
    Text,
    useToast,
    Alert,
    AlertIcon,
    useColorModeValue,
} from "@chakra-ui/react";
import { Mail, Phone, MapPin, Accessibility, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toastTemplate } from "@/templates/toast";
import CandidateCurriculumService from "@/services/Candidate/CandidateCurriculumService";
import type { StateProfile } from "@/types/curriculum.types";
import Content from "@/components/UI/Content";
import Layout from "@/Layout";
import SkillMeter from "@/components/UI/SkillMeter";

/* ======================== Helpers ======================== */
const fDate = (iso?: string) =>
    iso ? format(parseISO(iso), "dd/MM/yyyy", { locale: ptBR }) : "—";

const DateRange = ({ start, end }: { start?: string; end?: string }) => (
    <Text color="muted">{fDate(start)} — {fDate(end)}</Text>
);



/* ================== Blocos reutilizáveis ================= */
const Section = ({
    title,
    children,
    right,
}: { title: string; children: React.ReactNode; right?: React.ReactNode }) => {
    const titleColor = useColorModeValue("brand.700", "brand.300");
    return (
        <Box mb={3}>
            <HStack justify="space-between" align="center" mb={3}>
                <Heading size="md" color={titleColor}>{title}</Heading>
                {right}
            </HStack>
            <Box>
                {children}
            </Box>
        </Box>
    );
};

const InfoRow = ({
    icon, label, value,
}: { icon: React.ElementType; label: string; value?: React.ReactNode }) => (
    <HStack spacing={3} align="start">
        <Icon as={icon} boxSize={5} color="brand.600" _dark={{ color: "brand.300" }} />
        <Box>
            <Text fontWeight={600} fontSize="sm">{label}</Text>
            <Box>{value ?? "—"}</Box>
        </Box>
    </HStack>
);

const TimelineItem = ({
    title, subtitle, children,
}: {
    title: string; subtitle?: React.ReactNode; children?: React.ReactNode;
}) => {
    const line = useColorModeValue("stone.200", "stone.700");
    return (
        <HStack align="flex-start" spacing={4} position="relative">
            <Box position="relative">
                <Box w="10px" h="10px" bg="brand.500" _dark={{ bg: "brand.300" }} borderRadius="full" mt={1.5} />
                <Box position="absolute" left="4px" top="16px" bottom="-16px" w="2px" bg={line} />
            </Box>
            <Box>
                <Heading size="sm">{title}</Heading>
                {subtitle && <Box mt={0.5}>{subtitle}</Box>}
                {children && <Box mt={2}>{children}</Box>}
            </Box>
        </HStack>
    );
};

/* =========================== Página =========================== */
const Resume = () => {
    const toast = useToast();
    const params = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<StateProfile | null>(null);
    const loading = profile === null;

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async () => {
            try {
                const data = params.id
                    ? await CandidateCurriculumService.findByCandidateId(params.id)
                    : await CandidateCurriculumService.findMyCurriculum();

                if (mounted) {
                    setProfile(data);
                }
            } catch (error) {
                if (mounted) {
                    toast(toastTemplate({
                        status: "error",
                        description: "Erro ao buscar currículo"
                    }));
                }
            }
        };

        fetchProfile();

        return () => {
            mounted = false;
        };
    }, [params.id]);

    const avatarRing = useColorModeValue("white", "stone.900");
    const glassBg = useColorModeValue("rgba(255,255,255,0.55)", "rgba(28,25,23,0.45)");
    const glassBorder = useColorModeValue("whiteAlpha.600", "blackAlpha.400");

    return (
        <Content>
            {/* HEADER — gradientes tipo login + glass + compacto */}
            <CardHeader pb={0} pt={0} display="flex" alignItems="center" position="relative" minH={{ base: 120, md: 140 }} px={{ base: 0, md: 0 }}>
                {/* Fundo gradiente (sua paleta alaranjada) */}
                <Box
                    position="absolute"
                    inset={0}
                    borderTopRadius="lg"
                    style={{
                        background:
                            `radial-gradient(60rem 60rem at 10% 20%, rgba(255, 72, 0, 0.25), transparent 50%),
                 radial-gradient(40rem 40rem at 70% 30%, rgba(255, 102, 0, 0.28), transparent 55%),
                 radial-gradient(50rem 50rem at 40% 80%, rgba(185, 16, 16, 0.18), transparent 55%),
                 linear-gradient(120deg, rgba(241, 151, 99, 0.18), rgba(236, 151, 72, 0.445))` as any,
                    }}
                />
                {/* camada de contraste */}
                <Box
                    position="absolute"
                    inset={0}
                    rounded="lg"
                    bgGradient={useColorModeValue(
                        "linear(to-b, rgba(255,255,255,0.55), rgba(255,255,255,0.05))",
                        "linear(to-b, rgba(0, 0, 0, 0.158), rgba(0,0,0,0.10))"
                    )}
                />

                {/* Conteúdo com glass */}
                <Flex w="full" position="relative" zIndex={1} px={{ base: 3, md: 6 }} py={{ base: 2, md: 3 }}>
                    <Box
                        w="100%"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={glassBorder}
                        bg={glassBg}
                        boxShadow="md"
                        backdropFilter="blur(10px)"
                        px={{ base: 3, md: 5 }}
                        py={{ base: 3, md: 3 }}
                    >
                        <Flex
                            justify="space-between"
                            align={{ base: "start", md: "center" }}
                            direction={{ base: "column", md: "row" }}
                            gap={3}
                        >
                            <HStack spacing={4} align="center">
                                <Box>
                                    {profile?.url_foto ? (
                                        <Avatar size="lg" src={profile.url_foto} borderWidth="3px" borderColor={avatarRing} />
                                    ) : (
                                        <SkeletonCircle size="12" />
                                    )}
                                </Box>

                                <Box>
                                    {loading ? (
                                        <Skeleton height="24px" w="220px" borderRadius="md" />
                                    ) : (
                                        <Heading size="lg" noOfLines={1}>
                                            {profile?.name}
                                        </Heading>
                                    )}

                                    {!loading && (
                                        <HStack mt={1.5} spacing={2} wrap="wrap">
                                            {profile?.pcd?.is_pcd && (
                                                <Badge colorScheme="brand" variant="subtle" display="inline-flex" alignItems="center" gap={1}>
                                                    <Icon as={Accessibility} boxSize={4} /> PCD
                                                </Badge>
                                            )}
                                        </HStack>
                                    )}
                                </Box>
                            </HStack>

                            <HStack>
                                <Button colorScheme="blue" leftIcon={<Icon as={Pencil} />} onClick={() => navigate("/candidato/editar-curriculo")}>
                                    Editar currículo
                                </Button>
                            </HStack>
                        </Flex>
                    </Box>
                </Flex>
            </CardHeader>

            {/* BODY */}
            <CardBody pt={6}>
                {/* SOBRE + CONTATOS + ENDEREÇO | VÍDEO */}
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                    <GridItem >
                        <Section title="Sobre">
                            {loading ? (
                                <SkeletonText noOfLines={5} spacing="3" />
                            ) : profile?.resume ? (
                                <Text lineHeight="1.8">{profile.resume}</Text>
                            ) : (
                                <Alert status="info" variant="left-accent">
                                    <AlertIcon />
                                    Descrição sobre você não foi enviada.
                                </Alert>
                            )}

                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4} mt={4}>
                                <GridItem>
                                    <Section title="Dados de contato">
                                        <Stack spacing={3}>
                                            <InfoRow icon={Mail} label="E-mail" value={profile?.email ?? <Skeleton w="160px" h="20px" />} />
                                            <InfoRow icon={Phone} label="Telefone" value={profile?.contact ?? <Skeleton w="120px" h="20px" />} />
                                        </Stack>
                                    </Section>
                                </GridItem>

                                <GridItem>
                                    <Section title="Endereço">
                                        <Stack spacing={3}>
                                            <InfoRow
                                                icon={MapPin}
                                                label="Cidade/Estado"
                                                value={
                                                    profile?.address?.city && profile?.address?.state
                                                        ? `${profile.address.city} - ${profile.address.state}`
                                                        : <Skeleton w="200px" h="20px" />
                                                }
                                            />
                                            <InfoRow
                                                icon={MapPin}
                                                label="Rua/Bairro"
                                                value={
                                                    profile?.address
                                                        ? <>
                                                            {profile.address.street && profile.address.number
                                                                ? `${profile.address.street} (${profile.address.number})`
                                                                : "—"}
                                                            {" • "}
                                                            {profile.address.neighborhood ?? "—"}
                                                        </>
                                                        : <Skeleton w="240px" h="20px" />
                                                }
                                            />
                                        </Stack>
                                    </Section>
                                </GridItem>
                            </Grid>
                            <Divider />
                        </Section>
                    </GridItem>

                    <GridItem>
                        <Section title="Vídeo currículo">
                            {profile?.video_curriculum_link ? (
                                <AspectRatio ratio={6 / 3} borderRadius="md" overflow="hidden" bg="black" boxShadow="md">
                                    <ReactPlayer width="100%" height="100%" src={profile.video_curriculum_link} />
                                </AspectRatio>
                            ) : (
                                <Alert status="info" variant="left-accent">
                                    <AlertIcon />
                                    Vídeo currículo não enviado.
                                </Alert>
                            )}
                            <Divider />
                        </Section>
                    </GridItem>
                </Grid>

                {/* EXPERIÊNCIAS / FORMAÇÃO */}
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6} mt={2}>
                    <GridItem>
                        <Section title="Experiências">
                            {profile?.experiences?.length ? (
                                <Stack spacing={5} mt={1}>
                                    {profile.experiences.map((exp, idx) => (
                                        <TimelineItem
                                            key={`${exp.company_name}-${idx}`}
                                            title={exp.company_name || "Empresa não informada"}
                                            subtitle={<DateRange start={exp.start} end={exp.end} />}
                                        >
                                            <Text>{exp.position || "Cargo não informado"}</Text>
                                        </TimelineItem>
                                    ))}
                                </Stack>
                            ) : (
                                <Alert status="info" variant="left-accent">
                                    <AlertIcon />
                                    Nenhuma experiência enviada.
                                </Alert>
                            )}
                        </Section>
                        <Divider />
                    </GridItem>

                    <GridItem>
                        <Section title="Formação acadêmica">
                            {profile?.educations?.length ? (
                                <Stack spacing={5} mt={1}>
                                    {profile.educations.map((ed, idx) => (
                                        <TimelineItem
                                            key={`${ed.institution}-${idx}`}
                                            title={`${ed.course || "Curso não informado"} — ${ed.formation_status || "Status não informado"}`}
                                            subtitle={<DateRange start={ed.start_date} end={ed.end_date} />}
                                        >
                                            <Text>{ed.institution || "Instituição não informada"}</Text>
                                        </TimelineItem>
                                    ))}
                                </Stack>
                            ) : (
                                <Alert status="info" variant="left-accent">
                                    <AlertIcon />
                                    Suas formações acadêmicas não foram enviadas.
                                </Alert>
                            )}
                        </Section>
                        <Divider />
                    </GridItem>
                </Grid>

                {/* HABILIDADES / IDIOMAS (mantidos, prontos para quando houver dados) */}
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                    <GridItem mt={4}>
                        <Section title="Habilidades">
                            {profile?.softwares?.length ? (
                                <Stack spacing={3}>
                                    {profile.softwares.map((s: any, i) => (
                                        <SkillMeter key={`${s.name}-${i}`} name={s.name} level={s.level} />
                                    ))}
                                </Stack>
                            ) : (
                                <Alert status="info" variant="left-accent">
                                    <AlertIcon />
                                    Nenhuma habilidade enviada.
                                </Alert>
                            )}
                        </Section>
                        <Divider />
                    </GridItem>

                    <GridItem mt={4}>
                        <Section title="Idiomas">
                            {profile?.languages?.length ? (
                                <Stack spacing={3}>
                                    {profile.languages.map((l: any, i) => (
                                        <SkillMeter key={`${l.name}-${i}`} name={l.name} level={l.level} />
                                    ))}
                                </Stack>
                            ) : (
                                <Alert status="info" variant="left-accent">
                                    <AlertIcon />
                                    Nenhum idioma enviado.
                                </Alert>
                            )}
                        </Section>
                        <Divider />
                    </GridItem>
                </Grid>
            </CardBody>
        </Content>
    );
};

export default Resume;
