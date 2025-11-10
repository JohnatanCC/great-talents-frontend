import { Button, CardBody, CardHeader, Heading, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Content from "../../../components/Content";
import { useNavigate } from "react-router-dom";
import { SelectionProcesses } from "../../../types/selectionProcess.types";
import { useEffect, useState } from "react";
import SelectionProcessService from "../../../services/SelectionProcessService";
import CustomIcon from "../../../components/CustomIcon";
import { Loader } from "../../../components/Loader";
import { SelectiveProcessCard } from "../components/SelectiveProcessCard";

const SelectiveProcess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // Estado para rastrear a aba ativa

  const [data, setData] = useState<SelectionProcesses>({
    created: [],
    open: [],
    finished: [],
    paused: []
  });

  useEffect(() => {
    SelectionProcessService.findAllByStatus().then((response) => {
      setData(response);
      setLoading(false);
    });
  }, []);

  // Função para obter o total de processos com base na aba ativa
  const getTotalProcesses = () => {
    switch (activeTab) {
      case 0:
        return data.open.length;
      case 1:
        return data.created.length;
      case 2:
        return data.paused.length;
      case 3:
        return data.finished.length;
      default:
        return 0;
    }
  };

  return (
    <Content>
      <CardHeader>
        <Heading textAlign="center" size="lg">
          Processos seletivos
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack
          flexWrap="wrap"
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Stack gap={4} alignItems="center" flexDir="row">
            <Heading as="h5" size="md">
              Total de processos seletivos:
            </Heading>
            <Heading
              padding={1}
              bg="var(--orange-muted)"
              borderRadius="md"
              borderColor="orange.500"
              borderWidth={1}
              minW="30px"
              textAlign="center"
              as="h5"
              size="md"
              color="orange.500"
            >
              {getTotalProcesses()}
            </Heading>
          </Stack>
          <Button
            onClick={() => navigate("/procesos-seletivos/novo")}
            colorScheme="orange"
          >
            <CustomIcon color="white" name="add" mr={2} />
            novo processso
          </Button>
        </Stack>

        <Tabs
          colorScheme="orange"
          my={4}
          variant="soft-rounded"
          onChange={(index) => setActiveTab(index)} // Atualiza a aba ativa
        >
          <Text display={{ base: "block", sm: "block", md: "none" }} color="var(--fg-info)" textAlign="center">(Arraste para a direta ou esquerda)</Text>
          <TabList overflow="auto" w={{ base: "full", sm: "full", md: "fit-content" }} borderWidth={1} borderColor="var(--border-emphasized)" defaultValue="salvos" bg="var(--bg-muted)" rounded="md" p="1">
            <Tab
              _selected={{
                rounded: "md",
                background: "var(--orange-muted)",
                color: "var(--orange-fg)"
              }}>Abertos
            </Tab>
            <Tab
              _selected={{
                rounded: "md",
                background: "var(--orange-muted)",
                color: "var(--orange-fg)"
              }}> Salvos
            </Tab>
            <Tab
              _selected={{
                rounded: "md",
                background: "var(--orange-muted)",
                color: "var(--orange-fg)"
              }}> Pausados
            </Tab>
            <Tab
              _selected={{
                rounded: "md",
                background: "var(--orange-muted)",
                color: "var(--orange-fg)"
              }}> Finalizados
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              {loading ? (
                <Loader />
              ) : data.open.length > 0 ? (
                <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} gap={4}>
                  {data.open.map((vaga, index) => (
                    <SelectiveProcessCard key={index} vaga={vaga} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text textAlign="center" mt={4} color="var(--gray-400)">
                  Nenhum dado registrado
                </Text>
              )}
            </TabPanel>
            <TabPanel px={0}>
              {loading ? (
                <Loader />
              ) : data.created.length > 0 ? (
                <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} gap={4}>
                  {data.created.map((vaga, index) => (
                    <SelectiveProcessCard key={index} vaga={vaga} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text textAlign="center" mt={4} color="var(--gray-400)">
                  Nenhum dado registrado
                </Text>
              )}
            </TabPanel>
            <TabPanel px={0}>
              {data.paused.map((vaga, index) => (
                <SelectiveProcessCard key={index} vaga={vaga} />
              ))}
            </TabPanel>
            <TabPanel px={0}>
              {loading ? (
                <Loader />
              ) : data.finished.length > 0 ? (
                <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} gap={4}>
                  {data.finished.map((vaga, index) => (
                    <SelectiveProcessCard key={index} vaga={vaga} />
                  ))}
                </SimpleGrid>
              ) : (
                <Text textAlign="center" mt={4} color="var(--gray-400)">
                  Nenhum dado registrado
                </Text>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Content>
  );
};

export default SelectiveProcess;
