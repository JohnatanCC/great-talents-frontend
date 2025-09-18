import { SelectForm } from "@/components/UI/SelectForm"
import { Card, CardBody, CardHeader, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"
import type { SelectOption } from "@/types/main.types"

export interface BenefitsSectionProps {
    control: Control<any>;
    benefitsOptions: SelectOption[];
    onChangeSelect: (field: string, value: any) => void;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({
    control,
    benefitsOptions,
    onChangeSelect,
}) => {
    return (
        <Card>
            <CardHeader pb={0}>
                <Heading size="md" fontWeight="semibold" mb={4}>Benefícios</Heading>
                <Text color="GrayText">Adicione os benefícios oferecidos para a vaga.</Text>
            </CardHeader>
            <CardBody>
                <SimpleGrid columns={{ base: 1, sm: 1, md: 3 }}>
                    <Controller
                        name="benefits"
                        control={control}
                        render={({ field }) => (
                            <SelectForm
                                {...field}
                                options={benefitsOptions}
                                onChangeSelect={(value) => onChangeSelect("benefits", value)}
                                isMulti
                            />
                        )}
                    />
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}