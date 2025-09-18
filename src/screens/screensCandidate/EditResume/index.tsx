import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react"
import { Description } from "./contents/Description"
import Layout from "@/Layout"
import { Education } from "./contents/Education"
import { Experience } from "./contents/Experience"
import { Language } from "./contents/Language"
import { Software } from "./contents/Software"
const ResumeEdit = () => {
    return (
        <Layout>

            <Box mb={6}>
                <Heading as="h1" size="lg">
                    Editar Currículo
                </Heading>
                <Text color="GrayText">
                    Atualize suas informações profissionais e mantenha seu currículo sempre atualizado.
                </Text>
            </Box>
            <Flex direction="column" gap={6}>

                <Description />
                <Education />
                <Experience />
                <Language />
                <Software />
            </Flex>
        </Layout>
    )
}

export default ResumeEdit;