import React from "react";
import {
    Box,
    VStack,
    Text,
    Button,
    useColorModeValue,
    Flex,
    Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Search, FolderOpen, Plus, RefreshCw } from "lucide-react";

const MotionBox = motion.create ? motion.create(Box) : motion(Box);
const MotionVStack = motion.create ? motion.create(VStack) : motion(VStack);

interface NoDataFoundProps {
    /**
     * Título principal da mensagem
     */
    title?: string;
    /**
     * Descrição/subtítulo
     */
    description?: string;
    /**
     * Ícone a ser exibido (componente do lucide-react)
     */
    icon?: React.ComponentType;
    /**
     * Texto do botão de ação
     */
    actionButtonText?: string;
    /**
     * Callback quando o botão de ação é clicado
     */
    onActionClick?: () => void;
    /**
     * Altura mínima do container
     */
    minHeight?: string;
    /**
     * Tipo de contexto para definir ícone e mensagem padrão
     */
    context?: "search" | "empty" | "error" | "create";
}

export const NoDataFound: React.FC<NoDataFoundProps> = ({
    title,
    description,
    icon,
    actionButtonText,
    onActionClick,
    minHeight = "300px",
    context = "empty"
}) => {
    const bgGradient = useColorModeValue(
        "linear(to-br, bg.subtle, secondary.50)",
        "linear(to-br, bg, bg.muted)"
    );

    const textColor = "text.muted";
    const titleColor = "text";

    // Define ícone e textos padrão baseado no contexto
    const getContextDefaults = () => {
        switch (context) {
            case "search":
                return {
                    defaultIcon: Search,
                    defaultTitle: "Nenhum resultado encontrado",
                    defaultDescription: "Tente ajustar os filtros de busca ou usar termos diferentes.",
                    defaultButtonText: "Limpar filtros"
                };
            case "create":
                return {
                    defaultIcon: Plus,
                    defaultTitle: "Nenhum item cadastrado",
                    defaultDescription: "Comece criando o primeiro item da lista.",
                    defaultButtonText: "Criar novo"
                };
            case "error":
                return {
                    defaultIcon: RefreshCw,
                    defaultTitle: "Erro ao carregar dados",
                    defaultDescription: "Ocorreu um problema ao carregar as informações. Tente novamente.",
                    defaultButtonText: "Tentar novamente"
                };
            default:
                return {
                    defaultIcon: FolderOpen,
                    defaultTitle: "Nenhum dado encontrado",
                    defaultDescription: "Não há informações disponíveis no momento.",
                    defaultButtonText: "Atualizar"
                };
        }
    };

    const defaults = getContextDefaults();
    const IconComponent = icon || defaults.defaultIcon;
    const finalTitle = title || defaults.defaultTitle;
    const finalDescription = description || defaults.defaultDescription;
    const finalButtonText = actionButtonText || defaults.defaultButtonText;

    return (
        <Flex
            align="center"
            justify="center"
            minH={minHeight}
            w="full"
            bgGradient={bgGradient}
            borderRadius="xl"
            position="relative"
            overflow="hidden"
            p={6}
        >
            {/* Efeito de fundo animado */}
            <MotionBox
                position="absolute"
                top="50%"
                left="50%"
                w="150px"
                h="150px"
                bg={useColorModeValue(
                    "linear-gradient(45deg, rgba(66,153,225,0.1) 0%, rgba(159,122,234,0.1) 100%)",
                    "linear-gradient(45deg, rgba(66,153,225,0.05) 0%, rgba(159,122,234,0.05) 100%)"
                )}
                borderRadius="full"
                filter="blur(30px)"
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{
                    scale: [0.8, 1.1, 0.8],
                    rotate: [0, -180, -360]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ transform: "translate(-50%, -50%)" }}
            />

            <MotionVStack
                spacing={6}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                position="relative"
                zIndex={1}
                textAlign="center"
                maxW="400px"
            >
                {/* Ícone animado */}
                <MotionBox
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.4
                    }}
                >
                    <Box
                        p={4}
                        bg="bg.surface"
                        borderRadius="full"
                        boxShadow="lg"
                        border="1px solid"
                        borderColor="border"
                    >
                        <Icon
                            as={IconComponent}
                            w={8}
                            h={8}
                            color="text.disabled"
                        />
                    </Box>
                </MotionBox>

                {/* Título */}
                <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={titleColor}
                >
                    {finalTitle}
                </Text>

                {/* Descrição */}
                <Text
                    fontSize="md"
                    color={textColor}
                    lineHeight="1.6"
                >
                    {finalDescription}
                </Text>

                {/* Botão de ação (se fornecido) */}
                {onActionClick && (
                    <MotionBox
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            bg="secondary"
                            color="white"
                            _hover={{ 
                                bg: "secondary.600",
                                transform: "translateY(-2px)",
                                boxShadow: "lg"
                            }}
                            variant="solid"
                            size="md"
                            onClick={onActionClick}
                            leftIcon={<Icon as={IconComponent} w={4} h={4} />}
                            transition="all 0.2s"
                        >
                            {finalButtonText}
                        </Button>
                    </MotionBox>
                )}
            </MotionVStack>
        </Flex>
    );
};

export default NoDataFound;