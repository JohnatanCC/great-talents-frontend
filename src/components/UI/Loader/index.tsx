import {
    VStack,
    Text,
    Spinner,
    Box,
    useColorModeValue,
    Flex
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create ? motion.create(Box) : motion(Box);
const MotionVStack = motion.create ? motion.create(VStack) : motion(VStack);

interface LoaderProps {
    /**
     * Texto a ser exibido abaixo do spinner
     */
    message?: string;
    /**
     * Tamanho do spinner
     */
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    /**
     * Altura mínima do container
     */
    minHeight?: string;
    /**
     * Se deve ocupar toda a altura disponível
     */
    fullHeight?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
    message = "Carregando...",
    size = "lg",
    minHeight = "200px",
    fullHeight = false
}) => {
    const bgGradient = useColorModeValue(
        "linear(to-br, primary.50, warning.50)",
        "linear(to-br, bg, bg.muted)"
    );

    const textColor = "text.muted";

    return (
        <Flex
            align="center"
            justify="center"
            minH={fullHeight ? "100vh" : minHeight}
            w="full"
            bgGradient={bgGradient}
            borderRadius="xl"
            position="relative"
            overflow="hidden"
        >
            {/* Efeito de fundo animado */}
            <MotionBox
                position="absolute"
                top="50%"
                left="50%"
                w="200px"
                h="200px"
                bg="linear-gradient(45deg, rgba(255,107,53,0.1) 0%, rgba(255,210,63,0.1) 100%)"
                borderRadius="full"
                filter="blur(40px)"
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{
                    scale: [0.8, 1.2, 0.8],
                    rotate: [0, 180, 360]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ transform: "translate(-50%, -50%)" }}
            />

            <MotionVStack
                spacing={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                position="relative"
                zIndex={1}
            >
                <MotionBox
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="primary.500"
                        size={size}
                    />
                </MotionBox>

                <Text
                    fontSize="md"
                    fontWeight="medium"
                    color={textColor}
                    textAlign="center"
                >
                    {message}
                </Text>

                {/* Pontos animados */}
                <Flex gap={1}>
                    {[0, 1, 2].map((index) => (
                        <MotionBox
                            key={index}
                            w="8px"
                            h="8px"
                            bg="orange.400"
                            borderRadius="full"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: index * 0.2
                            }}
                        />
                    ))}
                </Flex>
            </MotionVStack>
        </Flex>
    );
};

export default Loader;
