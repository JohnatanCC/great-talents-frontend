import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    HStack,
    Heading,
    IconButton,
    Text,
    Tooltip,
    VStack,
    useDisclosure,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import ExperienceCandidateService from "../../../../services/Candidate/ExperienceCandidateService";
import { toastTemplate } from "../../../../templates/toast";
import type { StateExperiences } from "@/types/experience.types";

type ExperienceCardProps = {
    experience: StateExperiences;
    onRefresh: () => void;
    handleEdit(id: number): void;
};

/* Helpers */
const fDate = (iso?: string) =>
    iso ? format(parseISO(iso), "dd/MM/yyyy", { locale: ptBR }) : "—";

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
    experience,
    onRefresh,
    handleEdit,
}) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [deleting, setDeleting] = useState(false);

    const confirmDelete = async () => {
        try {
            setDeleting(true);
            await ExperienceCandidateService.delete(experience.id);
            toast(
                toastTemplate({
                    status: "success",
                    description: "Experiência deletada",
                })
            );
            onRefresh();
            onClose();
        } catch {
            toast(
                toastTemplate({
                    status: "error",
                    description: "Erro ao deletar experiência",
                })
            );
        } finally {
            setDeleting(false);
        }
    };

    const statusBadge = experience.current
        ? { text: "Atual", colorScheme: "brand" as const }
        : { text: "Encerrado", colorScheme: "secondary" as const };

    return (
        <>
            <Card
                borderWidth="1px"
                borderColor="border"
                bg="surfaceSubtle"
                size="sm"
            >
                <CardHeader pb={2}>
                    <HStack align="start" justify="space-between" spacing={3}>
                        <VStack align="start" spacing={0}>
                            <Heading size="sm" noOfLines={1}>
                                {experience.position || "Cargo não informado"}
                            </Heading>
                            <Text color="muted" noOfLines={1}>
                                {experience.company_name || "Empresa não informada"}
                            </Text>
                        </VStack>

                        <HStack spacing={1}>
                            <Tooltip label="Editar">
                                <IconButton
                                    aria-label="Editar experiência"
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    icon={<EditIcon />}
                                    onClick={() => handleEdit(experience.id)}
                                />
                            </Tooltip>
                            <Tooltip label="Excluir">
                                <IconButton
                                    aria-label="Excluir experiência"
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    icon={<DeleteIcon />}
                                    onClick={onOpen}
                                />
                            </Tooltip>
                        </HStack>
                    </HStack>
                </CardHeader>

                <CardBody pt={0}>
                    <HStack spacing={2} wrap="wrap" mb={2}>
                        <Badge colorScheme={statusBadge.colorScheme} variant="subtle">
                            {statusBadge.text}
                        </Badge>
                        <Text fontSize="sm" color="muted">
                            {fDate(experience.start)} — {experience.current ? "atual" : fDate(experience.end)}
                        </Text>
                        {(experience.city || experience.state) && (
                            <Text fontSize="sm" color="muted">
                                • {experience.city ?? "—"}{experience.state ? `, ${experience.state}` : ""}
                            </Text>
                        )}
                    </HStack>

                    {experience.description && (
                        <Text noOfLines={3}>{experience.description}</Text>
                    )}
                </CardBody>
            </Card>

            {/* Confirmação de exclusão */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="surface">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" bg="surfaceSubtle">
                            Remover experiência
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Tem certeza que deseja remover esta experiência? Esta ação não poderá ser desfeita.
                        </AlertDialogBody>

                        <AlertDialogFooter bg="surfaceSubtle">
                            <Button ref={cancelRef} onClick={onClose} variant="outline" mr={3}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={confirmDelete} isLoading={deleting}>
                                Remover
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};
