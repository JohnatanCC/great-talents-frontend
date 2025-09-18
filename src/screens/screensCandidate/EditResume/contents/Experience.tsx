import {
    Alert,
    AlertIcon,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Heading,
    HStack,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import { toastTemplate } from "../../../../templates/toast";
import type { StateExperiences } from "../../../../types/experience.types";
import ExperienceCandidateService from "../../../../services/Candidate/ExperienceCandidateService";
import { ExperiencesModalContainer } from "../modals/ExperiencesModalContainer";
import { ExperienceCard } from "../components/ExperienceCard";

export const Experience = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [experiences, setExperiences] = useState<StateExperiences[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentExperienceId, setCurrentExperienceId] = useState<number | null>(null);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const response = await ExperienceCandidateService.findAll();
            setExperiences(response);
        } catch {
            toast(
                toastTemplate({
                    status: "error",
                    description: "Erro ao buscar experiências",
                })
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = useCallback(
        (experienceId: number) => {
            setCurrentExperienceId(experienceId);
            onOpen();
        },
        [onOpen]
    );

    const handleClose = useCallback(() => {
        onClose();
        setCurrentExperienceId(null);
    }, [onClose]);

    useEffect(() => {
        fetchExperiences();
    }, []);

    return (
        <Card bg="surface" borderWidth="1px" borderColor="border">
            <CardHeader>
                <Stack spacing={1}>
                    <Heading size="md">Experiência profissional</Heading>
                    <Text color="muted">Adicione suas experiências profissionais mais recentes.</Text>
                </Stack>
            </CardHeader>
            <Divider mb={4} />
            <CardBody pt={0} display="flex" flexDirection="column" gap={4}>
                {/* Ação principal (modal) */}

                <ExperiencesModalContainer
                    refresh={fetchExperiences}
                    currentExperienceId={currentExperienceId}
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={handleClose}
                />


                {/* Estados: carregando / vazio / lista */}
                {loading ? (
                    <SimpleGrid my={2} gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} height="140px" borderRadius="md" />
                        ))}
                    </SimpleGrid>
                ) : !experiences || experiences.length === 0 ? (
                    <Alert status="info" variant="left-accent" borderRadius="md">
                        <AlertIcon />
                        Você ainda não adicionou nenhuma experiência. Clique em <Text as="span" fontWeight="bold" ml={1}>Adicionar</Text> para cadastrar a primeira.
                    </Alert>
                ) : (
                    <SimpleGrid my={4} gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
                        {Array.isArray(experiences) && experiences.map((experience) => (
                            <ExperienceCard
                                key={experience.id}
                                experience={experience}
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
