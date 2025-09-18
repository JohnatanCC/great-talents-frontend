import React from "react"
import {
    Button,
    Flex,
    Heading,
    HStack,
    IconButton,
    Text,
    VStack,
    useColorMode,
    Box,
} from "@chakra-ui/react"
import { ArrowBackIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"
import { keyframes } from "@emotion/react"

// Animações
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const glitch = keyframes`
  0%, 100% { text-shadow: 0 0 0 #ed6d3a, 0 0 0 #9158de; }
  25% { text-shadow: -2px 0 0 #ed6d3a, 2px 0 0 #9158de; }
  50% { text-shadow: 2px 0 0 #ed6d3a, -2px 0 0 #9158de; }
  75% { text-shadow: -1px 0 0 #ed6d3a, 1px 0 0 #9158de; }
`

export type NotFound404Props = {
    onBack?: () => void
    homeHref?: string
    subtitle?: string
}

export default function NotFound404({ onBack, homeHref = "/", subtitle }: NotFound404Props) {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Flex
            minH="100vh"
            color="text"
            align="center"
            justify="center"
            px={6}
            position="relative"
            overflow="hidden"
            sx={{
                background: `radial-gradient(60rem 60rem at 10% 20%, rgba(237, 109, 58, 0.25), transparent 50%),
                     radial-gradient(40rem 40rem at 70% 30%, rgba(145, 88, 22, 0.2), transparent 55%),
                     radial-gradient(50rem 50rem at 40% 80%, rgba(53, 16, 185, 0.18), transparent 55%),
                     linear-gradient(120deg, rgba(99,102,241,0.18), rgba(236,72,153,0.10))` as any,
            }}
        >
            {/* Elementos flutuantes de fundo */}
            <Box
                position="absolute"
                top="20%"
                left="10%"
                w="100px"
                h="100px"
                borderRadius="50%"
                bg="rgba(237, 109, 58, 0.1)"
                animation={`${float} 6s ease-in-out infinite`}
                zIndex={0}
            />
            <Box
                position="absolute"
                top="60%"
                right="15%"
                w="80px"
                h="80px"
                borderRadius="50%"
                bg="rgba(53, 16, 185, 0.1)"
                animation={`${float} 4s ease-in-out infinite reverse`}
                zIndex={0}
            />
            <Box
                position="absolute"
                bottom="20%"
                left="20%"
                w="60px"
                h="60px"
                borderRadius="50%"
                bg="rgba(145, 88, 22, 0.1)"
                animation={`${float} 5s ease-in-out infinite`}
                zIndex={0}
            />

            {/* Toggle de tema fixo */}
            <IconButton
                aria-label="Alternar tema"
                onClick={toggleColorMode}
                variant="ghost"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                position="fixed"
                top={4}
                right={4}
                _hover={{
                    transform: "rotate(180deg)",
                    transition: "transform 0.3s ease",
                }}
                zIndex={10}
            />

            <VStack spacing={6} textAlign="center" zIndex={1}>
                {/* Número 404 grande com efeito glitch */}
                <Box
                    fontSize={{ base: "8xl", md: "9xl" }}
                    fontWeight="black"
                    color="orange.400"
                    lineHeight={0.8}
                    animation={`${glitch} 2s infinite`}
                    _hover={{
                        animation: `${glitch} 0.5s infinite`,
                    }}
                >
                    404
                </Box>

                <VStack spacing={4} animation={`${fadeInUp} 0.8s ease-out`}>
                    <Heading
                        size="xs"
                        color="muted"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        opacity={0.7}
                    >
                        Erro 404
                    </Heading>

                    <Heading
                        as="h1"
                        size={{ base: "2xl", md: "3xl" }}
                        lineHeight={1.1}
                        bgGradient="linear(to-r, orange.400, purple.400)"
                        bgClip="text"
                        animation={`${pulse} 3s ease-in-out infinite`}
                    >
                        Página não encontrada
                    </Heading>

                    <Text
                        color="muted"
                        fontSize={{ base: "md", md: "lg" }}
                        maxW="md"
                        lineHeight={1.6}
                    >
                        {subtitle || "A página que você está tentando acessar não existe, foi movida ou está temporariamente indisponível."}
                    </Text>
                </VStack>

                <HStack
                    spacing={4}
                    pt={4}
                    animation={`${fadeInUp} 1s ease-out 0.3s both`}
                >
                    <Button
                        leftIcon={<ArrowBackIcon />}
                        variant="ghost"
                        onClick={onBack}
                        _hover={{
                            transform: "translateX(-5px)",
                            transition: "transform 0.2s ease",
                        }}
                    >
                        Voltar
                    </Button>
                    <Button
                        as="a"
                        href={homeHref}
                        variant="outline"
                        colorScheme="orange"
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(237, 109, 58, 0.3)",
                            transition: "all 0.2s ease",
                        }}
                        _active={{
                            transform: "translateY(0)",
                        }}
                    >
                        Ir para a Home
                    </Button>
                </HStack>

                <Text
                    fontSize="xs"
                    color="muted"
                    opacity={0.6}
                    animation={`${fadeInUp} 1.2s ease-out 0.5s both`}
                >
                    Código: 404 • Great Talents
                </Text>
            </VStack>
        </Flex>
    )
}
