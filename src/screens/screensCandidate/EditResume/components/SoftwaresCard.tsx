import {
    Button,
    Card,
    CardHeader,
    Flex,
    Heading,
    HStack,
    IconButton,
    Tag,
    Tooltip,
    useDisclosure,
    useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import CandidateSoftwareService from "../../../../services/Candidate/CandidateSoftwareService";
import { toastTemplate } from "../../../../templates/toast";
import type { SoftwareState } from "@/types/Softwares.types";
import { getLevelColorScheme } from "@/utils/levelColors";

interface SoftwareCardProps {
    software: SoftwareState;
    onRefresh: VoidFunction;
}

export const SoftwaresCard: React.FC<SoftwareCardProps> = ({ software, onRefresh }) => {
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const handleDeleteConfirmed = async () => {
        try {
            await CandidateSoftwareService.delete(software.id);
            toast(
                toastTemplate({
                    description: "Habilidade removida com sucesso",
                    status: "success",
                })
            );
            onRefresh();
        } catch {
            toast(
                toastTemplate({
                    description: "Erro ao remover habilidade",
                    status: "error",
                })
            );
        } finally {
            onClose();
        }
    };

    return (
        <>
            <Card borderWidth="1px" size="sm" pos="relative" overflow="hidden" borderColor="border"
                bg="surfaceSubtle">
                <CardHeader display="flex" alignItems="center" gap={3}>
                    <Flex w="100%" direction="column">
                        <HStack spacing={2} align="baseline">
                            <Heading size="md" noOfLines={1}>
                                {software.name}
                            </Heading>
                            {software.level && (
                                <Tag size="sm" colorScheme={getLevelColorScheme(software.level)} variant="subtle">
                                    {software.level}
                                </Tag>
                            )}
                        </HStack>
                    </Flex>

                    <HStack spacing={2}>
                        <Tooltip label="Editar">
                            <IconButton
                                aria-label="Editar software"
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                isDisabled
                            />
                        </Tooltip>
                        <Tooltip label="Excluir">
                            <IconButton
                                aria-label="Excluir software"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={onOpen}
                            />
                        </Tooltip>
                    </HStack>
                </CardHeader>
            </Card>

            {/* Confirmação de exclusão */}
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader fontWeight="bold">
                        Remover habilidade
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Tem certeza que deseja remover <strong>{software.name}</strong>?
                        Esta ação não pode ser desfeita.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} variant="outline">
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={handleDeleteConfirmed} ml={3}>
                            Remover
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
