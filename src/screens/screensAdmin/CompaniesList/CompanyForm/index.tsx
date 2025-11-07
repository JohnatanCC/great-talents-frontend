import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"


import { useNavigate, useParams } from "react-router-dom"

// === Seus componentes reutilizados ===
import Layout from "@/Layout"
import AvatarUploader from "@/components/UI/AvatarUploader" // use o uploader moderno

// === Services & utils ===
import CompanyService from "@/services/CompanyService"
import { ufs } from "@/constants/states"
import { toastTemplate } from "@/templates/toast"

// === Tipos ===
import type { SelectOption } from "@/types/main.types"
import type { FormValuesNewCompany } from "@/types/companies.types"
import InputForm from "@/components/UI/InputForm"
import { SelectForm } from "@/components/UI/SelectForm"
import TextareaForm from "@/components/UI/TexareaForm"


/**
 * CompanyProfileForm — Layout de Perfil/Configurações para Empresa
 *
 * Visual inspirado na tela de Perfil do Candidato (cards em seções + header com avatar),
 * porém com os campos e regras de cadastro/edição de Empresa.
 */


const defaultValues: FormValuesNewCompany = {
  name: "",
  company_name: "",
  category: null as any,
  type: null as any,
  size: null as any,
  cnpj: "",
  email: "",
  description: "",
  cep: "",
  state: null as any,
  city: "",
  neighborhood: "",
  street: "",
  number: "",
  complement: "",
  photo: undefined as any,
}

export default function CompanyForm() {
  const toast = useToast()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)


  // Select options
  const [sizesOptions, setSizesOptions] = useState<SelectOption[]>([])
  const [typesOptions, setTypesOptions] = useState<SelectOption[]>([])
  const [categoriesOptions, setCategoriesOptions] = useState<SelectOption[]>([])
  const [loadingSelects, setLoadingSelects] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValuesNewCompany>({
    defaultValues,
    // resolver: yupResolver(validationNewCompanyForm),
    mode: "onTouched",
  })
  // Load selects
  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const [cats, types, sizes] = await Promise.all([
            CompanyService.getOptionsCategories(),
            CompanyService.getOptionsTypes(),
            CompanyService.getOptionsSize(),
          ])
          if (!mounted) return
          setCategoriesOptions(cats)
          setTypesOptions(types)
          setSizesOptions(sizes)
          setLoadingSelects(true)
        } catch (e) {
          toast(toastTemplate({ status: "error", title: "Erro ao carregar opções" }))
        }
      })()
    return () => {
      mounted = false
    }
  }, [toast])

  // Load company when editing
  useEffect(() => {
    let mounted = true
    if (loadingSelects && id) {
      ; (async () => {
        try {
          const company = await CompanyService.findOne(Number(id))
          if (!mounted) return

          const optionType = typesOptions.find((o) => Number(o.value) === Number(company.type_id))
          const optionCategory = categoriesOptions.find((o) => Number(o.value) === Number(company.category_id))
          const optionSize = sizesOptions.find((o) => Number(o.value) === Number(company.size_id))

          reset({
            name: company.name,
            company_name: company.company_name,
            category: optionCategory as any,
            type: optionType as any,
            size: optionSize as any,
            cnpj: company.cnpj,
            email: company.user?.email ?? "",
            description: company.description ?? "",
            state: (ufs.find((u) => u.value === company.state) as SelectOption) ?? null,
            city: company.city ?? "",
            neighborhood: company.neighborhood ?? "",
            number: company.number ?? "",
            complement: company.complement ?? "",
            cep: company.cep ?? "",
            street: company.street ?? "",
            photo: undefined as any,
          })
        } catch (e) {
          toast(toastTemplate({ status: "error", title: "Erro ao buscar dados da empresa" }))
        }
      })()
    }
    return () => {
      mounted = false
    }
  }, [loadingSelects, id, reset, toast, categoriesOptions, typesOptions, sizesOptions])

  // Submit
  const onSubmit: SubmitHandler<FormValuesNewCompany> = async (data) => {
    try {
      if (isEdit) {
        await CompanyService.update(data, Number(id))
        toast({ title: "Empresa atualizada com sucesso", status: "success" })
      } else {
        await CompanyService.create(data)
        toast({ title: "Nova empresa cadastrada com sucesso", status: "success" })
      }
      navigate("/admin/empresas")
    } catch (errors) {
      // mantém sua estrutura de tratamento
      toast(toastTemplate({ status: "error", description: (errors as any)?.response?.data?.message || "Erro ao salvar" }))
    }
  }

  // Subcomponentes visuais (mesmos padrões do perfil do candidato)
  const Section = ({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <Flex align="center" justify="space-between">
          <Heading size="sm">{title}</Heading>
          {right}
        </Flex>
      </CardHeader>
      <CardBody pt={0}>{children}</CardBody>
    </Card>
  )
  // Render
  return (
    <Layout>
      <Box as="form" id="company-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6}>

          {/* Logo da empresa */}
          <Section title="Logo da empresa">
            <Flex align="center" justify="center" w="100%">
              <Controller
                name="photo"
                control={control}
                render={({ field }) => (
                  <AvatarUploader
                    onFileSelected={(file: File) => field.onChange(file)}
                    ariaLabel="Selecionar logo da empresa"
                    size={150}
                  />
                )}
              />
              {errors.photo?.message && (
                <Text fontSize="sm" color="red.500" mt={2}>
                  {errors.photo.message}
                </Text>
              )}
            </Flex>
          </Section>

          {/* Informações da empresa */}
          <Section title="Informações da empresa">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <InputForm label="Nome" placeholder="Insira o nome da empresa" type="text" {...register("name")} errorMessage={errors.name?.message as any} />
              <InputForm label="Razão social" placeholder="Escreva a razão social" type="text" {...register("company_name")} errorMessage={errors.company_name?.message as any} />

              <Controller name="category" control={control} render={({ field }) => (
                <SelectForm {...field} label="Ramo da empresa" placeholder="Defina o ramo" options={categoriesOptions} onChangeSelect={(_: any, opt: any) => field.onChange(opt)} errorMessage={errors.category?.message as any} />
              )} />
              <Controller name="type" control={control} render={({ field }) => (
                <SelectForm {...field} label="Tipo de empresa" placeholder="Selecione o tipo" options={typesOptions} onChangeSelect={(_: any, opt: any) => field.onChange(opt)} errorMessage={errors.type?.message as any} />
              )} />

              <Controller name="size" control={control} render={({ field }) => (
                <SelectForm {...field} label="Tamanho da empresa" placeholder="Selecione" options={sizesOptions} onChangeSelect={(_: any, opt: any) => field.onChange(opt)} errorMessage={errors.size?.message as any} />
              )} />
              <InputForm label="CNPJ" placeholder="00.000.000/0000-00" {...register("cnpj")} errorMessage={errors.cnpj?.message as any} />

              <InputForm label="Email" placeholder="email@empresa.com" type="email" {...register("email")} errorMessage={errors.email?.message as any} isDisabled={isEdit} />
            </SimpleGrid>
          </Section>

          {/* Localização */}
          <Section title="Localização">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <InputForm label="CEP" placeholder="00000-000" {...register("cep")} errorMessage={errors.cep?.message as any} />
              <InputForm label="Logradouro" placeholder="Rua/Av." {...register("street")} errorMessage={errors.street?.message as any} />

              <Controller name="state" control={control} render={({ field }) => (
                <SelectForm {...field} label="Estado" placeholder="UF" options={ufs} onChangeSelect={(_: any, opt: any) => field.onChange(opt)} errorMessage={errors.state?.message as any} />
              )} />
              <InputForm label="Cidade" placeholder="Cidade" {...register("city")} errorMessage={errors.city?.message as any} />

              <InputForm label="Bairro" placeholder="Bairro" {...register("neighborhood")} errorMessage={errors.neighborhood?.message as any} />
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <InputForm label="Número" placeholder="Número" {...register("number")} />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 1 }}>
                <InputForm label="Complemento" placeholder="Apto, bloco, ref." {...register("complement")} />
              </GridItem>
            </SimpleGrid>
          </Section>

          {/* Descrição */}
          <Section title="Sobre a empresa">
            <Stack spacing={4}>
              <TextareaForm
                label="Descrição da empresa"
                placeholder="Escreva uma descrição sobre a empresa, suas atividades principais, missão e valores..."
                minH="120px"
                resize="vertical"
                maxLength={500}
                {...register("description")}
                errorMessage={errors.description?.message as any}
              />
            </Stack>
          </Section>


          <HStack>
            <Button
              colorScheme="orange"
              type="submit"
              form="company-form"
              isLoading={isSubmitting}
            >
              {isEdit ? "Atualizar empresa" : "Salvar empresa"}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/admin/empresas")}>Cancelar</Button>
          </HStack>

        </Stack>
      </Box>
    </Layout>
  )
}