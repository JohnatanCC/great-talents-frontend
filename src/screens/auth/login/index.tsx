// pages/Auth/Login.tsx
import {
    Box, Button, Card, CardBody, Center, Checkbox, Container, Divider,
    Flex, FormControl, FormErrorMessage, FormLabel, Heading, HStack,
    IconButton, Image, Input, InputGroup, InputRightElement, Link, Stack, Text,
    useColorMode, useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import LOGO from "@/assets/system_logo.png";
import { LogoImage } from "@/components/UI/Logo";

import React, { useState } from "react";
import { RecoveryPassword } from "../recoverPassword";
import { LoginFormSchema } from "@/validations/login.validation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import api from "@/services/api";
import { toastTemplate } from "@/templates/toast";

interface FormValues {
    email: string
    password: string
}

const MotionStack = motion(Stack);

export const Login = () => {
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();
    const show = useDisclosure();
    const [forgot, setForgot] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(LoginFormSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            const response = await api.post("/login", {
                email: data.email,
                password: data.password,
            });
            const { data: responseData } = response.data;

            setToken(responseData.token, responseData.role, responseData.name);

            if (responseData.role === "ADMIN") {
                navigate("/admin/empresas");
            } else if (responseData.role === "COMPANY") {
                navigate("/empresa/processos-seletivos/");
            } else if (responseData.role === "CANDIDATE") {
                navigate("/candidato/curriculo");
            }
        } catch (error) {
            toast(
                toastTemplate({
                    description: "Usuário ou senha inválidos",
                    status: "error",
                })
            );
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Flex minH="100vh" bg="bg" color="text">
            {/* Hero esquerdo omitido para foco no switch (mantenha o seu) */}
            <Box flex="1" display={{ base: "none", lg: "block" }} position="relative" overflow="hidden">
                <Box position="absolute" inset={0} sx={{
                    background:
                        `radial-gradient(60rem 60rem at 10% 20%, rgba(237, 109, 58, 0.25), transparent 50%),
             radial-gradient(40rem 40rem at 70% 30%, rgba(145, 88, 22, 0.25), transparent 55%),
             radial-gradient(50rem 50rem at 40% 80%, rgba(53, 16, 185, 0.25), transparent 55%),
             linear-gradient(120deg, rgba(99,102,241,0.25), rgba(236,72,153,0.25))` as any,
                }} />
                <Box position="absolute" inset={0} zIndex={1} bg="whiteAlpha.50" _dark={{ bg: "blackAlpha.500" }} />
                <Flex position="relative" zIndex={1} align="center" justify="center" h="full">
                    <Image src={LOGO} alt="Logo" w="auto" />
                </Flex>
            </Box>

            <Flex w={{ base: "full", lg: "520px" }} align="center" justify="center" p={{ base: 6, md: 10 }}>
                <Container maxW="md" p={0}>
                    <Center w="full" mb={6}><LogoImage /></Center>

                    <AnimatePresence mode="wait">
                        {!forgot ? (
                            <MotionStack
                                key="login"
                                spacing={6}
                                initial={{ y: -24, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -24, opacity: 0 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                                <HStack justify="space-between" align="center">
                                    <Heading size="lg">Acesse sua conta</Heading>
                                    <IconButton
                                        aria-label="Alternar tema"
                                        onClick={toggleColorMode}
                                        variant="ghost"
                                        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                                    />
                                </HStack>

                                <Text color="muted" fontSize="sm">
                                    Informe seu e-mail e senha para continuar
                                </Text>

                                <Stack as="form" spacing={5} onSubmit={handleSubmit(onSubmit)}>

                                    <FormControl isRequired isInvalid={!!errors.email}>
                                        <FormLabel>E-mail</FormLabel>
                                        <Input
                                            placeholder="seu e-mail"
                                            type="email"
                                            autoComplete="email"
                                            {...register("email", {
                                                required: "Informe seu e-mail",
                                                pattern: { value: /[^\s@]+@[^\s@]+\.[^\s@]+/, message: "E-mail inválido" },
                                            })}
                                        />
                                        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!errors.password}>
                                        <FormLabel>Senha</FormLabel>
                                        <InputGroup>
                                            <Input
                                                placeholder="Sua senha"
                                                type={show.isOpen ? "text" : "password"}
                                                autoComplete="current-password"
                                                {...register("password", {
                                                    required: "Informe sua senha",
                                                    minLength: { value: 6, message: "Mínimo de 6 caracteres" },
                                                })}
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    aria-label={show.isOpen ? "Ocultar senha" : "Mostrar senha"}
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={show.onToggle}
                                                    icon={show.isOpen ? <ViewOffIcon /> : <ViewIcon />}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                                    </FormControl>

                                    <HStack justify="space-between" align="center">

                                        <Button
                                            variant="link"
                                            colorScheme="brand"
                                            onClick={() => setForgot(true)}
                                        >
                                            Esqueci minha senha
                                        </Button>
                                    </HStack>

                                    <Button type="submit" isLoading={isLoading} colorScheme="brand">
                                        Entrar
                                    </Button>
                                </Stack>

                                <Card>
                                    <CardBody>
                                        <Center flexDir="column">
                                            <Text fontWeight="semibold">Não tem uma conta?</Text>
                                            <HStack spacing={3} mt={2}>
                                                <Button as={Link} href="/cadastro" variant="outline" colorScheme="brand">
                                                    Criar conta grátis
                                                </Button>
                                            </HStack>
                                        </Center>
                                    </CardBody>
                                </Card>
                            </MotionStack>
                        ) : (
                            <RecoveryPassword onBack={() => setForgot(false)} />
                        )}
                    </AnimatePresence>
                </Container>
            </Flex>
        </Flex>
    );
};
