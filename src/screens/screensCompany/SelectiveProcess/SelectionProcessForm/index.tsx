import Layout from "@/Layout"
import { Button, Center, Flex, Heading, Stack, Text, useToast, VStack } from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
        fields: requirements,
        append: addRequirements,
        remove: removeRequirements,
        update: updateRequirements,
    } = useFieldArray({
        control,
        name: "requirements",
    });

    const valuesForm = watch();

    const handleSelectItem = (valueSelected: ProfileEnum) =>
        setValue("profile", valueSelected);

    const getAllOptions = async () => {
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
    };

    const handleAddNewSeletionProcess: SubmitHandler<
        FormValuesNewSelectionProcess
    > = async (data) => {
        try {
            setIsLoading(true);

            const body = {
                profile: data.profile as ProfileEnum,

                title: data.title,
                position_id: data.position_id?.value as string,
                contract_type: data.contract_type?.value as ContractTypeEnum,
                work_modality: data.work_modality?.value as string,
                education: data.education?.value as string,

                show_salary: data.show_salary,
                salary_range: data.salary_range,

                description: data.description || "",
                extra_information: data.extra_information || "",

                state: data.state?.value as string,
                city: data.city,


                is_pcd: data.is_pcd,
                requirements: (data.requirements ?? []).map((item) => ({
                    name: item.name ?? "",
                    required: item.required,
                })),

                benefits_ids: data.benefits?.map((item) => String(item.value)) || [],
            };

            await SelectionProcessService.create(body);

            toast({
                title: "Novo processo seletivo criado com sucesso",
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });

            navigate("/processos-seletivos");
        } catch (error) {
            const errors = error as Error | AxiosError;
            if (isAxiosError(errors)) {
                toast(
                    toastTemplate({
                        status: "error",
                        title: errors.response?.data.message,
                    })
                );
            } else {
                toast(
                    toastTemplate({
                        status: "error",
                        title: "Erro ao criar novo processo seletivo",
                    })
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeSelect = (name: any, value: SelectOption) =>
        setValue(name, value);

    useEffect(() => {
        getAllOptions();
    }, []);

    useEffect(() => {
        if (params.id && positionOptions.length) {
            SelectionProcessService.findOneToEdit(params.id).then((response) => {
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
                    response.selection_process_requirements.map((item) => ({
                        name: item.name,
                        required: item.required,
                    }))
                );

                setValue(
                    "benefits",
                    response.selection_process_benefits.map((item) => ({
                        label: item.benefit.description,
                        value: String(item.id),
                    }))
                );
            });
        }
    }, [params.id, positionOptions]);

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