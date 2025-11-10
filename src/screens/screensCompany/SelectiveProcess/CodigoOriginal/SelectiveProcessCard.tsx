import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LuChevronsRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { SelectionProcess } from "../../../types/selectionProcess.types";


const MotionFlex = motion(Flex);

type ProcessCardProps = {
  vaga: SelectionProcess;
};


export const SelectiveProcessCard: React.FC<ProcessCardProps> = ({ vaga }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Card
      onClick={() =>
        navigate(`/processos-seletivos/visualizar-processo-seletivo/${vaga.id}`)
      }
      size="sm"
      cursor="pointer"
      _hover={{ borderColor: "orange.500" }}
      transition="all ease .4s"
      boxShadow="md"
      rounded="md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      bg="var(--bg-muted) !important"
      borderLeft="4px solid"
      borderColor="var(--border-emphasized)"
    >
      <CardHeader>
        <Heading size="md">{vaga.title}</Heading>
      </CardHeader>
      <CardBody flexDir="row" display="flex">
        <SimpleGrid w="full" gap={4} columns={{ base: 1, sm: 3, md: 3 }}>
          <Center
            p={2}
            borderRadius="md"
            flexDirection="column"
            bg="var(--bg-panel)"
            borderWidth={1}
            borderColor="var(--border-emphasized)"
          >
            <Heading textAlign="center" size="sm">
              Localidade:
            </Heading>
            <Text color="fg.subtle">
              {vaga.state}/{vaga.city}
            </Text>
          </Center>
          <Center
            p={2}
            borderRadius="md"
            flexDirection="column"
            bg="var(--bg-panel)"
            borderWidth={1}
            borderColor="var(--border-emphasized)"
          >
            <Heading textAlign="center" size="sm">
              Tipo de contrato:
            </Heading>
            <Text color="fg.subtle">
              {vaga.contract_type}
            </Text>
          </Center>
          <Center
            p={2}
            borderRadius="md"
            flexDirection="column"
            bg="var(--bg-panel)"
            borderWidth={1}
            borderColor="var(--border-emphasized)"
          >
            <Heading textAlign="center" size="sm">
              Tipo de contrato:
            </Heading>
            <Text color="fg.subtle">
              {format(new Date(vaga.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </Text>
          </Center>
        </SimpleGrid>
      </CardBody>

      <CardFooter mt={2}>
        {vaga.is_pcd && (
          <Flex
            bottom="0"
            right="0"
            padding={2}
            borderBottomRightRadius="md"
            borderRight="1px solid"
            borderBottom="1px solid"
            borderColor="orange.500"
            position="absolute"
            alignItems="center"
            color="orange.500"
            gap={2}
          >
            <Text fontWeight="bold">Vaga para pcd</Text>
          </Flex>
        )}
      </CardFooter>
      <MotionFlex
        height="full"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        boxShadow="lg"
        borderWidth={1}
        borderColor="var(--border-emphasized)"
        p={2}
        _hover={{
          bg: "var(--orange-subtle)",
          borderColor: "orange.500",
          color: "orange.500",
        }}
        bg="orange.500"
        color="white"
        initial={{ opacity: 0, x: 20 }}
        animate={
          isHovered
            ? { opacity: 1, x: 0, transition: { delay: 0.4 } }
            : { opacity: 0, x: 20, transition: { delay: 0.4 } }
        }
        position="absolute"
        right={0}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <LuChevronsRight />
      </MotionFlex>
    </Card>
  );
};
