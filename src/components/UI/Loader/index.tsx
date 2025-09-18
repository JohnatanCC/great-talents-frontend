// components/Loader.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Flex,
    Spinner,
    Text,
    Progress,
    Portal,
    useColorModeValue,
    VStack,
    HStack,
    Icon,
} from "@chakra-ui/react";
import { LucideTimer } from "lucide-react";

export interface LoaderProps {
    /** Mensagem opcional abaixo do spinner */
    message?: string;
    /** Modo tela cheia com backdrop */
    fullscreen?: boolean;
    /** Tempo mínimo de exibição para evitar flicker (ms) */
    minShowMs?: number;
    /** Dicas que alternam durante o carregamento */
    tips?: string[];
}

/**
 * Loader com cronômetro de carregamento (mm:ss) e barra indeterminada.
 * Mantém a mesma assinatura de import (export const Loader) usada no projeto.
 */
export const Loader: React.FC<LoaderProps> = ({
    message = "Carregando…",
    fullscreen = false,
    minShowMs = 500,
    tips,
}) => {
    const [visible, setVisible] = useState(minShowMs === 0);
    const [elapsedMs, setElapsedMs] = useState(0);
    const startRef = useRef<number>(Date.now());

    const panelBg = useColorModeValue("white", "gray.800");
    const panelBorder = useColorModeValue("gray.200", "whiteAlpha.200");
    const textMuted = useColorModeValue("gray.600", "gray.300");

    // Controle do cronômetro
    useEffect(() => {
        const tick = setInterval(() => {
            setElapsedMs(Date.now() - startRef.current);
        }, 100);
        return () => clearInterval(tick);
    }, []);

    // Evita flicker em carregamentos muito rápidos
    useEffect(() => {
        if (!visible) {
            const id = setTimeout(() => setVisible(true), minShowMs);
            return () => clearTimeout(id);
        }
    }, [visible, minShowMs]);

    // Tip rotativo a cada 4s
    const tip = useMemo(() => {
        if (!tips || tips.length === 0) return undefined;
        const idx = Math.floor(elapsedMs / 4000) % tips.length;
        return tips[idx];
    }, [tips, elapsedMs]);

    const mm = String(Math.floor(elapsedMs / 60000)).padStart(2, "0");
    const ss = String(Math.floor((elapsedMs % 60000) / 1000)).padStart(2, "0");

    const Content = (
        <Flex
            role="status"
            aria-busy="true"
            borderWidth={fullscreen ? 0 : 1}
            borderColor={panelBorder}
            bg={fullscreen ? "transparent" : panelBg}
            borderRadius={fullscreen ? undefined : "xl"}
            p={fullscreen ? 0 : 6}
            w={fullscreen ? "full" : { base: "full", sm: "md" }}
            maxW={fullscreen ? "full" : "lg"}
            direction="column"
            align="center"
            justify="center"
            boxShadow={fullscreen ? "none" : "md"}
        >
            <VStack spacing={4} w="full">
                <Spinner thickness="4px" speed="0.7s" emptyColor="gray.200" color="orange.400" size="xl" />

                <HStack spacing={2} color={textMuted}>
                    <Icon as={LucideTimer} />
                    <Text fontFamily="mono" fontWeight="semibold">{mm}:{ss}</Text>
                </HStack>

                <Text textAlign="center" color={textMuted} fontSize="sm">
                    {message}
                </Text>

                <Box w="full">
                    <Progress size="sm" isIndeterminate colorScheme="orange" borderRadius="full" />
                </Box>

                {tip && (
                    <Text pt={2} fontSize="xs" color={textMuted} textAlign="center">
                        {tip}
                    </Text>
                )}
            </VStack>
        </Flex>
    );

    if (!visible) return null;

    if (fullscreen) {
        return (
            <Portal>
                <Flex
                    position="fixed"
                    inset={0}
                    bg={useColorModeValue("blackAlpha.200", "blackAlpha.400")}
                    backdropFilter="blur(2px)"
                    zIndex={1400}
                    align="center"
                    justify="center"
                >
                    {Content}
                </Flex>
            </Portal>
        );
    }

    return <Box w="full">{Content}</Box>;
};

export default Loader;
