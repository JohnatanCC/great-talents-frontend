// src/components/UI/ComponentDemo.tsx
// Este arquivo demonstra como usar os componentes Loader e NoDataFound

import React, { useState } from "react";
import {
    Box,
    VStack,
    Button,
    Text,
    Heading,
    Divider,
    useColorModeValue,
    SimpleGrid,
} from "@chakra-ui/react";
import Loader from "./Loader";
import NoDataFound from "./NoDataFound";

export const ComponentDemo: React.FC = () => {
    const [showLoader, setShowLoader] = useState(false);
    const bgColor = useColorModeValue("gray.50", "gray.900");

    const simulateLoading = () => {
        setShowLoader(true);
        setTimeout(() => setShowLoader(false), 3000);
    };

    return (
        <Box p={8} bg={bgColor} minH="100vh">
            <VStack spacing={8} maxW="1200px" mx="auto">
                <Heading textAlign="center">Demonstração dos Componentes</Heading>

                {/* Seção Loader */}
                <Box w="full">
                    <Heading size="md" mb={4}>Componente Loader</Heading>
                    <Text mb={4} color="gray.600">
                        Loader moderno com animações suaves e efeitos visuais elegantes.
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6}>
                        {/* Loader padrão */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Loader Padrão</Text>
                            <Box h="200px">
                                <Loader message="Carregando dados..." />
                            </Box>
                        </Box>

                        {/* Loader com altura personalizada */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Loader Compacto</Text>
                            <Box h="150px">
                                <Loader
                                    message="Processando..."
                                    size="md"
                                    minHeight="150px"
                                />
                            </Box>
                        </Box>
                    </SimpleGrid>

                    {/* Loader em tela cheia (simulação) */}
                    <Button onClick={simulateLoading} colorScheme="blue" mb={4}>
                        Simular Carregamento (3s)
                    </Button>

                    {showLoader && (
                        <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex={9999}>
                            <Loader
                                message="Carregando aplicação..."
                                fullHeight
                                size="xl"
                            />
                        </Box>
                    )}
                </Box>

                <Divider />

                {/* Seção NoDataFound */}
                <Box w="full">
                    <Heading size="md" mb={4}>Componente NoDataFound</Heading>
                    <Text mb={4} color="gray.600">
                        Componente para exibir estados vazios com diferentes contextos e ações.
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                        {/* Contexto de busca */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Contexto: Busca Sem Resultados</Text>
                            <NoDataFound
                                context="search"
                                onActionClick={() => alert("Limpando filtros...")}
                            />
                        </Box>

                        {/* Contexto de criação */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Contexto: Lista Vazia</Text>
                            <NoDataFound
                                context="create"
                                onActionClick={() => alert("Criando novo item...")}
                            />
                        </Box>

                        {/* Contexto de erro */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Contexto: Erro no Carregamento</Text>
                            <NoDataFound
                                context="error"
                                onActionClick={() => alert("Tentando novamente...")}
                            />
                        </Box>

                        {/* Personalizado */}
                        <Box>
                            <Text fontWeight="bold" mb={2}>Totalmente Personalizado</Text>
                            <NoDataFound
                                title="Ops! Algo deu errado"
                                description="Não foi possível carregar os dados. Verifique sua conexão e tente novamente."
                                actionButtonText="Recarregar página"
                                onActionClick={() => window.location.reload()}
                            />
                        </Box>
                    </SimpleGrid>
                </Box>

                <Divider />

                {/* Guia de uso */}
                <Box w="full">
                    <Heading size="md" mb={4}>Como Usar</Heading>

                    <VStack align="start" spacing={4}>
                        <Box>
                            <Text fontWeight="bold">Loader:</Text>
                            <Text fontSize="sm" color="gray.600">
                                • Use para indicar carregamento de dados<br />
                                • Propriedades: message, size, minHeight, fullHeight<br />
                                • Exemplo: {`<Loader message="Carregando..." size="lg" />`}
                            </Text>
                        </Box>

                        <Box>
                            <Text fontWeight="bold">NoDataFound:</Text>
                            <Text fontSize="sm" color="gray.600">
                                • Use para estados vazios ou sem dados<br />
                                • Contextos automáticos: search, create, error, empty<br />
                                • Exemplo: {`<NoDataFound context="search" onActionClick={handleClearFilters} />`}
                            </Text>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default ComponentDemo;