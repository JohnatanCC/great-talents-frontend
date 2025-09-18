// src/pages/admin/processes/components/SelectiveProcessCard.tsx
import React, { useState } from "react"
import {
    Card, CardHeader, CardBody, CardFooter,
    Heading, Text, Center, SimpleGrid, Flex,
    useColorModeValue,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { ChevronRightIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"

// Tipo mínimo usado no card
export type SelectionProcessDTO = {
    id: number
    title: string
    state: string
    city: string
    contract_type: string
    is_pcd?: boolean
    created_at: string // ISO
}

const MotionFlex = motion(Flex)

type Props = { vaga: SelectionProcessDTO }

const SelectiveProcessCard: React.FC<Props> = ({ vaga }) => {
    const navigate = useNavigate()
    const [hover, setHover] = useState(false)
    return (
        <Card
            onClick={() => navigate(`/empresa/processo-seletivo/detalhes/${vaga.id}`)}
            size="sm"
            cursor="pointer"
            position="relative"
            borderWidth="1px"
            borderColor="ring"
            bg="surfaceSubtle"
            borderRadius="lg"
            shadow="sm"
            transition="all .18s cubic-bezier(.4,0,.2,1)"
            _hover={{ transform: "translateY(-2px)", shadow: "md" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <CardHeader pb={2}>
                <Heading size="md" noOfLines={2}>{vaga.title}</Heading>
            </CardHeader>

            <CardBody pt={0}>
                <SimpleGrid columns={{ base: 1, sm: 3 }} gap={3}>
                    <Center bg="background" p={2} borderRadius="md" borderWidth="1px" flexDir="column">
                        <Heading size="xs">Localidade</Heading>
                        <Text color="muted" fontSize="sm">{vaga.state}/{vaga.city}</Text>
                    </Center>
                    <Center bg="background" p={2} borderRadius="md" borderWidth="1px" flexDir="column">
                        <Heading size="xs">Contrato</Heading>
                        <Text color="muted" fontSize="sm">{vaga.contract_type}</Text>
                    </Center>
                    <Center bg="background" p={2} borderRadius="md" borderWidth="1px" flexDir="column">
                        <Heading size="xs">Criada em</Heading>
                        <Text color="muted" fontSize="sm">
                            {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
                        </Text>
                    </Center>
                </SimpleGrid>
            </CardBody>

            <CardFooter pt={2}>
                {vaga.is_pcd && (
                    <Flex
                        position="absolute"
                        right={0}
                        top={0}
                        px={2}
                        py={1}
                        borderTopRightRadius="md"
                        borderBottomLeftRadius="md"
                        borderWidth={1}
                        borderColor="brand.500"
                        color="brand.600"
                        bg="brandAlpha.300"
                    >
                        <Text fontWeight="semibold" fontSize="sm">Vaga para PCD</Text>
                    </Flex>
                )}
            </CardFooter>

            {/* Chevron animado */}
            <MotionFlex
                align="center"
                justify="center"
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                my="auto"
                h="full"
                w={8}
                borderRadius="md"
                color="white"
                bg="brand.600"
                initial={{ opacity: 0, x: 12 }}
                animate={hover ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
            >
                <ChevronRightIcon />
            </MotionFlex>
        </Card>
    )
}

export default SelectiveProcessCard
