import {
    Box,
    Button,
    Card,
    CardBody,
    Center,
    Checkbox,
    Container,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack,
    Text,
    useColorMode,
    useDisclosure,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import LOGO from "@/assets/system_logo.png";
import { LogoImage } from "@/components/UI/Logo";

/**
 * LoginPage — layout inspirado na Rocketseat, sem social login
 * • Split layout: Hero (esquerda) + Painel de login (direita)
 * • Visual minimalista usando tokens do tema (stone + brand/secondary)
 * • Foco sutil, campos com estados de erro e botão com loading
 */

type FormData = {
    email: string;
    password: string;
    remember?: boolean;
};

export const Login = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const show = useDisclosure();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: { email: "", password: "", remember: true },
        mode: "onBlur",
    });

    async function onSubmit(values: FormData) {
        await new Promise((r) => setTimeout(r, 900));
        console.log("login", values);
        // redirecionar...
    }

    return (
        <Flex minH="100vh" bg="bg" color="text">
            {/* Lado esquerdo — hero/ilustração */}
            <Box
                flex="1"
                display={{ base: "none", lg: "block" }}
                position="relative"
                overflow="hidden"
            >
                <Box
                    position="absolute"
                    inset={0}
                    // Swirls/gradients suaves
                    sx={{
                        background:
                            `radial-gradient(60rem 60rem at 10% 20%, rgba(237, 109, 58, 0.25), transparent 50%),
               radial-gradient(40rem 40rem at 70% 30%, rgba(145, 88, 22, 0.2), transparent 55%),
               radial-gradient(50rem 50rem at 40% 80%, rgba(53, 16, 185, 0.18), transparent 55%),
               linear-gradient(120deg, rgba(99,102,241,0.18), rgba(236,72,153,0.10))` as any,
                    }}
                />
                <Flex position="relative" zIndex={1} align="center" justify="center" h="full">

                    <Image src={LOGO} alt="Logo" w="auto" />

                </Flex>
            </Box>

            {/* Painel direito — formulário */}
            <Flex w={{ base: "full", lg: "520px" }} align="center" justify="center" p={{ base: 6, md: 10 }}>
                <Container maxW="md" p={0}>
                    <Center w="full" mb={6}>
                        <LogoImage />
                    </Center>

                    <Stack spacing={6}>
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
                                <Checkbox defaultChecked {...register("remember")}>Lembrar de mim</Checkbox>
                                <Link href="#" fontSize="sm" color="brand.600" _dark={{ color: "brand.300" }}>
                                    Esqueci minha senha
                                </Link>
                            </HStack>

                            <Button type="submit" isLoading={isSubmitting} colorScheme="brand">
                                Entrar
                            </Button>
                        </Stack>


                        <Card >
                            <CardBody>
                                <Center flexDir="column" >
                                    <Text fontWeight="semibold">Não tem uma conta?</Text>
                                    <HStack spacing={3} mt={2}>
                                        <Button as={Link} href="/cadastro" variant="outline" colorScheme="brand">
                                            Criar conta grátis
                                        </Button>
                                    </HStack>
                                </Center>
                            </CardBody>
                        </Card>

                        <Divider />
                        <Text fontSize="xs" color="muted" textAlign="center">
                            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                        </Text>
                    </Stack>
                </Container>
            </Flex>
        </Flex >
    );
}
