import { useEffect, useState } from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    HStack,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react";
import CandidateDetailService from "../../../../services/Candidate/CandidateDetailService";
import { toastTemplate } from "../../../../templates/toast";
import { EditAboutCandidateModalContainer } from "../modals/EditAboutCandidateModal";

export const Description = () => {
    const toast = useToast();
    const [resume, setResume] = useState("");
    const [loading] = useState(true); // lógica preservada

    const getResume = () => {
        CandidateDetailService.findOne()
            .then((data) => {
                setResume(data.resume);
            })
            .catch(() =>
                toast(
                    toastTemplate({
                        description: "Erro ao buscar descrição",
                        status: "error",
                    })
                )
            )
            .finally(() => loading); // lógica original preservada
    };

    useEffect(() => {
        getResume();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const chars = resume?.length ?? 0;

    return (
        <Card>
            <CardHeader>
                <HStack justify="space-between" align="start" spacing={4}>
                    <Box>
                        <Heading size="md">Sobre você</Heading>
                        <Text color="muted" fontSize="sm" mt={1}>
                            Esta descrição aparece no seu currículo e nas candidaturas.
                        </Text>
                    </Box>
                </HStack>
            </CardHeader>

            <Divider mb={4} />

            <CardBody pt={0} display="flex" flexDirection="column" gap={4}>
                {!resume ? (
                    <Stack spacing={4}>
                        <Alert status="info" variant="left-accent" borderRadius="md">
                            <AlertIcon />
                            <AlertDescription>
                                Você ainda não tem uma descrição cadastrada. Conte, em 3–6 linhas,
                                quem você é, seus objetivos e principais conquistas. Isso ajuda os
                                recrutadores a conhecerem você rapidamente.
                            </AlertDescription>
                        </Alert>

                        {/* Botão/Modal secundário (além do do cabeçalho) para facilitar no fluxo mobile */}
                        <EditAboutCandidateModalContainer refresh={getResume} />
                    </Stack>
                ) : (
                    <Stack spacing={3}>
                        <Text lineHeight="1.8" whiteSpace="pre-line">
                            {resume}
                        </Text>

                        <HStack justify="space-between" pt={2}>
                            <Text color="muted" fontSize="sm">
                                {chars} caracteres
                            </Text>
                            <EditAboutCandidateModalContainer refresh={getResume} />
                        </HStack>
                    </Stack>
                )}
            </CardBody>
        </Card>
    );
};
