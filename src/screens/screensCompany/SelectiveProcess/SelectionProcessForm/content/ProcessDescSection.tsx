import TextareaForm from "@/components/UI/TexareaForm"
import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react"
import type { UseFormRegister } from "react-hook-form"


interface ProcessDescSectionProps {
    register: UseFormRegister<any>
}

export const ProcessDescSection = ({ register }: ProcessDescSectionProps) => {
    return (
        <Card>
            <CardHeader pb={0}>
                <Heading size="md" fontWeight="semibold">Descrição do processo</Heading>
                <Text color="muted">Adicione uma descrição detalhada do processo seletivo para atrair os melhores candidatos.</Text>
            </CardHeader>
            <CardBody>
                <TextareaForm
                    label="Escreva uma descrição para vaga"
                    {...register("description")}
                />
                <TextareaForm
                    label="Escreva mais informações extra"
                    {...register("extra_information")}
                />
            </CardBody>
        </Card>
    )
}