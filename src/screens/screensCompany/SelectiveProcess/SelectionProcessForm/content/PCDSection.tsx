// src/pages/SelectionProcess/content/PCDInfo.tsx
import { Card, CardHeader, CardBody, Heading, Text, Stack, Box, Switch } from "@chakra-ui/react"
import { Controller, type Control, type UseFormSetValue } from "react-hook-form"
import { SelectForm } from "@/components/UI/SelectForm"
import type { SelectOption } from "@/types/main.types"

type PCDInfoProps = {
    /** control do react-hook-form */
    control: Control<any>
    /** snapshot dos valores do formulário (watch) */
    values: any
    /** setter do RHF para atualizar campos */
    setValue: UseFormSetValue<any>
    /** opções vindas do backend pra facilidades PCD */
    facilitiesPcdsOptions: SelectOption[]
    /** handler padrão que você já usa p/ selects */
    handleChangeSelect: (name: string, value: any) => void
}

export const PCDSection: React.FC<PCDInfoProps> = ({
    control,
    values,
    setValue,
    facilitiesPcdsOptions,
    handleChangeSelect,
}) => {
    return (
        <Card>
            <CardHeader pb={0}>
                <Heading size="md" fontWeight="semibold">Vaga para PCD</Heading>
                <Text color="muted">Selecione se a vaga é destinada para Pessoas com Deficiência (PCD).</Text>
            </CardHeader>

            <CardBody>
                <Stack direction="row" align="flex-start" spacing={4}>
                    <Stack background="brandAlpha.200" borderLeft="3px solid" p={2} borderColor="orange.500" spacing={4} flex={1}>
                        <Switch
                            w="fit-content"
                            colorScheme="orange"
                            isChecked={!!values.is_pcd}
                            onChange={(e) => setValue("is_pcd", e.target.checked)}
                        >
                            É uma vaga para PCD?
                        </Switch>

                        {values.is_pcd && (
                            <Stack spacing={2}>
                                <Text fontWeight="semibold">Facilidades para PCDs</Text>

                                {/* Multi-select controlado pelo RHF */}
                                <Controller
                                    name="facilitiesPcds"
                                    control={control}
                                    render={({ field }) => (
                                        <SelectForm
                                            {...field}
                                            isMulti
                                            options={facilitiesPcdsOptions}
                                            onChangeSelect={(opt: any) => handleChangeSelect("facilitiesPcds", opt)}
                                            placeholder="Selecione uma ou mais facilidades"
                                        />
                                    )}
                                />
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </CardBody>
        </Card>
    )
}
