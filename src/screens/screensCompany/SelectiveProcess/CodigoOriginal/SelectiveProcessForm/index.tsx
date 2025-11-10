import { ProfileSelectGroup } from "../components/ProfileSelectGroup";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Divider, Mark, SimpleGrid, Stack, Switch, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { AxiosError, isAxiosError } from "axios";
import { RequirementsSection } from "../components/RequirementsSection";
import { SelectOption } from "../../../types/main.types";
import { contractTypesOptions, defaultValueNewSelectionProcess, educationOptions, workModalityOptions } from "../../../constants/selectionProcess.constants";
import { ContractTypeEnum, FormValuesNewSelectionProcess, ProfileEnum } from "../../../types/selectionProcess.types";
import PositionService from "../../../services/PositionService";
import FacilityPcdService from "../../../services/FacilityPcdService";
import BenefitsService from "../../../services/BenefitsService";
import SelectionProcessService from "../../../services/SelectionProcessService";
import { toastTemplate } from "../../../templates/toast";
import { defaultOptionSelect } from "../../../constants/global.constants";
import { Scard } from "../../../components/Scard";
import InputForm from "../../../components/Input";
import { SelectForm } from "../../../components/Select";
import TextareaForm from "../../../components/Textarea";
import { ufs } from "../../../constants/states";

const SelectiveProcessForm = () => {
  const params = useParams();
  const toast = useToast();
  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(false);

  const [benefitsOptions, setBenefitsOptions] = useState<SelectOption[]>([]);
  const [positionOptions, setPositionsOptions] = useState<SelectOption[]>([]);

  const [facilitiesPcdsOptions, setFacilitiesPcdsOptions] = useState<
    SelectOption[]
  >([]);

  const { register, watch, setValue, handleSubmit, control } = useForm({
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
    <Container maxW="full">
      <form onSubmit={handleSubmit(handleAddNewSeletionProcess)}>
        <Stack gap="2rem">
          <Scard
            title="Informações do Processo"
            bodyContent={
              <Stack>
                <ProfileSelectGroup
                  currentValue={valuesForm.profile}
                  handleSelectItem={handleSelectItem}
                />
                <Divider borderColor="var(--border-emphasized)" my={2} />
                <Text>
                  <Mark mr={2} variant="text" color="red.500">
                    *
                  </Mark>
                  campos obrigatórios
                </Text>
                <SimpleGrid gap={4} columns={{ base: 1, sm: 1, md: 3 }}>
                  <InputForm
                    {...register("title")}
                    label="Título"
                    placeholder="Insira o Título"
                    required
                  />
                  <Controller
                    name="contract_type"
                    control={control}
                    render={({ field }) => (
                      <SelectForm
                        {...field}
                        label="Tipo de contrato"
                        options={contractTypesOptions}
                        required
                        onChangeSelect={handleChangeSelect}
                      />
                    )}
                  />

                  <Controller
                    name="position_id"
                    control={control}
                    render={({ field }) => (
                      <SelectForm
                        {...field} // Conecta o react-select ao React Hook Form
                        label="Cargo"
                        options={positionOptions}
                        onChangeSelect={handleChangeSelect}
                        required
                      />
                    )}
                  />

                </SimpleGrid>

                <SimpleGrid gap={4} columns={{ base: 1, sm: 2 }}>
                  <Controller
                    name="work_modality"
                    control={control}
                    render={({ field }) => (
                      <SelectForm
                        {...field}
                        label="Modalidade"
                        options={workModalityOptions}
                        required
                        onChangeSelect={handleChangeSelect}
                      />
                    )}
                  />
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <SelectForm
                        {...field}
                        label="Escolaridade"
                        options={educationOptions}
                        required
                        onChangeSelect={handleChangeSelect}
                      />
                    )}
                  />
                </SimpleGrid>




                <SimpleGrid gap={4} columns={{ base: 1, md: 2 }}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <SelectForm
                        {...field} // Conecta o react-select ao React Hook Form
                        label="Estado"
                        options={ufs}
                        required
                        onChangeSelect={handleChangeSelect}
                      />
                    )}
                  />
                  <InputForm {...register("city")} label="Cidade" required />
                </SimpleGrid>

                <Stack flexDirection="row">
                  <Box w="5px" h="Full" rounded="sm" bg="var(--orange-muted)" />
                  <Stack flexDirection="column">
                    <Switch
                      w="fit-content"
                      borderWidth={1}
                      borderColor="var(--border-emphasized)"
                      bg="var(--bg-muted)"
                      p={2}
                      rounded="md"
                      colorScheme="orange"
                      isChecked={valuesForm.show_salary}
                      onChange={(event) =>
                        setValue("show_salary", event.target.checked)
                      }
                    >
                      Mostrar Faixa salarial ?
                    </Switch>
                    {valuesForm.show_salary && (
                      <InputForm
                        {...register("salary_range")}
                        label="Faixa salarial"
                        placeholder="Quantidade desejada"
                      />
                    )}
                  </Stack>
                </Stack>

              </Stack>
            }
          />


          <Scard title="Informações adicionais para PCDs" bodyContent={
            <Stack flexDirection="row">
              <Box w="5px" h="Full" rounded="sm" bg="var(--orange-muted)" />
              <Stack >
                <Switch
                  w="fit-content"
                  borderWidth={1}
                  borderColor="var(--border-emphasized)"
                  bg="var(--bg-muted)"
                  p={2}
                  rounded="md"
                  colorScheme="orange"
                  isChecked={valuesForm.is_pcd}
                  onChange={(event) => setValue("is_pcd", event.target.checked)}

                >
                  É uma vaga para PCD ?
                </Switch>
                {valuesForm.is_pcd && (
                  <>
                    <Text fontWeight="bold">Facilidades para PCDs</Text>
                    <Controller
                      name="facilitiesPcds"
                      control={control}
                      render={({ field }) => (
                        <SelectForm
                          {...field} // Conecta o react-select ao React Hook Form
                          onChangeSelect={handleChangeSelect}
                          name="facilitiesPcds"
                          options={facilitiesPcdsOptions}
                          isMulti
                        />
                      )}
                    />
                  </>
                )}
              </Stack>
            </Stack>
          } />

          <Scard
            title="Descrição do processo"
            bodyContent={
              <Stack gap={0}>
                <TextareaForm
                  label="Escreva uma descrição para vaga"
                  {...register("description")}
                />
                <TextareaForm
                  label="Escreva mais informações extra"
                  {...register("extra_information")}
                />
              </Stack>
            }
          />

          <RequirementsSection
            requirements={requirements}
            add={addRequirements}
            remove={removeRequirements}
            register={register}
            update={updateRequirements}
          />

          <Scard title="Benefícios oferecidos ao candidatos" bodyContent=
            {
              <Stack gap={2}>
                <Text>Benefícios</Text>
                <SimpleGrid columns={{ base: 1, sm: 1, md: 3 }}>
                  <Controller
                    name="benefits"
                    control={control}
                    render={({ field }) => (
                      <SelectForm
                        {...field}
                        options={benefitsOptions}
                        onChangeSelect={handleChangeSelect}
                        isMulti
                      />
                    )}
                  />
                </SimpleGrid>
              </Stack>
            } />

          <Button type="submit" isLoading={isLoading} className="fit-content" colorScheme="green">
            Criar processo seletivo
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default SelectiveProcessForm;
