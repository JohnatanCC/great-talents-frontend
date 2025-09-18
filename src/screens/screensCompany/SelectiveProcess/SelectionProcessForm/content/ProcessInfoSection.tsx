import { Card, CardBody, CardHeader, Divider, Heading, Mark, SimpleGrid, Stack, Text, useToast } from "@chakra-ui/react"
import { ProfileSelectGroup } from "../components/ProfileSelectGroup"
import type { ProfileEnum } from "@/types/selectionProcess.types";
import InputForm from "@/components/UI/InputForm";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { SelectForm } from "@/components/UI/SelectForm";

interface ProcessInfoProps {
    currentValue: ProfileEnum;
    handleSelectItem: (value: ProfileEnum) => void;
    control: Control<any>;
    register: UseFormRegister<any>;
    handleChangeSelect: (name: string, value: any) => void;
    contractTypesOptions: any[];
    positionOptions: any[];
    workModalityOptions: any[];
    educationOptions: any[];
    ufs: any[];
}

export const ProcessInfoSection = ({
    currentValue,
    handleSelectItem,
    control,
    register,
    handleChangeSelect,
    contractTypesOptions,
    positionOptions,
    workModalityOptions,
    educationOptions,
    ufs
}: ProcessInfoProps) => {
    return (
        <Card>
            <CardHeader>
                <Heading size="md" fontWeight="semibold">Informações do processo</Heading>
                <Text>Preencha as informações abaixo para criar sua vaga.</Text>
            </CardHeader>
            <CardBody>
                <ProfileSelectGroup currentValue={currentValue}
                    handleSelectItem={handleSelectItem} />
                <Divider my={4} />
                <Text mb={2}>
                    campos com
                    <Mark color="red" mx={2} >
                        *
                    </Mark>
                    São obrigatórios
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

            </CardBody>
        </Card >
    )
}