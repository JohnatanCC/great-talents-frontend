import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Kbd,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Text,
    Textarea,
    useDisclosure,
    useToast,
    HStack,
    type ButtonProps,
} from "@chakra-ui/react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import CandidateDetailService from "../../../../services/Candidate/CandidateDetailService";

interface ResumeForm {
    resume: string;
}

/* ========================= Modal Interno ========================= */
const ModalForm: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const toast = useToast();
    const [fetching, setFetching] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        setValue,
        watch,
    } = useForm<ResumeForm>({
        defaultValues: { resume: "" },
    });

    const value = watch("resume") || "";
    const MAX = 1000;
    const remaining = MAX - value.length;

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await CandidateDetailService.findOne();
                if (mounted) setValue("resume", data.resume ?? "");
            } catch {
                // silencioso: manter vazio
            } finally {
                if (mounted) setFetching(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [setValue]);

    const onSubmit: SubmitHandler<ResumeForm> = async (data) => {
        try {
            await CandidateDetailService.update({ resume: data.resume?.trim() });
            toast({
                title: "Resumo atualizado",
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
            onClose();
        } catch {
            toast({
                title: "Ocorreu um erro!",
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            void handleSubmit(onSubmit)();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" motionPreset="scale">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(6px)" />
            <ModalContent overflow="hidden" bg="surface">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader
                        bgGradient={`linear(to-r, brand.600, brand.400)`}
                        color="white"
                        py={3}
                    >
                        Editar resumo
                    </ModalHeader>
                    <ModalCloseButton color="white" _hover={{ opacity: 0.9 }} />

                    <ModalBody bg="surface" py={5}>
                        <FormControl isInvalid={!!errors.resume}>
                            <FormLabel fontWeight="600">
                                Resumo <Text as="span" color="muted" fontWeight="normal">(máx. {MAX} caracteres)</Text>
                            </FormLabel>

                            {fetching ? (
                                <Skeleton h="120px" borderRadius="md" />
                            ) : (
                                <Textarea
                                    placeholder="Escreva aqui um resumo curto sobre você, resultados e objetivos (3–6 linhas)."
                                    resize="vertical"
                                    minH="120px"
                                    maxLength={MAX}
                                    onKeyDown={handleKey}
                                    {...register("resume", {
                                        required: "Campo obrigatório",
                                        validate: (v) =>
                                            (v?.trim()?.length ?? 0) > 0 || "Informe pelo menos 1 caractere",
                                    })}
                                />
                            )}

                            <HStack justify="space-between" mt={2}>
                                <FormHelperText>
                                    Dica: cite tecnologias/chaves, conquistas e o tipo de oportunidade.
                                    Para enviar rápido: <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>
                                </FormHelperText>
                                <Text fontSize="sm" color={remaining < 0 ? "red.500" : "muted"}>
                                    {value.length}/{MAX}
                                </Text>
                            </HStack>

                            <FormErrorMessage>{errors.resume?.message}</FormErrorMessage>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter bg="surfaceSubtle" gap={3}>
                        <Button
                            type="submit"
                            colorScheme="brand"
                            isLoading={isSubmitting}
                            isDisabled={fetching || remaining < 0 || (!isDirty && value.trim().length === 0)}
                        >
                            Confirmar
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

/* ========================= Botão de Abertura ========================= */
const ResumeButton: React.FC<ButtonProps> = ({ onClick, ...rest }) => (
    <Button w="140px" colorScheme="brand" onClick={onClick} {...rest}>
        Editar
    </Button>
);

/* ========================= Container (API estável) ========================= */
export const EditAboutCandidateModalContainer: React.FC<{ refresh: () => void }> = ({ refresh }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleClose = () => {
        refresh(); // mantém comportamento original
        onClose();
    };

    return (
        <Box>
            <ResumeButton onClick={onOpen} />
            {isOpen && <ModalForm isOpen={isOpen} onClose={handleClose} />}
        </Box>
    );
};
