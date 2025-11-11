import React from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    Heading,
    HStack,
    Link as ChakraLink,
    SimpleGrid,
    Stack,
    Text,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

// SVGs (URL ou componente SVGR)
import Profile from "../../../assets/ilustrations/profile.svg";
import Resume from "../../../assets/ilustrations/resume.svg";
import Opportunities from "../../../assets/ilustrations/opportunities.svg";
import MyOpportunities from "../../../assets/ilustrations/my-opportunities.svg";

type IllustrationType = React.ElementType | string;

interface FeatureTileProps {
    title: string;
    description: string;
    to: string;
    illustration: IllustrationType;
    illustrationAlt?: string;
    cta?: string;
}

/** Card compacto + ilustração fora do card (lado direito em ≥ md) */
const FeatureTile: React.FC<FeatureTileProps> = ({
    title,
    description,
    to,
    illustration,
    illustrationAlt,
    cta = "Acessar",
}) => {
    const IllusNode =
        typeof illustration === "string" ? (
            <Box
                as="img"
                src={illustration}
                alt={illustrationAlt ?? title}
                w={{ md: 40, lg: 48 }}  // ilustração maior
                h="auto"
                loading="lazy"
            />
        ) : (
            React.createElement(illustration as React.ElementType, {
                width: 220,
                height: 220,
                "aria-hidden": true,
            })
        );

    return (
        <Grid
            borderRadius="lg"
            bg="surface"
            templateColumns={{ base: "1fr", md: "1fr auto" }}
            gap={{ base: 3, md: 6 }}
            alignItems="center"
            boxShadow="md"
        >
            {/* Card de conteúdo (mais compacto) */}
            <GridItem p={4}>
                <Card
                    boxShadow="none"
                    h="full"
                    bg="surfaceSubtle"
                >
                    <CardBody>
                        <Stack spacing={{ base: 3, md: 3 }}>
                            <Heading as="h3" size="md">
                                {title}
                            </Heading>
                            <Text color="muted" lineHeight="1.6">
                                {description}
                            </Text>
                            <Button
                                as={RouterLink}
                                to={to}
                                variant="link"
                                borderRadius="md"
                                colorScheme="orange"
                                alignSelf="flex-start"
                            >
                                {cta}
                            </Button>
                        </Stack>
                    </CardBody>
                </Card>
            </GridItem>

            {/* Ilustração grande fora do card (só em >= md) */}
            <GridItem display={{ base: "none", sm: "none", md: "block" }}>
                {IllusNode}
            </GridItem>
        </Grid >
    );
};

// ===================== Página Home =====================
const CandidateHome: React.FC = () => {
    return (
        <Box>
            <Stack spacing={6}>
                <Box>
                    <Heading as="h1" size="lg">
                        Bem-vindo(a) ao Great Talents
                    </Heading>
                    <Text color="muted" mt={1}>
                        Comece por aqui: crie seu currículo, explore vagas e mantenha seu perfil atualizado.
                    </Text>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FeatureTile
                        title="Meu Currículo"
                        description="Monte e atualize seu currículo com rapidez. Deixe-o atraente para empresas e compartilhe quando quiser."
                        to="/candidato/curriculo"
                        illustration={Resume}
                        illustrationAlt="Ilustração de currículo"
                        cta="Ir para Currículo"
                    />

                    <FeatureTile
                        title="Minhas Vagas"
                        description="Acompanhe as vagas nas quais você se candidatou, veja o status e próximos passos."
                        to="/candidato/minhas-vagas"
                        illustration={MyOpportunities}
                        illustrationAlt="Ilustração de vagas do candidato"
                        cta="Ver minhas vagas"
                    />

                    <FeatureTile
                        title="Ver Vagas"
                        description="Descubra oportunidades compatíveis com seu perfil. Use filtros para encontrar a vaga ideal."
                        to="/ver-vagas"
                        illustration={Opportunities}
                        illustrationAlt="Ilustração de pesquisa de vagas"
                        cta="Explorar vagas"
                    />

                    <FeatureTile
                        title="Meu Perfil"
                        description="Complete suas informações pessoais e profissionais para melhorar suas recomendações."
                        to="/candidato/meu-perfil"
                        illustration={Profile}
                        illustrationAlt="Ilustração de perfil do usuário"
                        cta="Editar perfil"
                    />
                </SimpleGrid>
            </Stack>
        </Box>
    );
};

export default CandidateHome;