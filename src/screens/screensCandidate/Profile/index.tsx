import React from "react"
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    IconButton,
    Input,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue,
    VStack,
    Avatar,
    FormControl,
    FormLabel,
    FormHelperText,
    useToast,
    Textarea,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { EditIcon } from "@chakra-ui/icons"
import InputForm from "@/components/UI/InputForm"
import { SelectForm } from "@/components/UI/SelectForm"
import { profileSchema } from "./schema"
import TextareaForm from "@/components/UI/TexareaForm"
import Layout from "@/Layout"
import AvatarUploader from "@/components/UI/AvatarUploader"
import { LEVEL_OPTIONS as IMPORTED_LEVEL_OPTIONS } from "@/utils/levelMapping"

/**
 * CandidateProfilePage
 *
 * Tela de Perfil do Candidato (Great Talents) usando Chakra UI v2.
 * Usa componentes personalizados de formulário do projeto:
 *  - InputForm (text)
 *  - Textarea (chakra) e TextareaForm (custom)
 *  - SelectForm (custom)
 *
 * Observações:
 * - Esta tela é auto-contida para simulação. Substitua os imports
 *   dos componentes customizados conforme o seu projeto.
 */

// === IMPORTS dos seus componentes customizados (ajuste paths) ===

// === Tipos ===
interface Address {
    cep: string
    state: string
    city: string
    district: string
    street: string
}

interface ProfileForm {
    fullname: string
    email: string
    cpf: string
    birth_date: string
    gender: "female" | "male" | "other" | "prefer_not" | ""
    phone: string
    address: Address
    resume: string
    description: string
    // Segurança (em card separado) – enviados apenas se preenchidos
    current_password?: string
    new_password?: string
    confirm_password?: string
    // Nível (exemplo de select genérico)
    level?: "beginner" | "intermediate" | "advanced" | "fluent" | ""
}

// === Mock de listas ===
const UF_LIST = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]

const GENDER_OPTIONS = [
    { value: "female", label: "Feminino" },
    { value: "male", label: "Masculino" },
    { value: "other", label: "Outro" },
    { value: "prefer_not", label: "Prefiro não informar" },
]

const LEVEL_OPTIONS = IMPORTED_LEVEL_OPTIONS

export default function CandidateProfile() {
    const toast = useToast()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<ProfileForm>({
        resolver: yupResolver(profileSchema),
        defaultValues: {
            fullname: "",
            email: "",
            cpf: "",
            birth_date: "",
            gender: "",
            phone: "",
            address: { cep: "", state: "", city: "", district: "", street: "" },
            resume: "",
            description: "",
            level: "",
        },
        mode: "onTouched",
    })

    const values = watch()

    // Simula autofill por CEP (substitua por sua integração real)
    function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
        const cep = (e.target.value || "").replace(/\D/g, "")
        if (cep.length === 8) {
            // Mock: apenas preenche campos vazios
            setValue("address.state", values.address.state || "CE")
            setValue("address.city", values.address.city || "Fortaleza")
            setValue("address.district", values.address.district || "Centro")
            setValue("address.street", values.address.street || "Av. Exemplo, 100")
        }
    }

    async function onSubmit(data: ProfileForm) {
        // Envie `data` ao backend — limpe máscaras antes
        // Aqui apenas simulamos sucesso
        await new Promise((r) => setTimeout(r, 800))
        toast({ title: "Perfil atualizado", status: "success" })
    }

    // ====== SUBCOMPONENTES ======
    const Section = ({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) => (
        <Card >
            <CardHeader>
                <Flex align="center" justify="space-between">
                    <Heading size="sm">{title}</Heading>
                    {right}
                </Flex>
            </CardHeader>
            <CardBody pt={0}>{children}</CardBody>
        </Card>
    )

    const HeaderProfile = () => (
        <Card >
            <CardBody>
                <Flex gap={4} direction="column">
                    <HStack>
                        <AvatarUploader
                            initialUrl={values.avatar_url}            // se tiver URL salva
                            onFileSelected={(file) => {
                                // se quiser só pré-selecionar (salvar depois)
                                // ex.: setValue("avatar_file", file)
                            }}
                            onUpload={async (file, signal) => {
                                // 1) montar FormData
                                const fd = new FormData();
                                fd.append("file", file);

                                // 2) enviar ao backend (ex.: /users/me/avatar)
                                // use fetch/axios com suporte a AbortController (signal)
                                // const { data } = await api.post("/users/me/avatar", fd, { signal });
                                // return data.url; // -> a URL final da imagem

                                // simulação:
                                await new Promise((r) => setTimeout(r, 1200));
                                return URL.createObjectURL(file); // troque pela URL do servidor
                            }}
                            size={128}                      // 96, 128, 160…
                            maxSizeMB={5}
                            accept="image/png,image/jpeg"
                        />
                        <VStack align="start">
                            <Heading size="md">{values.fullname || "Seu nome"}</Heading>
                            <Text color="gray.500">{values.email || "seu@email.com"}</Text>
                        </VStack>
                    </HStack>
                </Flex>
            </CardBody>
        </Card>
    )

    // ====== RENDER ======
    return (
        <Layout>
            <VStack align="stretch" spacing={6}>

                <Card bg="Background" w="full" boxShadow="xl" borderRadius={0} zIndex={1} pos="fixed" top="7px" right={0} display={{ base: "flex", md: "none" }} size="sm">
                    <CardBody alignItems="end" justifyContent="end" display="flex">
                        <Box >
                            <Button colorScheme="orange" isDisabled={!isDirty} isLoading={isSubmitting} onClick={handleSubmit(onSubmit)} w={{ base: "full", md: "auto" }}>
                                Salvar alterações
                            </Button>
                        </Box>
                    </CardBody>
                </Card>

                <HeaderProfile />


                {/* Informações pessoais */}
                <Section title="Informações pessoais">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <InputForm label="Nome" placeholder="Insira seu nome completo" type="text" {...register("fullname")} />
                        <InputForm label="Email" placeholder="seu@email.com" type="email" {...register("email")} />
                        <InputForm label="CPF" placeholder="000.000.000-00" type="text" {...register("cpf")} />
                        <InputForm label="Data de nascimento" placeholder="dd/mm/aaaa" type="date" {...register("birth_date")} />

                        {/* Gênero */}
                        <FormControl>
                            <FormLabel>Gênero</FormLabel>
                            <SelectForm
                                name="gender"
                                label=""
                                placeholder="Selecione"
                                options={GENDER_OPTIONS}
                                value={values.gender}
                                onChangeSelect={(opt: any) => {
                                    setValue("gender", opt?.value ?? "")
                                }}
                                errorMessage={errors.gender?.message as any}
                            />
                        </FormControl>

                        {/* Nível (exemplo) */}
                        <FormControl>
                            <FormLabel>Nível</FormLabel>
                            <SelectForm
                                name="level"
                                label=""
                                placeholder="Selecione o nível"
                                options={LEVEL_OPTIONS}
                                value={values.level}
                                onChangeSelect={(opt: any) => setValue("level", opt?.value ?? "")}
                                errorMessage={errors.level?.message as any}
                            />
                        </FormControl>
                    </SimpleGrid>
                </Section>

                {/* Contato */}
                <Section title="Contato">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <InputForm label="Telefone" placeholder="(00) 00000-0000" type="tel" {...register("phone")} />
                    </SimpleGrid>
                </Section>

                {/* Endereço */}
                <Section title="Endereço">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        <InputForm label="CEP" placeholder="00000-000" type="text" {...register("address.cep")} onBlur={handleCepBlur} />
                        <FormControl>
                            <FormLabel>Estado (UF)</FormLabel>
                            <SelectForm
                                name="state"
                                label=""
                                placeholder="UF"
                                options={UF_LIST.map((uf) => ({ value: uf, label: uf }))}
                                value={values.address.state}
                                onChangeSelect={(opt: any) => setValue("address.state", opt?.value ?? "")}
                                errorMessage={errors.address?.state?.message as any}
                            />
                        </FormControl>
                        <InputForm label="Cidade" placeholder="Sua cidade" type="text" {...register("address.city")} />
                        <InputForm label="Bairro" placeholder="Seu bairro" type="text" {...register("address.district")} />
                        <GridItem colSpan={{ base: 1, md: 2 }}>
                            <InputForm label="Endereço" placeholder="Rua/Av., número e complemento" type="text" {...register("address.street")} />
                        </GridItem>
                    </SimpleGrid>
                </Section>

                {/* Bio */}
                <Section title="Sobre você">
                    <Stack spacing={4}>
                        <Textarea
                            placeholder="Escreva aqui um resumo curto sobre você, resultados e objetivos (3–6 linhas)."
                            resize="vertical"
                            minH="120px"
                            maxLength={600}
                            {...register("resume")}
                        />
                        <TextareaForm
                            label="Descrição"
                            placeholder="Principais atividades, ênfases, projetos relevantes…"
                            minH="110px"
                            resize="vertical"
                            {...register("description")}
                            errorMessage={errors.description?.message as any}
                        />
                    </Stack>
                </Section>

                {/* Segurança */}
                <Section title="Segurança" right={<Text color="gray.500" fontSize="sm">Altere sua senha apenas se necessário</Text>}>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        <InputForm label="Senha atual" placeholder="********" type="password" {...register("current_password")} />
                        <InputForm label="Nova senha" placeholder="********" type="password" {...register("new_password")} />
                        <InputForm label="Confirmar nova senha" placeholder="********" type="password" {...register("confirm_password")} />
                    </SimpleGrid>
                    <CardFooter alignItems="center" justifyContent="center" px={0} pt={4}>
                        <HStack>
                            <Button colorScheme="orange" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>Atualizar perfil</Button>
                        </HStack>
                    </CardFooter>
                </Section>
            </VStack>
        </Layout>
    )
}
