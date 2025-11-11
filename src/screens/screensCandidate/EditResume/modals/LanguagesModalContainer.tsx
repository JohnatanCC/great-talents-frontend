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
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { defaultValuesNewLanguageForm } from "../../../../constants/languages.constants";
import { validationNewLanguageForm } from "../../../../validations/language.validation";
import type { DefaultValuesUseFormNewLanguage } from "../../../../types/language.types";
import CandidateLanguageService from "../../../../services/Candidate/CandidateLanguageService";
import { toastTemplate } from "../../../../templates/toast";
import type { SelectOption } from "../../../../types/main.types";
import InputForm from "@/components/UI/InputForm";
import { SelectForm } from "@/components/UI/SelectForm";
import { LEVEL_OPTIONS } from "@/utils/levelMapping";

/* =========================================================
   Modal Interno
========================================================= */
const ModalForm: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    refresh: () => void;
}> = ({ refresh, onClose, isOpen }) => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        setValue,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<DefaultValuesUseFormNewLanguage>({
        defaultValues: defaultValuesNewLanguageForm,
        resolver: yupResolver(validationNewLanguageForm),
    });

    const valuesForm = watch();

    const handleChangeSelect = (name: "level", value: SelectOption) =>
        setValue(name, value, { shouldDirty: true });

    const onSubmit: SubmitHandler<DefaultValuesUseFormNewLanguage> = async (data) => {
        try {
            setIsLoading(true);

            const body = {
                name: data.name,
                level: data.level.value.toString(),
            };

            await CandidateLanguageService.create(body);

            toast(
                toastTemplate({
                    description: "Idioma adicionado com sucesso!",
                    status: "success",
                })
            );

            refresh();
            onClose();
        } catch (error) {
            const err = error as Error | AxiosError<any>;
            if (axios.isAxiosError(err)) {
                toast(
                    toastTemplate({
                        description: err.response?.data?.message ?? "Erro ao adicionar idioma",
                        status: "error",
                    })
                );
            } else {
                toast(toastTemplate({ description: "Erro ao adicionar idioma", status: "error" }));
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
                        Novo idioma
                    </ModalHeader>
                    <ModalCloseButton color="white" _hover={{ opacity: 0.9 }} />

                    <ModalBody bg="surface" py={5}>
                        <Box w="100%" display="flex" gap={4} flexDirection="column">
                            <Flex gap={4}>
                                <InputForm
                                    {...register("name")}
                                    label="Idioma"
                                    placeholder="Ex.: Inglês"
                                    errorMessage={errors.name?.message}
                                />

                                {/* IMPORTANTE: SelectForm NÃO usa register. Use name/value/onChangeSelect */}
                                <SelectForm
                                    name="level"
                                    label="Nível"
                                    placeholder="Selecione o nível"
                                    options={LEVEL_OPTIONS}
                                    value={valuesForm.level}
                                    onChangeSelect={handleChangeSelect}
                                    errorMessage={errors.level?.message as string}
                                />
                            </Flex>
                        </Box>
                    </ModalBody>

                    <ModalFooter bg="surfaceSubtle" display="flex" gap={3} justifyContent="flex-start">
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

/* =========================================================
   Botão (abre o modal)
========================================================= */
const LanguageButton: React.FC<ButtonProps> = ({ onClick, ...rest }) => {
    return (
        <Button w="140px" colorScheme="brand" onClick={onClick} {...rest}>
            Adicionar
        </Button>
    );
};

/* =========================================================
   Container (controla abertura/fechamento)
========================================================= */
type LanguagesFormModalContentProps = {
    refresh(): void;
};

export const LanguagesModalContainer: React.FC<LanguagesFormModalContentProps> = ({ refresh }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <LanguageButton onClick={onOpen} />
            {isOpen && <ModalForm isOpen={isOpen} onClose={onClose} refresh={refresh} />}
        </>
    );
};
