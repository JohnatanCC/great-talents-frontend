import React from "react";
import {
    Alert,
    AlertIcon,
    Avatar,
    Badge,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Code,
    Container,
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Kbd,
    Link,
    List,
    ListIcon,
    ListItem,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Progress,
    Radio,
    RadioGroup,
    Select,
    SimpleGrid,
    Skeleton,
    Spinner,
    Stack,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Switch,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Table,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tooltip,
    Tr,
    Tag,
    TagLabel,
    Text,
    useColorMode,
    useDisclosure,
    useToast,
    useToken,
} from "@chakra-ui/react";
import {
    AddIcon,
    CheckIcon,
    ChevronDownIcon,
    CloseIcon,
    InfoIcon,
    SearchIcon,
    SunIcon,
    MoonIcon,
    StarIcon,
} from "@chakra-ui/icons";

/**
 * Chakra UI – Página de Documentação (estilo guia oficial)
 *
 * • Componentes principais com variações úteis para 80% dos casos
 * • Seções: Tipografia, Cores, Botões, Formulários, Feedback, Exibição de dados,
 *   Navegação, Overlays, Layout e Boas práticas
 * • Sem dependências externas além de @chakra-ui/react e @chakra-ui/icons
 */

// ————————————————————————————————————————————————————————————
// Helpers de seção e navegação
// ————————————————————————————————————————————————————————————

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <Box id={id} pt={4}>
        <Heading size="lg" mb={3}>
            {title}
        </Heading>
        <Divider mb={5} />
        <Stack spacing={5}>{children}</Stack>
    </Box>
);

const TocLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} fontSize="sm" color="gray.600" _hover={{ color: "brand.600" }}>
        {children}
    </Link>
);

const Swatch = ({ name, value }: { name: string; value: string }) => (
    <Stack spacing={2} align="start">
        <Box
            w="full"
            h="56px"
            borderRadius="md"
            borderWidth="1px"
            bg={value}
        />
        <Text fontSize="sm" noOfLines={1}>
            <Code>{name}</Code>
        </Text>
        <Text fontSize="xs" color="gray.500">
            {value}
        </Text>
    </Stack>
);

// ————————————————————————————————————————————————————————————
// Página principal
// ————————————————————————————————————————————————————————————

export const Documentation: React.FC = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const toast = useToast();
    const modal = useDisclosure();
    const drawer = useDisclosure();

    // Paleta base para vitrine de cores (ajuste conforme seu theme)
    const colorTokens = [
        "brand.50",
        "brand.100",
        "brand.200",
        "brand.300",
        "brand.400",
        "brand.500",
        "brand.600",
        "brand.700",
        "brand.800",
        "brand.900",
        "gray.50",
        "gray.100",
        "gray.200",
        "gray.300",
        "gray.400",
        "gray.500",
        "gray.600",
        "gray.700",
        "gray.800",
        "gray.900",
        "blue.500",
        "green.500",
        "red.500",
        "purple.500",
        "teal.500",
    ] as const;
    const colorValues = useToken("colors", colorTokens as unknown as string[]);

    const onToast = () =>
        toast({ title: "Ação realizada", description: "Exemplo de toast de sucesso.", status: "success" });

    return (
        <Flex w="full" minH="100vh" bg="bg" color="text">
            {/* Sidebar / Sumário */}
            <Box
                as="nav"
                position="sticky"
                top={0}
                alignSelf="flex-start"
                display={{ base: "none", lg: "block" }}
                w="72"
                px={6}
                py={8}
                borderRightWidth="1px"
                minH="100vh"
            >
                <Stack spacing={3}>
                    <Heading size="sm" color="gray.600" mb={1}>
                        Conteúdo
                    </Heading>
                    <TocLink href="#overview">Visão Geral</TocLink>
                    <TocLink href="#typography">Tipografia</TocLink>
                    <TocLink href="#colors">Cores</TocLink>
                    <TocLink href="#buttons">Botões</TocLink>
                    <TocLink href="#forms">Formulários</TocLink>
                    <TocLink href="#feedback">Feedback</TocLink>
                    <TocLink href="#data-display">Exibição de Dados</TocLink>
                    <TocLink href="#navigation">Navegação</TocLink>
                    <TocLink href="#overlays">Overlays</TocLink>
                    <TocLink href="#layout">Layout</TocLink>
                    <TocLink href="#guidelines">Boas Práticas</TocLink>
                </Stack>
            </Box>

            {/* Conteúdo principal */}
            <Container maxW="6xl" py={10}>
                {/* Header */}
                <Flex align="center" justify="space-between" mb={6}>
                    <Stack spacing={1}>
                        <Heading>Documentação de Componentes</Heading>
                        <Text color="gray.600">
                            Guia prático e opinado para uso dos componentes principais do Chakra UI v2 no projeto Great Talents.
                        </Text>
                    </Stack>
                    <Button leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} variant="outline" onClick={toggleColorMode}>
                        {colorMode === "light" ? "Dark" : "Light"}
                    </Button>
                </Flex>

                {/* Visão Geral */}
                <Section id="overview" title="Visão Geral">
                    <Text>
                        Este guia cobre os componentes essenciais e suas variações recomendadas para construir interfaces consistentes e acessíveis. As
                        seções incluem exemplos funcionais, além de dicas de uso e padrões de composição.
                    </Text>
                    <Breadcrumb fontSize="sm">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">Início</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>Documentação</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Section>

                {/* Tipografia */}
                <Section id="typography" title="Tipografia">
                    <Stack spacing={4}>
                        <Heading>Heading – H1</Heading>
                        <Heading size="lg">Heading – LG</Heading>
                        <Heading size="md">Heading – MD</Heading>
                        <Heading size="sm">Heading – SM</Heading>
                        <Heading size="xs">Heading – XS</Heading>

                        <Text>
                            <b>Texto padrão</b> com ênfase, <Code>Code inline</Code> e atalhos com <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>.
                        </Text>
                        <Text color="subtle">Texto sutil para descrições e metadados.</Text>
                        <Link href="#" color="primary">Link com cor primária</Link>
                        <List spacing={2}>
                            <ListItem><ListIcon as={CheckIcon} color="green.500" /> Lista com ícones</ListItem>
                            <ListItem><ListIcon as={InfoIcon} color="blue.500" /> Elementos informativos</ListItem>
                        </List>
                    </Stack>
                </Section>

                {/* Cores */}
                <Section id="colors" title="Cores">
                    <Text>
                        Evite cores hardcoded nos componentes. Prefira tokens do tema (ex.: <Code>brand.500</Code>, <Code>gray.700</Code>). Abaixo uma vitrine
                        rápida de tokens comuns. Ajuste a paleta <Code>brand</Code> no seu <Code>theme</Code>.
                    </Text>
                    <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} gap={4}>
                        {colorTokens.map((token, i) => (
                            <Swatch key={token} name={token} value={colorValues[i]} />
                        ))}
                    </SimpleGrid>
                </Section>

                {/* Botões */}
                <Section id="buttons" title="Botões">
                    <Stack spacing={4}>
                        <ButtonGroup>
                            <Button leftIcon={<AddIcon />}>Primário</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                            <IconButton aria-label="Ação" icon={<StarIcon />} />
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button size="sm">sm</Button>
                            <Button size="md">md</Button>
                            <Button size="lg">lg</Button>
                            <Button isLoading loadingText="Carregando" />
                            <Button rightIcon={<ChevronDownIcon />}>Com ícone</Button>
                        </ButtonGroup>
                        <Alert status="info" borderRadius="md">
                            <AlertIcon /> Prefira <Code>variant</Code> e tokens ao invés de CSS inline; padronize tamanhos (sm, md, lg).
                        </Alert>
                    </Stack>
                </Section>

                {/* Formulários */}
                <Section id="forms" title="Formulários">
                    <Stack spacing={6}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                            <FormControl isRequired>
                                <FormLabel>Nome</FormLabel>
                                <Input placeholder="Maria da Silva" />
                            </FormControl>
                            <FormControl isInvalid>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" placeholder="email@exemplo.com" />
                                <FormErrorMessage>Email inválido</FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Busca</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <SearchIcon color="gray.400" />
                                    </InputLeftElement>
                                    <Input placeholder="Pesquisar…" />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Seleção</FormLabel>
                                <Select defaultValue="1">
                                    <option value="1">Opção A</option>
                                    <option value="2">Opção B</option>
                                    <option value="3">Opção C</option>
                                </Select>
                            </FormControl>
                        </SimpleGrid>

                        <Stack direction={{ base: "column", md: "row" }} spacing={6} align="start">
                            <Checkbox defaultChecked>Checkbox</Checkbox>
                            <RadioGroup defaultValue="b">
                                <Stack direction="row">
                                    <Radio value="a">A</Radio>
                                    <Radio value="b">B</Radio>
                                    <Radio value="c">C</Radio>
                                </Stack>
                            </RadioGroup>
                            <Stack direction="row" align="center">
                                <Switch defaultChecked />
                                <Text>Switch</Text>
                            </Stack>
                        </Stack>
                    </Stack>
                </Section>

                {/* Feedback */}
                <Section id="feedback" title="Feedback">
                    <Stack spacing={4}>
                        <Stack direction={{ base: "column", md: "row" }}>
                            <Alert status="success" borderRadius="md"><AlertIcon />Ação concluída com sucesso.</Alert>
                            <Alert status="warning" borderRadius="md"><AlertIcon />Atenção necessária.</Alert>
                            <Alert status="error" borderRadius="md"><AlertIcon />Ocorreu um erro.</Alert>
                            <Alert status="info" borderRadius="md"><AlertIcon />Informação útil.</Alert>
                        </Stack>

                        <Stack direction="row" align="center">
                            <Badge colorScheme="green">novo</Badge>
                            <Tag size="md" colorScheme="blue"><TagLabel>tag</TagLabel></Tag>
                            <Tooltip label="Dica contextual"><Button variant="outline">Hover</Button></Tooltip>
                            <Button onClick={onToast} variant="outline">Mostrar Toast</Button>
                        </Stack>

                        <Stack direction={{ base: "column", md: "row" }} align="center">
                            <Progress value={64} w="64" />
                            <Skeleton height="8" w="64" />
                            <Spinner />
                        </Stack>
                    </Stack>
                </Section>

                {/* Exibição de dados */}
                <Section id="data-display" title="Exibição de Dados">
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                        <Card>
                            <CardHeader>
                                <Heading size="sm">Resumo</Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack direction="row" spacing={6} align="center">
                                    <Avatar name="Ana Júlia" src="https://i.pravatar.cc/80?img=5" />
                                    <Stack spacing={0}>
                                        <Text fontWeight="semibold">Ana Júlia</Text>
                                        <Text fontSize="sm" color="gray.500">Engenheira de Dados</Text>
                                    </Stack>
                                </Stack>

                                <Stack direction={{ base: "column", sm: "row" }} spacing={8} mt={6}>
                                    <Stat>
                                        <StatLabel>Projetos</StatLabel>
                                        <StatNumber>12</StatNumber>
                                        <StatHelpText>+4 este mês</StatHelpText>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Clientes</StatLabel>
                                        <StatNumber>8</StatNumber>
                                        <StatHelpText>2 ativos</StatHelpText>
                                    </Stat>
                                </Stack>
                            </CardBody>
                        </Card>

                        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Nome</Th>
                                        <Th isNumeric>Score</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>Maria</Td>
                                        <Td isNumeric>92</Td>
                                        <Td><Badge colorScheme="green">ativo</Badge></Td>
                                    </Tr>
                                    <Tr>
                                        <Td>João</Td>
                                        <Td isNumeric>77</Td>
                                        <Td><Badge colorScheme="yellow">pendente</Badge></Td>
                                    </Tr>
                                    <Tr>
                                        <Td>Carla</Td>
                                        <Td isNumeric>65</Td>
                                        <Td><Badge colorScheme="red">inativo</Badge></Td>
                                    </Tr>
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Th>Total</Th>
                                        <Th isNumeric>234</Th>
                                        <Th></Th>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </Box>
                    </SimpleGrid>
                </Section>

                {/* Navegação */}
                <Section id="navigation" title="Navegação">
                    <Stack spacing={4}>
                        <Tabs variant="enclosed" colorScheme="brand">
                            <TabList>
                                <Tab>Geral</Tab>
                                <Tab>Equipe</Tab>
                                <Tab>Configurações</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel><Text>Conteúdo da aba Geral.</Text></TabPanel>
                                <TabPanel><Text>Conteúdo da aba Equipe.</Text></TabPanel>
                                <TabPanel><Text>Conteúdo da aba Configurações.</Text></TabPanel>
                            </TabPanels>
                        </Tabs>

                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>Menu</MenuButton>
                            <MenuList>
                                <MenuItem icon={<AddIcon />}>Novo</MenuItem>
                                <MenuItem icon={<CheckIcon />}>Validar</MenuItem>
                                <MenuItem icon={<CloseIcon />}>Arquivar</MenuItem>
                            </MenuList>
                        </Menu>
                    </Stack>
                </Section>

                {/* Overlays */}
                <Section id="overlays" title="Overlays">
                    <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                        {/* Modal */}
                        <>
                            <Button onClick={modal.onOpen}>Abrir Modal</Button>
                            <Modal isOpen={modal.isOpen} onClose={modal.onClose} isCentered>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Exemplo de Modal</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <Text>Conteúdo do modal.</Text>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button variant="ghost" mr={3} onClick={modal.onClose}>
                                            Cancelar
                                        </Button>
                                        <Button colorScheme="blue">Confirmar</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </>

                        {/* Drawer */}
                        <>
                            <Button variant="outline" onClick={drawer.onOpen}>Abrir Drawer</Button>
                            <Drawer isOpen={drawer.isOpen} placement="right" onClose={drawer.onClose} size="sm">
                                <DrawerOverlay />
                                <DrawerContent>
                                    <DrawerHeader>Barras laterais</DrawerHeader>
                                    <DrawerBody>
                                        <Text>Use o Drawer para navegação ou formulários rápidos.</Text>
                                    </DrawerBody>
                                </DrawerContent>
                            </Drawer>
                        </>
                    </Stack>
                </Section>

                {/* Layout */}
                <Section id="layout" title="Layout">
                    <Text>
                        Use <Code>Stack</Code> para espaçamento vertical/horizontal consistente, <Code>SimpleGrid</Code> para grades responsivas e
                        mantenha paddings/margens padronizados através de tokens de espaço.
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                        {[1, 2, 3].map((n) => (
                            <Box key={n} bg="gray.50" _dark={{ bg: "gray.800" }} borderWidth="1px" p={4} borderRadius="md">
                                <Text>Bloco #{n}</Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Section>

                {/* Boas práticas */}
                <Section id="guidelines" title="Boas Práticas">
                    <Stack spacing={3}>
                        <Text fontWeight="semibold">Faça (Do)</Text>
                        <List spacing={2}>
                            <ListItem><ListIcon as={CheckIcon} color="green.500" /> Prefira tokens (cores, espaçamento, radii) ao invés de valores fixos.</ListItem>
                            <ListItem><ListIcon as={CheckIcon} color="green.500" /> Centralize estilos no <Code>theme</Code> via <Code>components</Code> e <Code>semanticTokens</Code>.</ListItem>
                            <ListItem><ListIcon as={CheckIcon} color="green.500" /> Use props responsivas (ex.: <Code>px= base: 4, md: 8</Code>).</ListItem>
                            <ListItem><ListIcon as={CheckIcon} color="green.500" /> Padronize variantes e tamanhos (botões, inputs, cards).</ListItem>
                        </List>

                        <Text fontWeight="semibold">Evite (Don't)</Text>
                        <List spacing={2}>
                            <ListItem><ListIcon as={CloseIcon} color="red.500" /> CSS inline arbitrário que burla o design system.</ListItem>
                            <ListItem><ListIcon as={CloseIcon} color="red.500" /> Repetir padrões de UI sem criar componentes reutilizáveis.</ListItem>
                            <ListItem><ListIcon as={CloseIcon} color="red.500" /> Tamanhos/cores inconsistentes entre telas.</ListItem>
                        </List>
                    </Stack>
                </Section>

                <Divider my={8} />
                <Text fontSize="sm" color="gray.500">
                    Dica: coloque esta página atrás de uma rota <Code>/docs</Code> e use exemplos como base para seu Storybook.
                </Text>
            </Container>
        </Flex>
    );
};
