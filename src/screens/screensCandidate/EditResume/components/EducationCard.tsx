import { Button, Card, CardHeader, Flex, Heading, useToast } from "@chakra-ui/react";

import EducationCandidateService from "../../../../services/Candidate/EducationCandidateService";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { toastTemplate } from "../../../../templates/toast";
import type { StateEducations } from "@/types/education.types";

type EducationCardProps = {
    education: StateEducations;
    onRefresh: () => void;
    handleEdit(id: number): void;
};

export const EducationCard: React.FC<EducationCardProps> = ({
    education,
    onRefresh,
    handleEdit,
}) => {
    const toast = useToast();
    const handleDelete = () => {
        EducationCandidateService.delete(education.id)
            .then(() => {
                toast(
                    toastTemplate({
                        description: "Formação deletada com sucesso",
                        status: "success",
                    })
                );
                onRefresh();
            })
            .catch(() => {
                toast(
                    toastTemplate({
                        description: "Erro ao deletar formação",
                        status: "error",
                    })
                );
            });
    };

    return (
        <>
            <Card
                pos="relative"
                overflow="hidden"
                size="sm"
            >
                <CardHeader display="flex">
                    <Flex w="100%" flexDirection="column">
                        <Heading size="md">
                            {education.course}
                        </Heading>
                        <Heading color="var(--fg-subtle)" as="h3" size="md">
                            {education.institution}
                        </Heading>
                    </Flex>
                    <Flex flexDir="column" gap={2}>
                        <Button onClick={handleDelete} size="sm" colorScheme="red" >
                            <DeleteIcon boxSize={5} />
                        </Button>
                        <Button onClick={() => handleEdit(education.id)} size="sm" colorScheme="blue" >
                            <EditIcon boxSize={5} />
                        </Button>
                    </Flex>
                </CardHeader>
            </Card>
        </>
    );
};
