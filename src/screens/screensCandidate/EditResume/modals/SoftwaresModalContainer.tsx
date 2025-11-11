import {
    Box,
    Button,
    type ButtonProps,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import { useState, type KeyboardEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { toastTemplate } from "../../../../templates/toast";
import CandidateSoftwareService from "../../../../services/Candidate/CandidateSoftwareService";

import type { SelectOption } from "../../../../types/main.types";
import { defaultValuesNewSoftwareForm } from "../../../../constants/softwares.constants";
import { validationNewSoftwareForm } from "../../../../validations/software.validation";
import InputForm from "@/components/UI/InputForm";
import { SelectForm } from "@/components/UI/SelectForm";
import { SOFTWARE_LEVEL_OPTIONS } from "@/utils/levelMapping";

/* ------------ Tipos do formulário (nivel com SelectOption) ------------ */
interface NewSoftwareForm {
    name: string;
    level: SelectOption; // SelectOption no form; convertemos para string ao enviar
    // Se quiser suportar versão depois:
    // version?: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    refresh: () => void;
}

/* =========================== Modal =========================== */
const ModalForm: React.FC<ModalProps> = ({ refresh, onClose, isOpen }) => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<NewSoftwareForm>({
        defaultValues: defaultValuesNewSoftwareForm as NewSoftwareForm,
        resolver: yupResolver(validationNewSoftwareForm),
    });

    const values = watch();

    const handleChangeSelect = (name: keyof NewSoftwareForm, value: SelectOption) =>
        setValue(name, value, { shouldDirty: true, shouldValidate: true });

    const onKeyDown = (
        e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
    ) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            void handleSubmit(onSubmit)();
        }
    };

    const onSubmit: SubmitHandler<NewSoftwareForm> = async (data) => {
        try {
            setIsLoading(true);

            const body = {
                name: data.name,
                level: data.level.value, // <-- converte SelectOption -> string
                // version: data.version?.trim() || undefined,
            };

            await CandidateSoftwareService.create(body);

            toast(
                toastTemplate({
                    status: "success",
                    description: "Habilidade adicionada com sucesso!",
                })
            );

            refresh();
            onClose();
        } catch (error) {
            const err = error as Error | AxiosError;
            if (axios.isAxiosError(err)) {
                toast(
                    toastTemplate({
                        status: "error",
                        description: err.response?.data?.message || "Erro ao adicionar habilidade",
                    })
                );
            } else {
                toast(toastTemplate({ status: "error", description: "Ocorreu um erro" }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(6px)" />
            <ModalContent bg="surface" overflow="hidden">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader bgGradient="linear(to-r, brand.600, brand.400)" color="white" py={3}>
                        Nova habilidade
                    </ModalHeader>
                    <ModalCloseButton color="white" _hover={{ opacity: 0.9 }} />

                    <ModalBody minH="30vh" bg="surface" py={5}>
                        <Box w="100%" display="flex" gap="2rem" flexDirection="column">
                            <Flex gap="1.75rem">
                                <InputForm
                                    {...register("name")}
                                    label="Habilidade"
                                    placeholder="Ex.: React, Figma, Excel…"
                                    errorMessage={errors.name?.message}
                                    onKeyDown={onKeyDown}
                                />

                                <SelectForm
                                    label="Nível"
                                    name="level"
                                    options={SOFTWARE_LEVEL_OPTIONS}
                                    value={values.level}
                                    onChangeSelect={handleChangeSelect}
                                    errorMessage={errors.level?.message as string}
                                />
                            </Flex>

                            {/* Se precisar de "versão" depois:
              <Flex gap="1.75rem">
                <InputForm
                  {...register("version")}
                  label="Versão (opcional)"
                  placeholder="Ex.: 2021, v7, 365..."
                  onKeyDown={onKeyDown}
                />
              </Flex>
              */}
                        </Box>
                    </ModalBody>

                    <ModalFooter bg="surfaceSubtle" display="flex" gap={4} justifyContent="flex-start">
                        <Button colorScheme="brand" type="submit" isLoading={isLoading || isSubmitting}>
                            Confirmar
                        </Button>
                        <Button onClick={onClose} variant="outline">
                            Cancelar
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

/* =================== Container + Botão =================== */
const SoftwareButton: React.FC<ButtonProps> = ({ onClick, ...rest }) => {
    return (
        <Button w="140px" colorScheme="brand" onClick={onClick} {...rest}>
            Adicionar
        </Button>
    );
};

type SoftwaresFormModalContentProps = {
    refresh(): void;
};

export const SoftwaresModalContainer: React.FC<SoftwaresFormModalContentProps> = ({
    refresh,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <SoftwareButton onClick={onOpen} />
            {isOpen && <ModalForm isOpen={isOpen} onClose={onClose} refresh={refresh} />}
        </>
    );
};
