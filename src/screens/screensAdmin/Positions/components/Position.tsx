import React from "react"
import {
  Flex,
  Text,
  Tooltip,
} from "@chakra-ui/react"

interface PositionProps {
  position: {
    id: number;
    name: string;
  };
}

const PositionCard: React.FC<PositionProps> = ({ position }) => {
  return (
    <Flex
      bg="surfaceSubtle"
      borderWidth="1px"
      borderColor="ring"
      borderRadius="md"
      p={3}
      align="center"
      justify="center"
      shadow="sm"
      _hover={{ shadow: "md", borderColor: "blue.300" }}
      transition="all 0.2s"
    >
      <Tooltip label={position.name} hasArrow>
        <Text fontWeight="medium" noOfLines={1} textAlign="center">
          {position.name}
        </Text>
      </Tooltip>
    </Flex>
  )
}

export default PositionCard
