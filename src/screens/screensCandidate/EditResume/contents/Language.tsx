import {
    Alert,
    AlertIcon,
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    HStack,
    Heading,
    SimpleGrid,
    Skeleton,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import CandidateLanguageService from "../../../../services/Candidate/CandidateLanguageService";
import { toastTemplate } from "../../../../templates/toast";
import type { LanguageState } from "../../../../types/language.types";
import { LanguageCard } from "../components/LanguageCard";
import { LanguagesModalContainer } from "../modals/LanguagesModalContainer";

export const Language = () => {
    const toast = useToast();
    const [languages, setLanguages] = useState<LanguageState[]>([]);
    const [loading, setLoading] = useState(true);

    const getCandidateLanguages = useCallback(async () => {
        try {
            setLoading(true);
            const data = await CandidateLanguageService.findAll();
            setLanguages(data);
        } catch {
            toast(
                toastTemplate({
                    status: "error",
                    description: "Erro ao buscar idiomas",
                })
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCandidateLanguages();
    }, [getCandidateLanguages]);

    const surf = useColorModeValue("surface", "surface");
    const border = useColorModeValue("stone.200", "stone.800");

    return (
        <Card bg={surf} borderWidth="1px" borderColor={border}>
            <CardHeader pb={2}>
                <HStack align="center" justify="space-between">
                    <Box>
                        <Heading size="md">Idiomas</Heading>
                        <Text color="muted" mt={1}>
                            Adicione os idiomas que você fala para que os recrutadores vejam suas habilidades linguísticas.
                        </Text>
                    </Box>

                </HStack>
            </CardHeader>
            <Divider my={3} />
            <CardBody pt={0} display="flex" flexDirection="column" gap={4}>
                <LanguagesModalContainer refresh={getCandidateLanguages} />

                {loading ? (
                    <SimpleGrid my={2} gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} height="120px" borderRadius="md" />
                        ))}
                    </SimpleGrid>
                ) : languages.length === 0 ? (
                    <Alert status="info" variant="left-accent" borderRadius="md">
                        <AlertIcon />
                        Você ainda não adicionou nenhum idioma. Clique em Adicionar para cadastrar.
                    </Alert>
                ) : (
                    <SimpleGrid my={2} gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
                        {languages.map((language) => (
                            <LanguageCard
                                key={language.id}
                                language={language}
                                onRefresh={getCandidateLanguages}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </CardBody>
        </Card>
    );
};
