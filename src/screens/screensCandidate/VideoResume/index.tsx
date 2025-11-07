import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    AlertIcon,
    AspectRatio,
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,

    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    ListItem,
    Skeleton,
    Stack,
    Text,
    UnorderedList,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { Info, Link2, Loader2, Trash2, Upload, Youtube } from "lucide-react";
import ReactPlayer from "react-player";
import Layout from "@/Layout";
import CandidateVideoCurriculumService from "@/services/Candidate/CandidateVideoCurriculumService";
import { toastTemplate } from "@/templates/toast";

/* ------------------------ utils ------------------------ */
// aceita youtube (watch?v=, youtu.be, shorts) e vimeo
const YT =
    /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|shorts\/)?([A-Za-z0-9_\-]{6,})/i;
const VM = /(https?:\/\/)?(www\.)?vimeo\.com\/(video\/)?([0-9]{6,})/i;

const isValidVideoUrl = (url?: string) => !!url && (YT.test(url) || VM.test(url));

const normalizeUrl = (url: string) => url.trim();

/* ------------------------ page ------------------------ */
const VideoResume = () => {
    const toast = useToast();
    const [initialLink, setInitialLink] = useState<string>("");
    const [videoLink, setVideoLink] = useState<string>("");
    const [fetching, setFetching] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    // estados derivados
    const dirty = videoLink !== initialLink;
    const isValid = useMemo(() => isValidVideoUrl(videoLink), [videoLink]);

    useEffect(() => {
        (async () => {
            try {
                const resp = await CandidateVideoCurriculumService.find();
                const current = resp?.video_curriculum_link || "";
                setInitialLink(current);
                setVideoLink(current);
            } catch {
                // se houve erro ao carregar, avisar o usuário
                toast(toastTemplate({ status: "error", description: "Erro ao carregar vídeo salvo" }))
            } finally {
                setFetching(false);
            }
        })();
    }, []);

    const onSubmit = async () => {
        if (!isValid) {
            toast({
                title: "Link inválido",
                description: "Cole um link do YouTube ou Vimeo (de preferência ‘Não listado’).",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        try {
            setSaving(true);
            const url = normalizeUrl(videoLink);
            await CandidateVideoCurriculumService.create({ video_curriculum_link: url });
            setInitialLink(url);
            toast({
                title: "Vídeo anexado com sucesso",
                description: "Seu vídeo currículo já pode ser visualizado no perfil.",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
        } catch {
            toast({
                title: "Erro ao salvar",
                description: "Tente novamente em instantes.",
                status: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    const onClear = () => setVideoLink("");

    const helperMuted = useColorModeValue("stone.600", "stone.300");

    return (
        <Layout>
            <Box mb={6}>
                <Heading as="h1" size="lg">
                    Enviando Vídeo Currículo
                </Heading>
                <Text color="GrayText">
                    Anexe um vídeo currículo para se destacar. Compartilhe suas experiências, habilidades e personalidade de forma autêntica. Algumas vagas exigem vídeo currículo.
                </Text>
            </Box>
            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                {/* Instruções */}
                <GridItem >
                    <Card h="full">
                        <CardHeader pb={0}>
                            <Heading size="md">Antes de anexar seu vídeo…</Heading>
                        </CardHeader>
                        <CardBody>
                            <UnorderedList spacing={2}>
                                <ListItem>
                                    <HStack align="start" spacing={2}>
                                        <Icon as={Info} mt="2px" />
                                        <Text>Grave com o celular na <b>horizontal</b>, em local silencioso e bem iluminado.</Text>
                                    </HStack>
                                </ListItem>
                                <ListItem>
                                    <HStack align="start" spacing={2}>
                                        <Icon as={Info} mt="2px" />
                                        <Text>Envie ao <b>YouTube</b> ou <b>Vimeo</b> como <b>Não listado</b> (ou privado com link).</Text>
                                    </HStack>
                                </ListItem>
                                <ListItem>
                                    <HStack align="start" spacing={2}>
                                        <Icon as={Info} mt="2px" />
                                        <Text>
                                            <b>Máx. 4 minutos</b>: apresente-se, conte resultados/impactos e destaque habilidades.
                                        </Text>
                                    </HStack>
                                </ListItem>
                            </UnorderedList>

                            <Alert mt={4} status="info" variant="left-accent">
                                <AlertIcon />
                                Fique à vontade para atualizar seu vídeo quando quiser. O link pode ser alterado depois.
                            </Alert>
                        </CardBody>
                    </Card>
                </GridItem>

                {/* Form / Preview */}
                <GridItem>
                    <Card h="full">
                        <CardHeader pb={0}>
                            <HStack justify="space-between" align="center">
                                <Heading size="md">Anexar Vídeo Currículo</Heading>
                                <Badge colorScheme={isValid ? "green" : "red"} variant="subtle">
                                    {videoLink ? (isValid ? "Link válido" : "Link inválido") : "Sem link"}
                                </Badge>
                            </HStack>
                        </CardHeader>

                        <CardBody>
                            <Stack spacing={4}>
                                <FormControl isInvalid={!!videoLink && !isValid}>
                                    <FormLabel>Link do vídeo (YouTube ou Vimeo)</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <Icon as={Link2} />
                                        </InputLeftElement>
                                        <Input
                                            value={videoLink}
                                            onChange={(e) => setVideoLink(e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            autoComplete="off"
                                        />
                                    </InputGroup>
                                    {!videoLink ? (
                                        <FormHelperText color={helperMuted}>
                                            Ex.:{" "}
                                            <Text as="span" fontFamily="mono">
                                                https://youtu.be/xxxxxxxxx
                                            </Text>
                                        </FormHelperText>
                                    ) : !isValid ? (
                                        <FormErrorMessage>Insira um link válido do YouTube ou Vimeo.</FormErrorMessage>
                                    ) : (
                                        <FormHelperText color={helperMuted}>Tudo certo! Veja a pré-visualização abaixo.</FormHelperText>
                                    )}
                                </FormControl>

                                {/* Preview */}
                                <Box borderWidth="1px" borderColor="border" rounded="md" overflow="hidden">
                                    {fetching ? (
                                        <Skeleton height="260px" />
                                    ) : videoLink && isValid ? (
                                        <AspectRatio ratio={16 / 9} bg="black">
                                            <ReactPlayer src={videoLink} width="100%" height="100%" />
                                        </AspectRatio>
                                    ) : (
                                        <Box p={6} textAlign="center">
                                            <Icon as={Youtube} opacity={0.7} />
                                            <Text mt={2} color="muted">
                                                Cole o link para visualizar aqui
                                            </Text>
                                        </Box>
                                    )}
                                </Box>
                            </Stack>
                        </CardBody>

                        <CardFooter>
                            <HStack spacing={3}>
                                <Button
                                    leftIcon={<Icon as={Upload} />}
                                    colorScheme="brand"
                                    onClick={onSubmit}
                                    isLoading={saving}
                                    isDisabled={fetching || !dirty || !isValid}
                                >
                                    {saving ? "Enviando..." : "Salvar vídeo"}
                                </Button>

                                <Button
                                    variant="outline"
                                    leftIcon={<Icon as={Trash2} />}
                                    onClick={onClear}
                                    isDisabled={!videoLink}
                                    colorScheme="red"
                                >
                                    Limpar link
                                </Button>

                                {fetching && (
                                    <HStack color="muted" ml={2}>
                                        <Icon as={Loader2} className="spin" />
                                        <Text>Carregando link salvo…</Text>
                                    </HStack>
                                )}
                            </HStack>
                        </CardFooter>
                    </Card>
                </GridItem>
            </Grid>

            {/* Dicas extras curtas */}
            <Alert mt={8} status="info" variant="left-accent">
                <AlertIcon />
                <Box>
                    <Text fontWeight="medium" mb={2}>Dicas rápidas para um ótimo vídeo</Text>
                    <UnorderedList spacing={1} fontSize="sm">
                        <ListItem>Fale olhando para a câmera e sorria 🙂</ListItem>
                        <ListItem>Mantenha o celular estável (apoio ou tripé).</ListItem>
                        <ListItem>Use roupas neutras e fundo simples.</ListItem>
                    </UnorderedList>
                </Box>
            </Alert>

        </Layout>
    );
};

export default VideoResume;
