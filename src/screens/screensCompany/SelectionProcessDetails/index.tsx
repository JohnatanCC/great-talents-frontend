import Content from "@/components/UI/Content";
import Layout from "@/Layout";
import SelectionProcessService from "@/services/SelectionProcessService";
// ===== MOCK SETUP =====
const USE_MOCK = true;
const mockSelectionProcess = {
    id: 1,
    title: "Atendente de loja",
    description: "Processo seletivo para atendente de loja em Fortaleza.",
    status: "OPEN",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile: "OPERATIONAL",
    contract_type: "CLT",
    work_modality: "TEMPO_INTEGRAL",
    education: "ENSINO_MEDIO_COMPLETO",
    position_id: 1,
    salary_range: "R$ 1.500 - R$ 2.000",
    state: "CE",
    city: "Fortaleza",
    is_pcd: false,
    with_video: false,
    created_by: 1,
    updated_by: 1,
    selection_process_benefits: [],
    selection_process_tags: [],
    selection_process_requirements: [],
    position: { id: 1, name: "Atendente de loja" },
    user_company: {
        id: 1,
        company_id: "1",
        user_id: "1",
        user: { id: 1, name: "Empresa Exemplo" },
    },
};

// Monkey patch do service para mock
if (USE_MOCK) {
    SelectionProcessService.findOne = async (id) => Promise.resolve({ ...mockSelectionProcess, id: Number(id) });
    SelectionProcessService.updateStatus = async () => Promise.resolve();
}
import { toastTemplate } from "@/templates/toast";
import type { SelectionProcess } from "@/types/selectionProcess.types";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Card, CardBody, CardHeader, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Board } from "./content/Board";
import Loader from "@/components/UI/Loader";

export const SelectionProcessDetails = () => {
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const toast = useToast();

    const [currentSelectionProcess, setCurrentSelectionProcess] =
        useState<SelectionProcess | null>(null);

    const handleChangeStatus = (value: string) => {
        SelectionProcessService.updateStatus(Number(params.id), value)
            .then(() => {
                toast(
                    toastTemplate({
                        status: "success",
                        title: "Status atualizado com sucesso",
                    })
                );
            })
            .catch(() => {
                toastTemplate({ status: "error", title: "Erro ao atualizar status" });
            });
    };
    const optionsStatus = [
        { label: "Abrir o processo seletivo", value: "OPEN" },
        { label: "Pausar o processo seletivo", value: "PAUSED" },
        { label: "Finalizar o processo seletivo", value: "FINISHED" },
    ];


    const getSelectionProcess = () => {
        if (params.id) {
            SelectionProcessService.findOne(params.id).then((response) => {
                setCurrentSelectionProcess(response);
            });
        }
    };

    useEffect(() => {
        if (params.id) {
            getSelectionProcess();
        }
    }, [params.id]);
    return (
        <Layout>
            <Content>

                <CardHeader display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ base: "column", md: "row" }} gap={4}>
                    <Heading size="md">Detalhes do Processo Seletivo</Heading>
                    <HStack>
                        <Menu>
                            <MenuButton colorScheme="orange" as={Button} rightIcon={<ChevronDownIcon />}>
                                Status do processo
                            </MenuButton>
                            <MenuList>
                                {optionsStatus.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        onClick={() => handleChangeStatus(option.value)}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </MenuList>{ }
                        </Menu>
                        <Button onClick={() => navigate(`/empresa/processo-seletivo/editar/${params.id}`)} colorScheme="blue" variant="outline">Editar</Button>
                    </HStack>
                </CardHeader>
                <CardBody >
                    {currentSelectionProcess ? (
                        <Board
                            title={currentSelectionProcess.title}
                            seletionProcessId={Number(params.id)}
                        />
                    ) : (
                        <Loader />
                    )}
                </CardBody>

            </Content>
        </Layout>
    );
};
