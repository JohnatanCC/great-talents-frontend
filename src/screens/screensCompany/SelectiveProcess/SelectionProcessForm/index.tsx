import Layout from "@/Layout"
import { Button, Center, Flex, Heading, Stack, Text, useToast, VStack } from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState, useRef } from "react";
import type { SelectOption } from "@/types/main.types";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { contractTypesOptions, defaultValueNewSelectionProcess, educationOptions, workModalityOptions } from "@/constants/selectionProcess.constants";
import type { ContractTypeEnum, FormValuesNewSelectionProcess, ProfileEnum } from "@/types/selectionProcess.types";
import PositionService from "@/services/PositionService";
import BenefitsService from "@/services/BenefitsService";
import FacilityPcdService from "@/services/FacilityPcdService";
import SelectionProcessService from "@/services/SelectionProcessService";
import { isAxiosError, type AxiosError } from "axios";
import { toastTemplate } from "@/templates/toast";
import { defaultOptionSelect } from "@/constants/global.constants";
import { ufs } from "@/constants/states";
import { PCDSection } from "./content/PCDSection";
import { ProcessDescSection } from "./content/ProcessDescSection";
import { ProcessInfoSection } from "./content/ProcessInfoSection"
import { RequirementsSection } from "./content/RequirementsSection";
import { BenefitsSection } from "./content/BenefitsSection";

export const SelectionProcessForm = () => {
    const params = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const hasInitializedOptions = useRef(false);
    const hasInitializedEdit = useRef(false);

    const [isLoading, setIsLoading] = useState(false);

    const [benefitsOptions, setBenefitsOptions] = useState<SelectOption[]>([]);
    const [positionOptions, setPositionsOptions] = useState<SelectOption[]>([]);

    const [facilitiesPcdsOptions, setFacilitiesPcdsOptions] = useState<
        SelectOption[]
    >([]);

    const { register, watch, setValue, handleSubmit, control } = useForm<FormValuesNewSelectionProcess>({
        defaultValues: defaultValueNewSelectionProcess,
    });

    const {
        append: addRequirementsOriginal,
        remove: removeRequirementsOriginal,
        update: updateRequirementsOriginal,
    } = useFieldArray({
        control,
        name: "requirements",
    });

    // Functions originais sem logs
    const addRequirements = addRequirementsOriginal;
    const removeRequirements = removeRequirementsOriginal;
    const updateRequirements = updateRequirementsOriginal;

    const valuesForm = watch();

    // useEffects sem logs de monitoramento em tempo real

    const handleSelectItem = (valueSelected: ProfileEnum) =>
        setValue("profile", valueSelected);

    const getAllOptions = useCallback(async () => {
        if (hasInitializedOptions.current) return;
        hasInitializedOptions.current = true;

        try {
            console.log("🔄 [SelectionProcessForm] Carregando opções do formulário...");
            const [
                responsePositionOptions,
                responseBenefitOptions,
                responseFacilitiesPcdOptions,
            ] = await Promise.all([
                PositionService.getOptions(),
                BenefitsService.getOptions(),
                FacilityPcdService.getOptions(),
            ]);

            setPositionsOptions(responsePositionOptions);
            setBenefitsOptions(responseBenefitOptions);
            setFacilitiesPcdsOptions(responseFacilitiesPcdOptions);
        } catch (error) {
            console.error("❌ [SelectionProcessForm] Erro ao carregar opções:", error);
        }
    }, []);

    const handleAddNewSeletionProcess: SubmitHandler<
        FormValuesNewSelectionProcess
    > = async (data) => {
        try {
            setIsLoading(true);
            console.log("🔄 [SelectionProcessForm] Iniciando criação do processo seletivo...");
            console.log("📋 [SelectionProcessForm] Dados do formulário recebidos:", data);

            // Logs detalhados de cada seção do formulário
            console.group("📊 [SelectionProcessForm] Análise detalhada dos campos:");
            console.log("👤 Profile:", data.profile);
            console.log("📝 Título:", data.title);
            console.log("💼 Cargo (position_id):", data.position_id);
            console.log("📄 Tipo de contrato:", data.contract_type);
            console.log("🏢 Modalidade de trabalho:", data.work_modality);
            console.log("🎓 Educação:", data.education);
            console.log("💰 Mostrar salário:", data.show_salary);
            console.log("💵 Faixa salarial:", data.salary_range);
            console.log("📝 Descrição:", data.description);
            console.log("📋 Informações extras:", data.extra_information);
            console.log("🗺️ Estado:", data.state);
            console.log("🏙️ Cidade:", data.city);
            console.log("♿ É PCD:", data.is_pcd);
            console.log("📋 Requirements:", data.requirements);
            console.log("🎁 Benefits:", data.benefits);
            console.groupEnd();

            // Validação básica dos campos obrigatórios
            console.log("✅ [SelectionProcessForm] Iniciando validação dos campos obrigatórios...");
            if (!data.title?.trim()) {
                console.error("❌ [SelectionProcessForm] Erro de validação: Título é obrigatório");
                throw new Error("Título é obrigatório");
            }
            if (!data.position_id?.value) {
                console.error("❌ [SelectionProcessForm] Erro de validação: Cargo é obrigatório");
                throw new Error("Cargo é obrigatório");
            }
            if (!data.state?.value) {
                console.error("❌ [SelectionProcessForm] Erro de validação: Estado é obrigatório");
                throw new Error("Estado é obrigatório");
            }
            if (!data.city?.trim()) {
                console.error("❌ [SelectionProcessForm] Erro de validação: Cidade é obrigatória");
                throw new Error("Cidade é obrigatória");
            }
            console.log("✅ [SelectionProcessForm] Validação concluída com sucesso!");

            console.log("🔧 [SelectionProcessForm] Construindo body da requisição...");

            // Processamento detalhado dos requirements
            const processedRequirements = (data.requirements ?? [])
                .filter((item) => item.name?.trim());
            console.log("📋 [SelectionProcessForm] Requirements processados:", {
                original: data.requirements,
                filtered: processedRequirements,
                count: processedRequirements.length
            });

            // Processamento detalhado dos benefits
            const processedBenefits = (data.benefits ?? [])
                .filter((item) => item.value);
            console.log("🎁 [SelectionProcessForm] Benefits processados:", {
                original: data.benefits,
                filtered: processedBenefits,
                ids: processedBenefits.map((item) => String(item.value))
            });

            const body = {
                profile: data.profile as ProfileEnum,

                title: data.title.trim(),
                position_id: String(data.position_id.value),
                contract_type: data.contract_type?.value as ContractTypeEnum,
                work_modality: data.work_modality?.value as string,
                education: data.education?.value as string,

                show_salary: Boolean(data.show_salary),
                salary_range: data.salary_range || "",

                description: data.description?.trim() || "",
                extra_information: data.extra_information?.trim() || "",

                state: String(data.state.value),
                city: data.city.trim(),

                is_pcd: Boolean(data.is_pcd),
                requirements: processedRequirements.map((item) => ({
                    name: item.name.trim(),
                    required: Boolean(item.required),
                })),

                benefits_ids: processedBenefits.map((item) => String(item.value)),
            };

            console.group("📤 [SelectionProcessForm] Body final da requisição:");
            console.log("Dados completos:", body);
            console.log("Tamanho do JSON:", JSON.stringify(body).length, "caracteres");
            console.groupEnd();

            console.log("📤 [SelectionProcessForm] Enviando dados para API:", body);
            const response = await SelectionProcessService.create(body);
            console.log("✅ [SelectionProcessForm] Processo seletivo criado com sucesso:", response);

            toast({
                title: "Novo processo seletivo criado com sucesso",
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });

            navigate("/processos-seletivos");
        } catch (error) {
            console.group("❌ [SelectionProcessForm] Erro na criação do processo seletivo:");
            console.error("Erro completo:", error);
            console.error("Tipo do erro:", typeof error);

            const errors = error as Error | AxiosError;
            if (isAxiosError(errors)) {
                console.error("É um erro Axios:", {
                    status: errors.response?.status,
                    statusText: errors.response?.statusText,
                    data: errors.response?.data,
                    headers: errors.response?.headers,
                    config: {
                        url: errors.config?.url,
                        method: errors.config?.method,
                        data: errors.config?.data
                    }
                });
                toast(
                    toastTemplate({
                        status: "error",
                        title: errors.response?.data.message,
                    })
                );
            } else {
                console.error("É um erro genérico:", {
                    message: errors.message,
                    name: errors.name,
                    stack: errors.stack
                });
                toast(
                    toastTemplate({
                        status: "error",
                        title: "Erro ao criar novo processo seletivo",
                    })
                );
            }
            console.groupEnd();
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeSelect = (name: any, value: SelectOption) =>
        setValue(name, value);

    useEffect(() => {
        void getAllOptions();
    }, []);

    useEffect(() => {
        if (params.id && positionOptions.length && !hasInitializedEdit.current) {
            hasInitializedEdit.current = true;
            console.log("🔄 [SelectionProcessForm] Carregando dados para edição, ID:", params.id);
            SelectionProcessService.findOneToEdit(params.id).then((response) => {
                console.log("📊 [SelectionProcessForm] Dados recebidos para edição:", response);
                const positionOption = positionOptions.find(
                    (item) => String(item.value) === String(response.position_id)
                );
                const contractTypeOption = contractTypesOptions.find(
                    (item) => item.value === response.contract_type
                );
                const workModalityOption = workModalityOptions.find(
                    (item) => item.value === response.work_modality
                );
                const educationOption = educationOptions.find(
                    (item) => item.value === response.education
                );
                const ufOption = ufs.find((item) => item.value === response.state);

                setValue("profile", response.profile as ProfileEnum);
                setValue("title", response.title);
                setValue("position_id", positionOption || defaultOptionSelect);
                setValue("contract_type", contractTypeOption || defaultOptionSelect);
                setValue("work_modality", workModalityOption || defaultOptionSelect);
                setValue("education", educationOption || defaultOptionSelect);
                setValue("state", ufOption || defaultOptionSelect);
                setValue("city", response.city);
                setValue("show_salary", response.show_salary);
                setValue("salary_range", response.salary_range);
                setValue("description", response.description);
                setValue("extra_information", response.extra_information);

                setValue("is_pcd", response.is_pcd);
                //facilidades

                setValue(
                    "requirements",
                    (response.selection_process_requirements || [])
                        .filter((item) => item && typeof item.name === 'string') // Filtra apenas itens válidos
                        .map((item) => ({
                            name: item.name,
                            required: Boolean(item.required),
                        }))
                );

                setValue(
                    "benefits",
                    response.selection_process_benefits
                        .filter((item) => item.benefit && item.benefit.id) // Filtra apenas itens válidos
                        .map((item) => ({
                            label: item.benefit.description,
                            value: String(item.benefit.id), // Use benefit.id ao invés de item.id
                        }))
                );

                console.log("✅ [SelectionProcessForm] Dados carregados e formulário preenchido com sucesso");
            }).catch((error) => {
                console.error("❌ [SelectionProcessForm] Erro ao carregar dados para edição:", error);
                toast({
                    title: "Erro ao carregar dados do processo seletivo",
                    description: "Tente recarregar a página",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });
        }
    }, [params.id, positionOptions, toast]);

    return (
        <Layout>
            <Flex gap={4} flexDir="column">
                <VStack>
                    <Heading>Criando uma vaga</Heading>
                    <Text>Preencha as informações que deseja informar na sua vaga.</Text>
                </VStack>
                <form onSubmit={handleSubmit(handleAddNewSeletionProcess)}>
                    <Stack spacing={6}>
                        <ProcessInfoSection
                            currentValue={valuesForm.profile}
                            handleSelectItem={handleSelectItem}
                            control={control}
                            register={register}
                            handleChangeSelect={handleChangeSelect}
                            contractTypesOptions={contractTypesOptions}
                            positionOptions={positionOptions}
                            workModalityOptions={workModalityOptions}
                            educationOptions={educationOptions}
                            ufs={ufs}
                        />
                        <PCDSection
                            control={control}
                            values={valuesForm}
                            setValue={setValue}
                            facilitiesPcdsOptions={facilitiesPcdsOptions}
                            handleChangeSelect={handleChangeSelect}
                        />
                        <ProcessDescSection
                            register={register}
                        />

                        <RequirementsSection
                            requirements={(valuesForm.requirements || []).map((req, index) => ({
                                id: String(index),
                                name: req.name || "",
                                required: req.required
                            }))}
                            add={addRequirements}
                            remove={removeRequirements}
                            register={register}
                            update={updateRequirements}
                        />

                        <BenefitsSection
                            control={control}
                            benefitsOptions={benefitsOptions}
                            onChangeSelect={handleChangeSelect}
                        />
                        <Center>
                            <Button type="submit" isLoading={isLoading} colorScheme="brand">
                                Criar processo seletivo
                            </Button>
                        </Center>
                    </Stack>
                </form>
            </Flex>
        </Layout>
    )
}