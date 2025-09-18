import {
    Alert,
    AlertIcon,
    Box,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    HStack,
    SimpleGrid,
    Skeleton,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { toastTemplate } from "../../../../templates/toast";

import EducationCandidateService from "../../../../services/Candidate/EducationCandidateService";
import { EducationCard } from "../components/EducationCard";
import type { StateEducations } from "@/types/education.types";
import EducationModalContainer from "../modals/EducationModalContainer";

export const Education = () => {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [educations, setEducations] = useState<StateEducations[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentEducationId, setCurrentEducationId] = useState<number | null>(null);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const response = await EducationCandidateService.findAll();
            setEducations(Array.isArray(response) ? response : []);
        } catch {
            toast(
                toastTemplate({
                    description: "Erro ao buscar formações",
                    status: "error",
                })
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = useCallback(
        (educationId: number) => {
            setCurrentEducationId(educationId);
            onOpen();
        },
        [onOpen]
    );

    const handleClose = useCallback(() => {
        onClose();
        setCurrentEducationId(null);
    }, [onClose]);

    useEffect(() => {
        fetchExperiences();
    }, []);

    return (
        <Card>
            <CardHeader>
                <HStack justify="space-between" align="center">
                    <Heading size="lg">Formação acadêmica</Heading>
                </HStack>

                <Text color="muted" mt={2}>
                    Adicione seus cursos para que os recrutadores conheçam sua trajetória acadêmica.
                </Text>
            </CardHeader>
            <Divider mb={4} />
            <CardBody pt={0} display="flex" flexDirection="column" gap={4} >
                <EducationModalContainer
                    refresh={fetchExperiences}
                    currentEducationId={currentEducationId}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={handleClose}
                />

                {loading ? (
                    <SimpleGrid my={2} gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} height="140px" borderRadius="md" />
                        ))}
                    </SimpleGrid>
                ) : educations.length === 0 ? (
                    <Alert status="info" variant="left-accent" borderRadius="md">
                        <AlertIcon />
                        Você ainda não adicionou nenhuma formação. Clique em{" "}
                        <Text as="span" fontWeight="bold" ml={1}>
                            Adicionar
                        </Text>{" "}
                        para cadastrar sua primeira.
                    </Alert>
                ) : (
                    <SimpleGrid my={4} gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
                        {educations.map((education) => (
                            <EducationCard
                                key={education.id}
                                education={education}
                                onRefresh={fetchExperiences}
                                handleEdit={handleEdit}
                            />
                        ))}
                    </SimpleGrid>
                )}


            </CardBody>
        </Card>
    );
};
