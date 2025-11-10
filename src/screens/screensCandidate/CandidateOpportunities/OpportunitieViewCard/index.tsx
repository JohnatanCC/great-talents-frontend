import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
    AlertDialogOverlay, Badge, Button, Card, CardBody, CardFooter, CardHeader,
    HStack, Heading, Icon, Stack, Text,
    useDisclosure, useToast
} from "@chakra-ui/react";
import { Building2, ChevronRight, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import BoardService from "@/services/BoardService";
import { toastTemplate } from "@/templates/toast";
import type { Registration } from "@/types/registrations.types";

type Props = {
    registration: Registration;
    onChanged: VoidFunction; // chama load novamente após remover
};

const statusMeta = (raw?: string) => {
    const k = (raw || "").toUpperCase();
    if (k.includes("APROV")) return { scheme: "green", label: "Aprovado" };
    if (k.includes("DECLIN")) return { scheme: "red", label: "Removido" };
    if (k.includes("PAUS")) return { scheme: "purple", label: "Pausado" };
    return { scheme: "brand", label: raw || "Em processo" };
};

export function OpportunitieViewCard({ registration, onChanged }: Props) {
    const navigate = useNavigate();
    const toast = useToast();
    const confirm = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const s = statusMeta(registration.status);
    const canRemove = !(s.label === "Removido" || s.label === "Aprovado");

    const goDetails = () => navigate(`/candidato/processo-seletivo/${registration.id}/feedback`);

    const doRemove = async () => {
        try {
            await BoardService.decline(Number(registration.id));
            toast(toastTemplate({ status: "success", description: "Você se removeu deste processo." }));
            confirm.onClose();
            onChanged();
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Não foi possível remover.";
            toast(toastTemplate({ status: "error", description: msg }));
        }
    };

    return (
        <>
            <Card size="sm" bg="surfaceSubtle">
                <CardHeader pb={2}>
                    <Stack spacing={1}>
                        <HStack justify="space-between" align="start">
                            <Heading size="md" noOfLines={2}>{registration.title}</Heading>
                            <Badge colorScheme={s.scheme as any} variant="subtle">{s.label}</Badge>
                        </HStack>
                        <HStack color="muted" spacing={2}>
                            <Icon as={Building2} />
                            <Text fontWeight={600}>{registration.companyName}</Text>
                        </HStack>
                    </Stack>
                </CardHeader>

                <CardBody pt={0}>
                    <Text color="muted" fontSize="sm">
                        {/* Mostre um resumo simples; se houver outros campos, adicione-os aqui */}
                        Etapa atual: <Text as="span" fontWeight="bold">{registration.status}</Text>
                    </Text>
                </CardBody>

                <CardFooter pt={2}>
                    <HStack spacing={3}>
                        <Button colorScheme="orange" rightIcon={<Icon as={ChevronRight} />} onClick={goDetails}>
                            Andamento
                        </Button>

                        {canRemove && (
                            <Button
                                leftIcon={<Icon as={Trash2} />}
                                variant="outline"
                                colorScheme="red"
                                onClick={confirm.onOpen}
                            >
                                Remover
                            </Button>
                        )}
                    </HStack>
                </CardFooter>
            </Card>

            {/* Confirmação */}
            <AlertDialog isOpen={confirm.isOpen} leastDestructiveRef={cancelRef} onClose={confirm.onClose}>
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>Remover candidatura</AlertDialogHeader>
                    <AlertDialogBody>
                        Tem certeza que deseja remover-se deste processo seletivo?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={confirm.onClose} variant="outline">
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={doRemove} ml={3}>
                            Confirmar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
