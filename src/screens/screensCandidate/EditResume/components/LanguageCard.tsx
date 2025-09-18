import {
    Badge,
    Card,
    CardHeader,
    Flex,
    Heading,
    HStack,
    IconButton,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import CandidateLanguageService from "../../../../services/Candidate/CandidateLanguageService";
import { toastTemplate } from "../../../../templates/toast";
import type { LanguageState } from "@/types/language.types";

interface LanguageCardProps {
    language: LanguageState;
    refresh: VoidFunction;
}

const levelColor = (lvl?: string) => {
    const v = (lvl || "").toUpperCase();
    if (v.includes("BÁS") || v.includes("BASI") || v.includes("BASICO")) return "gray";
    if (v.includes("INTER")) return "yellow";
    if (v.includes("AVAN")) return "purple";
    if (v.includes("FLU") || v.includes("NAT")) return "green";
    return "secondary";
};

export const LanguageCard: React.FC<LanguageCardProps> = ({ language, refresh }) => {
    const toast = useToast();
    const border = useColorModeValue("stone.200", "stone.800");
    const surf = useColorModeValue("surface", "surface");

    const handleDelete = async () => {
        try {
            await CandidateLanguageService.delete(language.id);
            toast(
                toastTemplate({
                    description: "Idioma deletado com sucesso",
                    status: "success",
                })
            );
            refresh();
        } catch {
            toast(
                toastTemplate({
                    description: "Erro ao deletar idioma",
                    status: "error",
                })
            );
        }
    };

    return (
        <Card
            size="sm"
            bg={surf}
            borderWidth="1px"
            borderColor={border}
            _hover={{ boxShadow: "md" }}
            transition="box-shadow 0.15s ease"
        >
            <CardHeader py={3}>
                <HStack align="start" justify="space-between">
                    <Flex direction="column" minW={0}>
                        <Heading size="sm" noOfLines={1}>
                            {language.name}
                        </Heading>
                        <Badge
                            mt={1}
                            colorScheme={levelColor(language.level)}
                            variant="subtle"
                            alignSelf="flex-start"
                            textTransform="none"
                            fontWeight="600"
                        >
                            {language.level}
                        </Badge>
                    </Flex>

                    <HStack spacing={2}>
                        <IconButton
                            aria-label="Excluir idioma"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            variant="solid"
                            onClick={handleDelete}
                        />
                        <IconButton
                            aria-label="Editar idioma"
                            icon={<EditIcon />}
                            size="sm"
                            variant="outline"
                            isDisabled
                        />
                    </HStack>
                </HStack>
            </CardHeader>
        </Card>
    );
};
