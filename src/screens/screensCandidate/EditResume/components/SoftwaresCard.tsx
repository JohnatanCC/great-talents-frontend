import {
    Button,
    Card,
    CardHeader,
    Flex,
    Heading,
    HStack,
    Icon,
    Tag,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import { Trash2, Pencil } from "lucide-react";
import { useRef } from "react";
import CandidateSoftwareService from "../../../../services/Candidate/CandidateSoftwareService";
import { toastTemplate } from "../../../../templates/toast";
import type { SoftwareState } from "@/types/Softwares.types";

interface SoftwareCardProps {
    software: SoftwareState;
    refresh: VoidFunction;
}

const levelColor = (lvl?: string) => {
    const v = (lvl || "").toLowerCase();
    if (v.includes("inic") || v.includes("basic")) return "gray";
    if (v.includes("inter")) return "yellow";
    if (v.includes("avan") || v.includes("advanced")) return "purple";
    if (v.includes("flu") || v.includes("expert")) return "green";
    return "blue";
};

export const SoftwaresCard: React.FC<SoftwareCardProps> = ({ software, refresh }) => {
    const toast = useToast();
    const border = useColorModeValue("stone.200", "stone.800");
    const surf = useColorModeValue("surface", "surface");

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
            refresh();
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
            <Card bg={surf} borderWidth="1px" borderColor={border} size="sm" pos="relative" overflow="hidden">
                <CardHeader display="flex" alignItems="center" gap={3}>
                    <Flex w="100%" direction="column">
                        <HStack spacing={2} align="baseline">
                            <Heading size="md" noOfLines={1}>
                                {software.name}
                            </Heading>
                            {software.level && (
                                <Tag size="sm" colorScheme={levelColor(software.level)} variant="subtle">
                                    {software.level}
                                </Tag>
                            )}
                        </HStack>
                    </Flex>

                    <HStack spacing={2}>
                        {/* editar desabilitado por enquanto; conecte quando houver tela */}
                        <Button size="sm" variant="outline" leftIcon={<Icon as={Pencil} />} isDisabled>
                            Editar
                        </Button>
                        <Button
                            size="sm"
                            colorScheme="red"
                            leftIcon={<Icon as={Trash2} />}
                            onClick={onOpen}
                        >
                            Remover
                        </Button>
                    </HStack>
                </CardHeader>
            </Card>

            {/* Confirmação de exclusão */}
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay />
                <AlertDialogContent bg={surf}>
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
