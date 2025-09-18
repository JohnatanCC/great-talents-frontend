import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    HStack,
    SimpleGrid,
    Skeleton,
    SkeletonText,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import CandidateSoftwareService from "../../../../services/Candidate/CandidateSoftwareService";
import { SoftwaresModalContainer } from "../modals/SoftwaresModalContainer";
import { SoftwaresCard } from "../components/SoftwaresCard";
import type { SoftwareState } from "@/types/Softwares.types";

export const Software: React.FC = () => {
    const toast = useToast();
    const [softwares, setSoftwares] = useState<SoftwareState[]>([]);
    const [loading, setLoading] = useState(true);

    const border = useColorModeValue("stone.200", "stone.800");
    const surf = useColorModeValue("surface", "surface");

    const getCandidateSoftwares = useCallback(async () => {
        try {
            setLoading(true);
            const data = await CandidateSoftwareService.findAll();
            setSoftwares(Array.isArray(data) ? data : []);
        } catch {
            toast({
                ...{
                    title: "Erro ao buscar habilidades",
                    status: "error",
                    isClosable: true,
                    duration: 3500,
                },
            });
            setSoftwares([]);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        void getCandidateSoftwares();
    }, [getCandidateSoftwares]);

    return (
        <Card bg={surf} borderWidth="1px" borderColor={border}>
            <CardHeader pb={2}>
                <HStack justify="space-between" align="center">
                    <Box>
                        <Heading size="md">Habilidades</Heading>
                        <Text color="muted" mt={1}>
                            Adicione as ferramentas com as quais você tem conhecimento.
                        </Text>
                    </Box>
                </HStack>

            </CardHeader>

            <Divider my={3} borderColor={border} />
            <CardBody pt={0} display="flex" flexDirection="column" gap={4}>

                <SoftwaresModalContainer refresh={getCandidateSoftwares} />

                {/* Loading */}
                {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                        {Array.from({ length: 3 }).map((_, i) => (
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
                ) : softwares.length === 0 ? (
                    <Alert status="info" variant="left-accent" borderRadius="md">
                        <AlertIcon />
                        Você ainda não cadastrou nenhuma habilidade. Clique em{" "}
                        <Text as="span" fontWeight="bold" mx={1}>
                            Adicionar
                        </Text>{" "}
                        para incluir sua primeira ferramenta.
                    </Alert>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                        {softwares.map((software) => (
                            <SoftwaresCard
                                key={software.id}
                                software={software}
                                refresh={getCandidateSoftwares}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </CardBody>
        </Card>
    );
};
