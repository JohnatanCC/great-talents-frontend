import {
    Badge,
    Button,
    Card,
    CardHeader,
    Flex,
    Heading,
    HStack,
    IconButton,
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

import CandidateLanguageService from "../../../../services/Candidate/CandidateLanguageService";
import { toastTemplate } from "../../../../templates/toast";
import type { LanguageState } from "@/types/language.types";
import { getLevelColorScheme } from "@/utils/levelColors";

interface LanguageCardProps {
    language: LanguageState;
    onRefresh: VoidFunction;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ language, onRefresh }) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const handleDelete = async () => {
        try {
            await CandidateLanguageService.delete(language.id);
            toast(
                toastTemplate({
                    description: "Idioma deletado com sucesso",
                    status: "success",
                })
            );
            onRefresh();
            onClose();
        } catch {
            toast(
                toastTemplate({
                    description: "Erro ao deletar idioma",
                    status: "error",
                })
            );
        }
    };

    return (
        <>
            <Card
                size="sm"
                borderWidth="1px"
                borderColor="border"
                bg="surfaceSubtle"
            >
                <CardHeader py={3}>
                    <HStack align="start" justify="space-between">
                        <Flex direction="column" minW={0}>
                            <Heading size="sm" noOfLines={1}>
                                {language.name}
                            </Heading>
                            <Badge
                                mt={1}
                                colorScheme={getLevelColorScheme(language.level)}
                                variant="subtle"
                                alignSelf="flex-start"
                                textTransform="none"
                                fontWeight="600"
                            >
                                {language.level}
                            </Badge>
                        </Flex>

                        <HStack spacing={2}>
                            <Tooltip label="Editar">
                                <IconButton aria-label="Editar idioma" icon={<EditIcon />} size="sm" variant="ghost" colorScheme="blue" isDisabled />
                            </Tooltip>
                            <Tooltip label="Excluir">
                                <IconButton aria-label="Excluir idioma" icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={onOpen} />
                            </Tooltip>
                        </HStack>
                    </HStack>
                </CardHeader>
            </Card>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontWeight="bold">
                            Remover idioma
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja remover <strong>{language.name}</strong> ({language.level})? Esta ação não pode ser desfeita.
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
