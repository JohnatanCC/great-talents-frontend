import {
    Box,
    Button,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
    type ButtonProps,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { toastTemplate } from "@/templates/toast";
import EducationCandidateService from "@/services/Candidate/EducationCandidateService";
import { validationNewEducationForm } from "@/validations/education.validation";
import type { SelectOption } from "@/types/main.types";
import InputForm from "@/components/UI/InputForm";
import { SelectForm } from "@/components/UI/SelectForm";
import TextareaForm from "@/components/UI/TexareaForm";


interface EducationForm {
    institution: string;
    course: string;
    startDate: string;
    endDate: string;
    educationStatus: SelectOption | null;
    description: string;
}

const ModalForm: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    refresh: VoidFunction;
    currentEducationId: number | null;
}> = ({ isOpen, onClose, refresh, currentEducationId }) => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        control,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EducationForm>({
        defaultValues: {
            institution: "",
            course: "",
            startDate: "",
            endDate: "",
            educationStatus: null,
            description: "",
        },
        resolver: (yupResolver(validationNewEducationForm) as any),
    });


    const onSubmit: SubmitHandler<EducationForm> = async (data) => {
        try {
            setIsLoading(true);

            const body = {
                institution: data.institution,
                course: data.course,
                start_date: data.startDate,
                end_date: data.endDate,
                formation_status: data.educationStatus?.value ?? "",
                description: data.description,
            };

            if (!currentEducationId) await EducationCandidateService.create(body);
            else await EducationCandidateService.update(body, currentEducationId);

            toast(
                toastTemplate({
                    description: "Formação salva com sucesso!",
                    status: "success",
                })
            );
            refresh();
            onClose();
        } catch {
            toast(toastTemplate({ description: "Erro", status: "error" }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentEducationId) {
            EducationCandidateService.findOne(currentEducationId).then((response) => {
                setValue("institution", response.institution);
                setValue("course", response.course);
                setValue("startDate", response.start_date);
                setValue("endDate", response.end_date || "");
                setValue("educationStatus", {
                    label: response.formation_status,
                    value: response.formation_status,
                });
                setValue("description", response.description);
            });
        }
    }, [currentEducationId, setValue]);

    const title = currentEducationId ? "Editar formação acadêmica" : "Nova formação acadêmica";

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(6px)" />
            <ModalContent bg="surface" overflow="hidden">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader bgGradient="linear(to-r, brand.600, brand.400)" color="white" py={3}>
                        {title}
                    </ModalHeader>
                    <ModalCloseButton color="white" _hover={{ opacity: 0.9 }} />

                    <ModalBody bg="surface" py={5}>
                        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                <InputForm
                                    {...register("institution")}
                                    label="Nome da instituição (No máximo 60 caracteres)"
                                    type="text"
                                    errorMessage={errors.institution?.message}
                                />
                            </GridItem>

                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                <InputForm
                                    {...register("course")}
                                    label="Curso (No máximo 60 caracteres)"
                                    type="text"
                                    errorMessage={errors.course?.message}
                                />
                            </GridItem>

                            <GridItem>
                                <InputForm
                                    {...register("startDate")}
                                    label="Data de Início"
                                    type="date"
                                    errorMessage={errors.startDate?.message}
                                />
                            </GridItem>

                            <GridItem>

                                <InputForm
                                    label="Data de Conclusão"
                                    type="date"
                                    {...register("endDate")}
                                    errorMessage={errors.endDate?.message}
                                />
                            </GridItem>

                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                <Controller
                                    name="educationStatus"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectForm
                                            {...(field as any)}
                                            value={field.value ?? null}
                                            label="Status da educação"
                                            placeholder="Selecione um status"
                                            options={[
                                                { label: "Cursando", value: "CURSANDO" },
                                                { label: "Completo", value: "COMPLETO" },
                                                { label: "Incompleto", value: "INCOMPLETO" },
                                                { label: "Trancado", value: "TRANCADO" },
                                            ]}
                                            onChangeSelect={(_n: any, opt: SelectOption) => field.onChange(opt)}
                                            errorMessage={errors.educationStatus?.message}
                                        />
                                    )}
                                />
                            </GridItem>

                            <GridItem colSpan={{ base: 1, md: 2 }}>
                                <TextareaForm
                                    label="Descrição"
                                    placeholder="Principais atividades, ênfases, projetos relevantes…"
                                    minH="110px"
                                    resize="vertical"
                                    {...register("description")}
                                    errorMessage={errors.description?.message}
                                />
                            </GridItem>
                        </Grid>
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

const EducationButton: React.FC<ButtonProps> = ({ onClick, ...rest }) => (
    <Button w="140px" colorScheme="brand" onClick={onClick} {...rest}>
        Adicionar
    </Button>
);

type EducationContentProps = {
    refresh: VoidFunction;
    currentEducationId: number | null;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const EducationModalContainer: React.FC<EducationContentProps> = ({
    refresh,
    currentEducationId,
    isOpen,
    onOpen,
    onClose,
}) => {
    return (
        <Box>
            <EducationButton onClick={onOpen} />
            <ModalForm
                isOpen={isOpen}
                onClose={onClose}
                refresh={refresh}
                currentEducationId={currentEducationId}
            />
        </Box>
    );
};

export default EducationModalContainer;
