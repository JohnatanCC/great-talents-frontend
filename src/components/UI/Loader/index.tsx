import {
    VStack,
    Text,
    Box,
    useColorModeValue,
    Flex,
    Image
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Logo from '@/assets/system-favicon.png'
const MotionBox = motion.create ? motion.create(Box) : motion(Box);

interface LoaderProps {
    /**
     * Texto a ser exibido abaixo do spinner
     */
    message?: string;
    /**
     * Tamanho do logo
     */
    size?: string;
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
    size = "60px",
}) => {

    return (
        <VStack spacing={2}>
            <MotionBox
                animate={{ rotate: -360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {/* Substitua o src pelo caminho da sua logo */}
                <Image
                    as="img"
                    src={Logo}
                    alt="Logo"
                    w={size}
                    h={size}
                />
            </MotionBox>

            <Text
                fontSize="md"
                fontWeight="medium"
                textAlign="center"
            >
                {message}
            </Text>
        </VStack>
    );
};

export default Loader;
