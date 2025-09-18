import React, { memo, useMemo } from "react";
import {
    Avatar,
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    Stack,
    Text,
    Divider,
    Box,
    HStack,
} from "@chakra-ui/react";
import { ArrowRight, DollarSign, MapPin, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { StateSelectionProcessOpen } from "@/types/selectionProcessOpen.types";

// TODO: troque por sua função real
const translate = (key: string) => key;

interface OpportunitieCardProps {
    vaga: StateSelectionProcessOpen;
}

const currency = (value?: string | number) => {
    if (value === undefined || value === null || value === "") return "";
    const num =
        typeof value === "number"
            ? value
            : Number(String(value).replace(/[^\d.,-]/g, "").replace(",", "."));
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const OpportunitieCard: React.FC<OpportunitieCardProps> = memo(({ vaga }) => {
    const navigate = useNavigate();

    const place = useMemo(() => {
        const parts = [vaga?.neighborhood, vaga?.city, vaga?.state].filter(Boolean);
        return parts.join(" / ");
    }, [vaga]);

    const hasSalary = !!vaga.show_salary && !!vaga.salary;

    return (
        <Card
            bg="surfaceSubtle"
            size="sm"
            h="full"
            _hover={{ boxShadow: "lg", transform: "translateY(-3px)", borderColor: "orange.500" }}
            transition="all 0.2s ease"
            position="relative"
        >
            <CardHeader>
                <Flex align="center" gap={3}>
                    <Avatar
                        boxSize={12}
                        borderRadius="md"
                        borderWidth={2}
                        src={vaga?.company?.photo}
                        name={vaga?.company?.name}
                    />
                    <Box minW={0}>
                        <Heading as="h4" size="sm" noOfLines={1} color="primary">
                            {vaga.title}
                        </Heading>
                        <Text mt={1} color="fg.subtle" fontSize="sm" noOfLines={1}>
                            {vaga?.company?.name}
                        </Text>
                    </Box>
                </Flex>
            </CardHeader>

            <CardBody>
                <Stack gap={3}>

                    <HStack spacing={2} align="center">
                        <MapPin size={18} />
                        <Minus size={16} />
                        <Text textTransform="uppercase" fontSize="sm" noOfLines={1}>
                            {place || "—"}
                        </Text>
                    </HStack>

                    {hasSalary && (
                        <HStack spacing={2} align="center">
                            <DollarSign size={18} />
                            <Minus size={16} />
                            <Text textTransform="uppercase" fontSize="sm">
                                Salário até {currency(vaga.salary)}
                            </Text>
                        </HStack>
                    )}

                    <Divider />

                    <HStack gap={2} wrap="wrap">
                        <Badge px={2} py={1} colorScheme="orange">
                            <Text textTransform="uppercase" fontSize="xs" fontWeight="semibold">
                                {translate(vaga.profile)}
                            </Text>
                        </Badge>
                        {vaga.is_pcd && (
                            <Badge px={2} py={1} colorScheme="blue">
                                <Text textTransform="uppercase" fontSize="xs" fontWeight="semibold">
                                    Vaga para PCD
                                </Text>
                            </Badge>
                        )}
                    </HStack>
                </Stack>
            </CardBody >

            <CardFooter>
                <Button
                    w="full"
                    size="sm"
                    colorScheme="orange"
                    rightIcon={<ArrowRight size={18} />}
                    onClick={() => navigate(`/candidato/ver-vagas/visualizar-vaga/${vaga.id}`)}
                >
                    Ver detalhes
                </Button>
            </CardFooter>
        </Card >
    );
});

OpportunitieCard.displayName = "OpportunitieCard";
export default OpportunitieCard;