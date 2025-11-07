import {
  Flex,
  Text,
  Tooltip,
} from "@chakra-ui/react"

export type Benefit = { id: number; description: string }

export type BenefitCardProps = {
  benefit: Benefit
}

export default function BenefitCard({ benefit }: BenefitCardProps) {
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
      <Tooltip hasArrow label={benefit.description}>
        <Text noOfLines={1} fontWeight="medium" textAlign="center">
          {benefit.description}
        </Text>
      </Tooltip>
    </Flex>
  )
}
