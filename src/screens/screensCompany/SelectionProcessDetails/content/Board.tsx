import { useEffect, useMemo, useState } from "react";
import {
    Heading,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text,
    SimpleGrid,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    CardBody,
    Stack,
    Card,
    Avatar,
    VStack,
    Icon,
    Button,
    Link,
} from "@chakra-ui/react";
import BoardService from "@/services/BoardService";

// MOCK para BoardService.find (evita erro de filter em undefined)
const USE_MOCK = true;
if (USE_MOCK) {
    BoardService.find = async () => Promise.resolve({
        candidatos: [
            {
                name: "Ana Clara Nogueira",
                email: "ana@example.com",
                candidate_id: 1,
                url: "https://i.pravatar.cc/120?img=5",
                registration_candidate_id: "1",
                status: "Candidatos",
                contact: "5585988887777"
            }
            ,
            {
                name: "Bruno Silva Santos",
                email: "bruno@example.com",
                candidate_id: 2,
                url: "https://i.pravatar.cc/120?img=7",
                registration_candidate_id: "2",
                status: "Candidatos",
                contact: "5585988887778"
            },
            {
                name: "Carla Oliveira Lima",
                email: "carla@example.com",
                candidate_id: 3,
                url: "https://i.pravatar.cc/120?img=9",
                registration_candidate_id: "3",
                status: "Candidatos",
                contact: "5585988887779"
            },
            {
                name: "Diego Ferreira Costa",
                email: "diego@example.com",
                candidate_id: 4,
                url: "https://i.pravatar.cc/120?img=11",
                registration_candidate_id: "4",
                status: "Candidatos",
                contact: "5585988887780"
            }
        ],
        analises: [],
        propostas: [],
        entrevistas: [],
        avaliacoes: [],
        aprovados: [],
        reprovados: [],
        declinados: [],
    });
}
import { LucideMail, LucidePhone, LucideUser } from "lucide-react";
import SearchBar from "@/components/UI/SearchBar";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
const tabsOptions = [
    { label: "Candidatos", color: "var(--fg-subtle)", bg: "var(--bg-subtle)" },
    { label: "Análise", color: "var(--orange-fg)", bg: "var(--orange-subtle)" },
    { label: "Propostas", color: "var(--blue-fg)", bg: "var(--blue-subtle)" },
    { label: "Entrevistas", color: "var(--green-fg)", bg: "var(--green-subtle)" },
    { label: "Avaliações", color: "var(--purple-fg)", bg: "var(--purple-subtle)" },
    { label: "Aprovados", color: "var(--teal-fg)", bg: "var(--teal-subtle)" },
    { label: "Reprovados", color: "var(--red-fg)", bg: "var(--red-subtle)" },
    { label: "Declinados", color: "var(--fg-subtle)", bg: "var(--bg-subtle)" },
];

const opcoesMenuCandidatos = ["Análise", "Reprovado"];
const opcoesMenuAnalise = ["Proposta", "Reprovado"];
const opcoesMenuProposta = ["Entrevista", "Reprovado"];
const opcoesMenuEntrevista = ["Avaliação", "Reprovado"];
const opcoesMenuAvaliacao = ["Aprovado", "Reprovado"];

interface Candidate {
    name: string;
    email: string;
    candidate_id: number;
    url: string;
    registration_candidate_id: string;
    status: string;
    contact: string;
}

interface Candidates {
    candidatos: Candidate[];
    analises: Candidate[];
    propostas: Candidate[];
    entrevistas: Candidate[];
    avaliacoes: Candidate[];
    aprovados: Candidate[];
    reprovados: Candidate[];
    declinados?: Candidate[];
}

interface BoardProps {
    seletionProcessId: number;
    title: string;
}
export const Board = ({ seletionProcessId, title }: BoardProps) => {

    const [candidates, setCandidates] = useState<Candidates>({
        candidatos: [],
        analises: [],
        propostas: [],
        entrevistas: [],
        avaliacoes: [],
        aprovados: [],
        reprovados: [],
        declinados: [],
    });

    const [searchTerm, setSearchTerm] = useState("");

    const filteredCandidates = useMemo(() => {
        const filterByName = (candidatesArray: Candidate[]) =>
            candidatesArray.filter((candidate) =>
                candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

        return {
            candidatos: filterByName(candidates.candidatos),
            analises: filterByName(candidates.analises),
            propostas: filterByName(candidates.propostas),
            entrevistas: filterByName(candidates.entrevistas),
            avaliacoes: filterByName(candidates.avaliacoes),
            aprovados: filterByName(candidates.aprovados),
            reprovados: filterByName(candidates.reprovados),
            declinados: filterByName(candidates.declinados || []),
        };
    }, [candidates, searchTerm]);

    const handleProcessChange = (candidate: Candidate, option: string) => {
        if (option === "Análise") {
            BoardService.analise(candidate.candidate_id, seletionProcessId).then(() =>
                fetchData()
            );
        } else if (option === "Proposta") {
            BoardService.proposta(candidate.candidate_id, seletionProcessId).then(
                () => fetchData()
            );
        } else if (option === "Entrevista") {
            BoardService.conference(candidate.candidate_id, seletionProcessId).then(
                () => fetchData()
            );
        } else if (option === "Avaliação") {
            BoardService.avaliation(candidate.candidate_id, seletionProcessId).then(
                () => fetchData()
            );
        } else if (option === "Reprovado") {
            BoardService.reprove(candidate.candidate_id, seletionProcessId).then(() =>
                fetchData()
            );
        } else if (option === "Aprovado") {
            BoardService.aprovado(candidate.candidate_id, seletionProcessId).then(
                () => fetchData()
            );
        } else if (option === "Declinado") {
            BoardService.decline(candidate.candidate_id).then(
                () => fetchData()
            );
        }
    };

    const fetchData = () => {
        BoardService.find(seletionProcessId.toString()).then((data) => {
            setCandidates(data);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const rendeItem = (candidate: Candidate, options: string[]) => (
        <Card
            transition="all ease .4s"
            size="sm"
            borderColor="border"
            bg="surfaceSubtle"

        >
            <CardBody gap={2} display="flex" flexDir="row">
                <VStack>
                    <Avatar
                        src={candidate.url}
                        rounded="full"
                        boxSize={12}
                    />
                    {options.length > 0 && (
                        <Menu>
                            <MenuButton size="sm" as={Button}>
                                <Icon as={HamburgerIcon} />
                            </MenuButton>

                            <MenuList>
                                {options.map((processOption, idx) => (
                                    <MenuItem
                                        key={idx}
                                        onClick={() => handleProcessChange(candidate, processOption)}
                                    >
                                        {processOption}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    )}
                </VStack>

                <VStack overflow="hidden" maxW="full" alignItems="start">
                    <Link
                        alignItems="center" justifyContent="center" display="flex"
                        onClick={() =>
                            window.open(`/curriculo/${candidate.candidate_id}`, "_blank")
                        }
                    >
                        <Icon as={LucideUser} mr="2" />
                        {candidate.name}
                    </Link>

                    <Text alignItems="center" justifyContent="center" display="flex">
                        <Icon as={LucideMail} mr="2" />
                        {candidate.email}
                    </Text>

                    <Link
                        href={`https://api.whatsapp.com/send?phone=${candidate.contact}`}
                        target="_blank"
                    >
                        <Icon as={LucidePhone} mr="2" />
                        {candidate.contact}
                    </Link>
                </VStack>

            </CardBody>
        </Card>
    )

    return (
        <Stack gap={4}>
            <Stack>
                <Heading size="md" as="h3">
                    {title}
                </Heading>
            </Stack>
            <Stack>
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
            </Stack>

            <Tabs variant="enclosed"
                colorScheme="brand">
                <TabList >
                    {tabsOptions.map((process, index) => (
                        <Tab
                            key={index}>
                            {process.label}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels>
                    <TabPanel px={0}>
                        <Heading size="md" mb={4}>
                            Total: {filteredCandidates.candidatos.length}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3]} gap={4}>
                            {filteredCandidates.candidatos.map((candidate) =>
                                rendeItem(candidate, opcoesMenuCandidatos)
                            )}
                        </SimpleGrid>

                    </TabPanel>
                    <TabPanel px={0}>
                        <Heading size="md" mb={4}>
                            Total: {filteredCandidates.analises.length}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3]} gap={4}>
                            {filteredCandidates.analises.map((candidate) =>
                                rendeItem(candidate, opcoesMenuAnalise)
                            )}
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel px={0}>
                        <Heading size="md" mb={4}>
                            Total: {filteredCandidates.propostas.length}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3]} gap={4}>
                            {filteredCandidates.propostas.map((candidate) =>
                                rendeItem(candidate, opcoesMenuProposta)
                            )}
                        </SimpleGrid>
                    </TabPanel>

                    <TabPanel px={0}>
                        <Heading size="md" mb={4}>
                            Total: {filteredCandidates.entrevistas.length}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3]} gap={4}>
                            {filteredCandidates.entrevistas.map((candidate) =>
                                rendeItem(candidate, opcoesMenuEntrevista)
                            )}
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel px={0}>
                        <Heading size="md" mb={4}>
                            Total: {filteredCandidates.avaliacoes.length}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3]} gap={4}>
                            {filteredCandidates.avaliacoes.map((candidate) =>
                                rendeItem(candidate, opcoesMenuAvaliacao)
                            )}
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel px={0}>
                        <Heading size="md" mb={4}>
                            Total: {filteredCandidates.aprovados.length}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3]} gap={4}>
                            {filteredCandidates.aprovados.map((candidate) =>
                                rendeItem(candidate, [])
                            )}
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel px={0}>
                        <Heading size="md" mb={4}>
                            Total: {filteredCandidates.reprovados.length}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3]} gap={4}>
                            {filteredCandidates.reprovados.map((candidate) =>
                                rendeItem(candidate, [])
                            )}
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel px={0}>
                        <Heading size="md" mb={4}>
                            Total: {filteredCandidates.declinados?.length || 0}
                        </Heading>
                        <SimpleGrid columns={[1, 1, 3]} gap={4}>
                            {filteredCandidates.declinados?.map((candidate) =>
                                rendeItem(candidate, [])
                            )}
                        </SimpleGrid>
                    </TabPanel>
                </TabPanels>
            </Tabs>

        </Stack>
    );
};
