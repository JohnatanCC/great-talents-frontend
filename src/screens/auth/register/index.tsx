import { useState } from "react"
import {
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Image,
    Progress,
    Stack,
    Switch,
    Text,
    useColorMode,
    useToast,
} from "@chakra-ui/react"
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon, MoonIcon, SunIcon } from "@chakra-ui/icons"
import { FormProvider, useForm, Controller, type SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import ReCaptchaField from "@/components/UI/ReCaptchaField";
import * as yup from "yup"
import { useNavigate } from "react-router-dom"
import CandidateService from "@/services/CandidateService"
import { toastTemplate } from "@/templates/toast"

// ====== SEUS COMPONENTES CUSTOMIZADOS ======
import LOGO from "@/assets/system_logo.png"
import AvatarUploader from "@/components/UI/AvatarUploader"
import InputForm from "@/components/UI/InputForm"
import { SelectForm } from "@/components/UI/SelectForm"

// ====== TIPOS ======
export type SelectOption = { label: string; value: string }

export interface RegisterForm {
    // Foto
    avatar_url?: string
    avatar_file?: File | null

    // Conta / pessoais
    name: string
    email: string
    password: string
    contact: string
    date_birth: string
    genre?: SelectOption | null
    is_pcd: boolean
    pcd_description?: string

    // Escolaridade
    education?: SelectOption | null

    // Experiência
    company_name?: string
    position?: string
    start?: string
    end?: string

    // Endereço
    cep: string
    state?: SelectOption | null
    city: string
    neighborhood: string
    street: string
    number?: string
    complement?: string

    // consentimentos
    terms?: boolean
}

// ====== DADOS AUXILIARES ======
const UF_LIST: SelectOption[] = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
].map((uf) => ({ label: uf, value: uf }))

const GENDER_OPTS: SelectOption[] = [
    { label: "Masculino", value: "M" },
    { label: "Feminino", value: "F" },
    { label: "Prefiro não informar", value: "N" },
]

const EDUCATION_OPTS: SelectOption[] = [
    { label: "Ensino Fundamental Incompleto", value: "fundamental_incompleto" },
    { label: "Ensino Fundamental Completo", value: "fundamental_completo" },
    { label: "Ensino Médio Incompleto", value: "medio_incompleto" },
    { label: "Ensino Médio Completo", value: "medio_completo" },
    { label: "Ensino Superior Incompleto", value: "superior_incompleto" },
    { label: "Ensino Superior Completo", value: "superior_completo" },
    { label: "Cursando Ensino Fundamental", value: "fundamental_cursando" },
    { label: "Cursando Ensino Médio", value: "medio_cursando" },
    { label: "Cursando Ensino Superior", value: "superior_cursando" },
]

// ====== SCHEMAS POR ETAPA ======
const stepSchemas = [
    // 0) Conta & foto
    yup.object({
        name: yup.string().min(3).required("Informe seu nome"),
        email: yup.string().email("E-mail inválido").required("Informe seu e-mail"),
        password: yup.string().min(6, "Mínimo 6 caracteres").required("Crie uma senha"),
    }),
    // 1) Dados pessoais
    yup.object({
        contact: yup.string().min(10, "Informe seu telefone").required("Telefone obrigatório"),
        date_birth: yup.string().required("Data de nascimento obrigatória"),
        genre: yup.object().nullable().required("Informe seu gênero"),
        education: yup.object().nullable().required("Selecione a escolaridade"),
    }),
    // 2) Endereço
    yup.object({
        cep: yup.string().matches(/^\d{8}$/g, "CEP com 8 dígitos").required("CEP obrigatório"),
        state: yup.object().nullable().required("UF obrigatória"),
        city: yup.string().required("Cidade obrigatória"),
        neighborhood: yup.string().required("Bairro obrigatório"),
        street: yup.string().required("Endereço obrigatório"),
    }),
    // 3) Experiência (opcional, mas se preencher empresa exige cargo e início)
    yup.object({
        company_name: yup.string().optional(),
        position: yup.string().when("company_name", (val, sch: any) => (val?.[0] ? sch.required("Informe o cargo") : sch.optional())),
        start: yup.string().when("company_name", (val, sch: any) => (val?.[0] ? sch.required("Informe a data de início") : sch.optional())),
        end: yup.string().optional(),
        terms: yup.boolean().oneOf([true], "Você precisa aceitar os termos"),
    }),
] as const

const defaultValues: RegisterForm = {
    avatar_url: undefined,
    avatar_file: null,
    name: "",
    email: "",
    password: "",
    contact: "",
    date_birth: "",
    genre: null,
    is_pcd: false,
    pcd_description: "",
    education: null,
    company_name: "",
    position: "",
    start: "",
    end: "",
    cep: "",
    state: null,
    city: "",
    neighborhood: "",
    street: "",
    number: "",
    complement: "",
    terms: false,
}

// ====== COMPONENTE ======
export default function Register() {
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
    const { colorMode, toggleColorMode } = useColorMode()
    const toast = useToast()
    const [step, setStep] = useState(0)

    const methods = useForm<RegisterForm>({
        defaultValues,
        mode: "onTouched",
        resolver: yupResolver(stepSchemas[step] as any),
    })

    const {
        handleSubmit,
        register,
        setValue,
        control,
        formState: { errors, isSubmitting },
        watch,
        trigger,
    } = methods

    const values = watch()

    // Navegação
    const isFirst = step === 0
    const isLast = step === 3

    const next = async () => {
        const valid = await trigger()
        if (!valid) return
        setStep((s) => Math.min(s + 1, 3))
    }
    const back = () => setStep((s) => Math.max(s - 1, 0))

    const navigate = useNavigate()

    // Submit final
    const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
        if (!recaptchaToken) {
            toast({ title: "Valide o reCAPTCHA", status: "warning" });
            return;
        }

        // se informou empresa na última experiência, exige cargo e data de início
        if (data.company_name?.trim()) {
            if (!data.position?.trim() || !data.start) {
                toast(
                    toastTemplate({
                        title:
                            "Por favor, preencha os campos de cargo e data de início na última experiência.",
                        status: "warning",
                    })
                )
                return
            }
        }

        try {
            // envia payload semelhante ao código antigo; inclui recaptchaToken
            await CandidateService.create({ ...data, recaptchaToken } as any)

            toast(
                toastTemplate({
                    title: "Cadastro realizado com sucesso!",
                    status: "success",
                })
            )
            navigate("/")
        } catch (e) {
            toast(
                toastTemplate({
                    title: "Erro ao cadastrar",
                    status: "error",
                })
            )
        }
    }



    return (
        <Flex minH="100vh" bg="bg" color="text">
            {/* Lado esquerdo — hero */}
            <Box flex="1" display={{ base: "none", lg: "block" }} position="relative" overflow="hidden">
                <Box position="absolute" inset={0} sx={{
                    background: `radial-gradient(60rem 60rem at 10% 20%, rgba(237, 109, 58, 0.22), transparent 50%),
                       radial-gradient(40rem 40rem at 70% 30%, rgba(145, 88, 22, 0.18), transparent 55%),
                       radial-gradient(50rem 50rem at 40% 80%, rgba(53, 16, 185, 0.14), transparent 55%),
                       linear-gradient(120deg, rgba(99,102,241,0.12), rgba(236,72,153,0.08))` as any,
                }} />
                <Flex position="relative" zIndex={1} align="center" justify="center" h="full">
                    <Image src={LOGO} alt="Logo" w="auto" />
                </Flex>
            </Box>

            {/* Painel direito — wizard */}
            <Flex w={{ base: "full", lg: "620px" }} align="center" justify="center" p={{ base: 6, md: 10 }}>
                <Container maxW="md" p={0}>
                    <HStack justify="space-between" align="center" mb={6}>
                        <Heading size="lg">Crie sua conta</Heading>
                        <IconButton aria-label="Alternar tema" onClick={toggleColorMode} variant="ghost" icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} />
                    </HStack>

                    {/* Stepper simples */}
                    <HStack spacing={2} mb={4}>
                        {["Conta", "Pessoais", "Endereço", "Experiência"].map((label, idx) => (
                            <Flex key={label} align="center" gap={2}>
                                <Box w={8} h={2} rounded="full" bg={idx <= step ? "brand.500" : "stone.300"} _dark={{ bg: idx <= step ? "brand.300" : "stone.700" }} />
                                <Text fontSize="xs" color={idx === step ? "text" : "muted"}>{label}</Text>
                            </Flex>
                        ))}
                    </HStack>
                    <Progress value={(step + 1) * 25} mb={4} colorScheme="brand" borderRadius="full" />

                    <Card variant="unstyled">
                        <CardBody>
                            <FormProvider {...methods}>
                                <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={5}>
                                    {step === 0 && (
                                        <>
                                            <Text color="muted">Comece criando sua conta e adicionando sua foto.</Text>
                                            <HStack align="start" spacing={4}>
                                                <AvatarUploader
                                                    initialUrl={values.avatar_url}
                                                    onFileSelected={(file) => setValue("avatar_file", file)}
                                                    size={120}
                                                    maxSizeMB={5}
                                                />
                                                <Stack flex={1} spacing={4}>
                                                    <FormControl isRequired isInvalid={!!errors.name}>
                                                        <FormLabel>Nome</FormLabel>
                                                        <InputForm placeholder="Nome completo" {...register("name")} />
                                                        <FormErrorMessage>{errors.name?.message as any}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isRequired isInvalid={!!errors.email}>
                                                        <FormLabel>E-mail</FormLabel>
                                                        <InputForm type="email" placeholder="seu@email.com" {...register("email")} />
                                                        <FormErrorMessage>{errors.email?.message as any}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isRequired isInvalid={!!errors.password}>
                                                        <FormLabel>Senha</FormLabel>
                                                        <InputForm type="password" placeholder="Crie uma senha" {...register("password")} />
                                                        <FormErrorMessage>{errors.password?.message as any}</FormErrorMessage>
                                                    </FormControl>
                                                </Stack>
                                            </HStack>
                                        </>
                                    )}

                                    {step === 1 && (
                                        <>
                                            <Text color="muted">Preencha suas informações pessoais.</Text>
                                            <Stack spacing={4}>
                                                <FormControl isRequired isInvalid={!!errors.contact}>
                                                    <FormLabel>Contato</FormLabel>
                                                    <InputForm placeholder="Telefone ou WhatsApp" {...register("contact")} />
                                                    <FormErrorMessage>{errors.contact?.message as any}</FormErrorMessage>
                                                </FormControl>
                                                <FormControl isRequired isInvalid={!!errors.date_birth}>
                                                    <FormLabel>Data de Nascimento</FormLabel>
                                                    <InputForm type="date" placeholder="Sua data" {...register("date_birth")} />
                                                    <FormErrorMessage>{errors.date_birth?.message as any}</FormErrorMessage>
                                                </FormControl>
                                                <Controller name="genre" control={control} render={({ field }) => (
                                                    <FormControl isRequired isInvalid={!!errors.genre}>
                                                        <FormLabel>Gênero</FormLabel>
                                                        <SelectForm {...(field as any)} label="" options={GENDER_OPTS} placeholder="Selecione"
                                                            value={field.value ?? null}
                                                            onChangeSelect={(_name: any, opt: any) => field.onChange(opt)} errorMessage={errors.genre?.message as any} />
                                                        <FormErrorMessage>{errors.genre?.message as any}</FormErrorMessage>
                                                    </FormControl>
                                                )} />

                                                <HStack align="center" justify="space-between">
                                                    <Switch colorScheme="orange" isChecked={values.is_pcd} onChange={(e) => setValue("is_pcd", e.target.checked)}>
                                                        Sou PCD
                                                    </Switch>
                                                    <Box flex={1} />
                                                </HStack>

                                                {values.is_pcd && (
                                                    <FormControl>
                                                        <FormLabel>Qual a sua necessidade?</FormLabel>
                                                        <InputForm placeholder="Descrição da necessidade" {...register("pcd_description")} />
                                                    </FormControl>
                                                )}

                                                <Controller name="education" control={control} render={({ field }) => (
                                                    <FormControl isRequired isInvalid={!!errors.education}>
                                                        <FormLabel>Escolaridade</FormLabel>
                                                        <SelectForm {...(field as any)} label="" options={EDUCATION_OPTS} placeholder="Selecione"
                                                            value={field.value ?? null}
                                                            onChangeSelect={(_name: any, opt: any) => field.onChange(opt)} errorMessage={errors.education?.message as any} />
                                                        <FormErrorMessage>{errors.education?.message as any}</FormErrorMessage>
                                                    </FormControl>
                                                )} />
                                            </Stack>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <Text color="muted">Informe seu endereço para oportunidades próximas a você.</Text>
                                            <Stack spacing={4}>
                                                <FormControl isRequired isInvalid={!!errors.cep}>
                                                    <FormLabel>CEP</FormLabel>
                                                    <InputForm placeholder="00000-000" {...register("cep")} />
                                                    <FormErrorMessage>{errors.cep?.message as any}</FormErrorMessage>
                                                </FormControl>
                                                <HStack spacing={4}>
                                                    <Controller name="state" control={control} render={({ field }) => (
                                                        <FormControl isRequired isInvalid={!!errors.state}>
                                                            <FormLabel>Estado</FormLabel>
                                                            <SelectForm {...(field as any)} label="" options={UF_LIST} placeholder="UF"
                                                                value={field.value ?? null}
                                                                onChangeSelect={(_name: any, opt: any) => field.onChange(opt)} errorMessage={errors.state?.message as any} />
                                                            <FormErrorMessage>{errors.state?.message as any}</FormErrorMessage>
                                                        </FormControl>
                                                    )} />
                                                    <FormControl isRequired isInvalid={!!errors.city}>
                                                        <FormLabel>Cidade</FormLabel>
                                                        <InputForm placeholder="Sua cidade" {...register("city")} />
                                                        <FormErrorMessage>{errors.city?.message as any}</FormErrorMessage>
                                                    </FormControl>
                                                </HStack>
                                                <HStack spacing={4}>
                                                    <FormControl isRequired isInvalid={!!errors.neighborhood}>
                                                        <FormLabel>Bairro</FormLabel>
                                                        <InputForm placeholder="Seu bairro" {...register("neighborhood")} />
                                                        <FormErrorMessage>{errors.neighborhood?.message as any}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isRequired isInvalid={!!errors.street}>
                                                        <FormLabel>Endereço</FormLabel>
                                                        <InputForm placeholder="Rua/Av." {...register("street")} />
                                                        <FormErrorMessage>{errors.street?.message as any}</FormErrorMessage>
                                                    </FormControl>
                                                </HStack>
                                                <HStack spacing={4}>
                                                    <FormControl>
                                                        <FormLabel>Número</FormLabel>
                                                        <InputForm placeholder="Número" {...register("number")} />
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Complemento</FormLabel>
                                                        <InputForm placeholder="Apto, bloco, ref." {...register("complement")} />
                                                    </FormControl>
                                                </HStack>
                                            </Stack>
                                        </>
                                    )}

                                    {step === 3 && (
                                        <>
                                            <Text color="muted">Adicione sua última experiência (opcional) e finalize.</Text>
                                            <HStack spacing={4}>
                                                <FormControl>
                                                    <FormLabel>Nome da empresa</FormLabel>
                                                    <InputForm placeholder="Empresa" {...register("company_name")} />
                                                </FormControl>
                                                <FormControl isInvalid={!!errors.position}>
                                                    <FormLabel>Cargo</FormLabel>
                                                    <InputForm placeholder="Cargo" {...register("position")} />
                                                    <FormErrorMessage>{errors.position?.message as any}</FormErrorMessage>
                                                </FormControl>
                                            </HStack>
                                            <HStack spacing={4}>
                                                <FormControl isInvalid={!!errors.start}>
                                                    <FormLabel>Data de início</FormLabel>
                                                    <InputForm type="date" {...register("start")} />
                                                    <FormErrorMessage>{errors.start?.message as any}</FormErrorMessage>
                                                </FormControl>
                                                <FormControl>
                                                    <FormLabel>Data de término (opcional)</FormLabel>
                                                    <InputForm type="date" {...register("end")} />
                                                </FormControl>
                                            </HStack>

                                            <Box pt={2}>
                                                <ReCaptchaField
                                                    siteKey={SITE_KEY}
                                                    error={!recaptchaToken ? "Confirme que você não é um robô" : undefined}
                                                    onVerify={(token) => setRecaptchaToken(token)}
                                                    onExpired={() => setRecaptchaToken(null)}
                                                />
                                            </Box>

                                            <HStack mt={4}>
                                                <Switch isChecked={values.terms} onChange={(e) => setValue("terms", e.target.checked)} />
                                                <Text fontSize="sm">Concordo com os Termos de Uso e a Política de Privacidade.</Text>
                                            </HStack>
                                        </>
                                    )}

                                    {/* Navegação */}
                                    <HStack pt={2} justify="space-between">
                                        <Button leftIcon={<ArrowBackIcon />} onClick={back} variant="ghost" isDisabled={isFirst}>Voltar</Button>
                                        {isLast ? (
                                            <Button rightIcon={<CheckIcon />} isDisabled={!recaptchaToken} colorScheme="brand" type="submit" isLoading={isSubmitting}>Concluir cadastro</Button>
                                        ) : (
                                            <Button rightIcon={<ArrowForwardIcon />} colorScheme="brand" onClick={next}>Continuar</Button>
                                        )}
                                    </HStack>
                                </Stack>
                            </FormProvider>
                        </CardBody>
                    </Card>

                    <Text mt={6} fontSize="xs" color="muted" textAlign="center">
                        Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                    </Text>
                </Container>
            </Flex>
        </Flex>
    )
}
