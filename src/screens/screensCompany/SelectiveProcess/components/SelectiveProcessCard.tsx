import {
    Card,
    CardBody,
    CardHeader,
    Center,
    Flex,
    Heading,
    SimpleGrid,
    Text,
    Badge,
    HStack,
    VStack,
    Icon,

    Box,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, MapPin, FileText, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SelectionProcess } from "@/types/selectionProcess.types";

const MotionCard = motion.create ? motion.create(Card) : motion(Card);

type ProcessCardProps = {
    vaga: SelectionProcess;
};

export const SelectiveProcessCard: React.FC<ProcessCardProps> = ({ vaga }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    // Proteção contra dados nulos ou indefinidos
    if (!vaga || !vaga.id) {
        return null;
    }

    // Função para determinar a cor do status
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'green';
            case 'created': return 'blue';
            case 'paused': return 'yellow';
            case 'finished': return 'red';
            default: return 'gray';
        }
    };

    // Função para traduzir o status
    const getStatusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'Aberto';
            case 'created': return 'Criado';
            case 'paused': return 'Pausado';
            case 'finished': return 'Finalizado';
            default: return status;
        }
    };

    return (
        <MotionCard
            onClick={() => navigate(`/empresa/processo-seletivo/detalhes/${vaga.id}`)}
            cursor="pointer"
            bg="bg.surface"
            borderWidth="1px"
            borderColor={isHovered ? "primary.300" : "border"}
            overflow="hidden"
            position="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
                boxShadow: "lg"
            }}
            transition={{ duration: 0.3 }}
            _hover={{
                borderColor: "primary.300",
                transform: "translateY(-4px)"
            }}
            boxShadow="md"
        >
            {/* Linha superior colorida */}
            <Box
                h="4px"
                bg="primary.500"
                w="full"
            />

            <CardHeader pb={3}>
                <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex={1}>
                        <Heading size="md" noOfLines={2}>
                            {vaga.title}
                        </Heading>
                        {vaga.status && (
                            <Badge
                                colorScheme={getStatusColor(vaga.status)}
                                variant="subtle"
                                fontSize="xs"
                                px={2}
                                py={1}
                                borderRadius="md"
                            >
                                {getStatusLabel(vaga.status)}
                            </Badge>
                        )}
                    </VStack>

                    {/* Ícone PCD */}
                    {vaga.is_pcd && (
                        <Badge bg="primary" color="white" fontSize="sm">
                            <Icon as={Users} w={3} h={3} mr={1} />
                            PCD
                        </Badge>
                    )}
                </Flex>
            </CardHeader>

            <CardBody pt={0} pb={4}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={3}>
                    {/* Localização */}
                    <Center
                        p={3}
                        bg="bg.subtle"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        flexDirection="column"
                        minH="80px"
                    >
                        <HStack spacing={2} mb={1}>
                            <Icon as={MapPin} color="primary.500" size="sm" />
                            <Text fontSize="xs" fontWeight="semibold" color="text.muted">
                                Localidade
                            </Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium" textAlign="center" noOfLines={1}>
                            {vaga.city}, {vaga.state}
                        </Text>
                    </Center>

                    {/* Tipo de contrato */}
                    <Center
                        p={3}
                        bg="bg.subtle"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        flexDirection="column"
                        minH="80px"
                    >
                        <HStack spacing={2} mb={1}>
                            <Icon as={FileText} color="primary.500" size="sm" />
                            <Text fontSize="xs" fontWeight="semibold" color="text.muted">
                                Contrato
                            </Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium" textAlign="center" noOfLines={1}>
                            {vaga.contract_type}
                        </Text>
                    </Center>

                    {/* Data de criação */}
                    <Center
                        p={3}
                        bg="bg.subtle"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="border"
                        flexDirection="column"
                        minH="80px"
                        gridColumn={{ base: "1", sm: "1 / -1", md: "auto" }}
                    >
                        <HStack spacing={2} mb={1}>
                            <Icon as={Calendar} color="primary.500" size="sm" />
                            <Text fontSize="xs" fontWeight="semibold" color="text.muted">
                                Criado em
                            </Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium" textAlign="center">
                            {format(new Date(vaga.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </Text>
                    </Center>
                </SimpleGrid>
            </CardBody>

            {/* Seta animada no hover */}
            <motion.div
                style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : -10
                }}
                transition={{ duration: 0.2 }}
            >
                <Flex
                    align="center"
                    justify="center"
                    w="40px"
                    h="40px"
                    bg="orange.500"
                    borderRadius="full"
                    color="white"
                    boxShadow="lg"
                >
                    <Icon as={ChevronRight} w={5} h={5} />
                </Flex>
            </motion.div>

            {/* Overlay sutil no hover */}
            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(255,107,53,0.03) 0%, rgba(255,210,63,0.03) 100%)",
                    pointerEvents: "none",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </MotionCard>
    );
};

export default SelectiveProcessCard;
