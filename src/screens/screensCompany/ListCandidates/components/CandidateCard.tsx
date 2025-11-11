// src/pages/admin/candidates/components/CandidateCard.tsx
import React, { useState } from "react"
import {
    Avatar,
    Card,
    CardBody,
    Flex,
    Heading,
    Stack,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { ChevronRightIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"
import { formatAge } from "@/utils/calculateAge"

const MotionFlex = motion(Flex)

export type CandidateDTO = {
    id: number
    name: string
    email: string
    cpf: string
    contact: string
    date_birth: string
    genre: "M" | "F"
    cep: string
    city: string
    neighborhood: string
    number: string
    street: string
    state: string
    file?: { id: number; url: string }
}

type Props = { candidate: CandidateDTO }

const CandidateCard: React.FC<Props> = ({ candidate }) => {
    const navigate = useNavigate()
    const [hover, setHover] = useState(false)
    return (
        <Card
            onClick={() => navigate(`/curriculo/${candidate.id}`)}
            cursor="pointer"
            position="relative"
            size="sm"
            borderColor="border"
            bg="surfaceSubtle"
            borderRadius="md"
            shadow="sm"
            _hover={{ transform: "translateY(-2px)", shadow: "md" }}
            transition="all .18s cubic-bezier(.4,0,.2,1)"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <CardBody
                display="flex"
                gap={4}
                position="relative"
            >
                <Avatar src={candidate.file?.url || ""} name={candidate.name} bg="white" boxSize={12} borderRadius="md" />
                <Stack gap={0} minW={0}>
                    <Heading size="sm" noOfLines={1}>{candidate.name}</Heading>
                    <Heading size="xs" color="muted" noOfLines={1}>
                        {candidate.city} - {candidate.state}
                    </Heading>
                    <Heading size="xs" color="muted" noOfLines={1}>
                        {formatAge(candidate.date_birth)}
                    </Heading>
                </Stack>
            </CardBody>

            {/* chevron animado */}
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
                color="orange"
                bg="InactiveCaption"
                initial={{ opacity: 0, x: 12 }}
                animate={hover ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
            >
                <ChevronRightIcon />
            </MotionFlex>
        </Card>
    )
}

export default CandidateCard
