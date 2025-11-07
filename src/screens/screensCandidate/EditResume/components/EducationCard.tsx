import {
    Button,
    Card,
    CardHeader,
    Flex,
    Heading,
    useToast,
    HStack,
    Tooltip,
    IconButton,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useDisclosure,
} from "@chakra-ui/react";

import EducationCandidateService from "../../../../services/Candidate/EducationCandidateService";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { toastTemplate } from "../../../../templates/toast";
import type { StateEducations } from "@/types/education.types";
import { useRef } from "react";

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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const handleDelete = async () => {
        try {
            await EducationCandidateService.delete(education.id);
            toast(
                toastTemplate({
                    description: "Formação deletada com sucesso",
                    status: "success",
                })
            );
            onRefresh();
            onClose();
        } catch {
            toast(
                toastTemplate({
                    description: "Erro ao deletar formação",
                    status: "error",
                })
            );
        }
    };

    return (
        <>
            <Card borderWidth="1px" borderColor="border" bg="surfaceSubtle" size="sm" overflow="hidden">
                <CardHeader pb={2}>
                    <Flex w="100%" align="center" justify="space-between">
                        <Flex flexDirection="column" minW={0}>
                            <Heading size="md" noOfLines={1}>{education.course}</Heading>
                            <Heading color="var(--fg-subtle)" as="h3" size="sm" noOfLines={1}>{education.institution}</Heading>
                        </Flex>

                        <HStack spacing={2}>
                            <Tooltip label="Editar">
                                <IconButton aria-label="Editar formação" size="sm" variant="ghost" colorScheme="blue" icon={<EditIcon />} onClick={() => handleEdit(education.id)} />
                            </Tooltip>
                            <Tooltip label="Excluir">
                                <IconButton aria-label="Excluir formação" size="sm" variant="ghost" colorScheme="red" icon={<DeleteIcon />} onClick={onOpen} />
                            </Tooltip>
                        </HStack>
                    </Flex>
                </CardHeader>
            </Card>

            {/* Confirmação de exclusão */}
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontWeight="bold">
                            Remover formação
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja remover <strong>{education.course}</strong> de <strong>{education.institution}</strong>? Esta ação não pode ser desfeita.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} variant="outline">
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                Remover
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};
