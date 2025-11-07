import {
  Flex,
  Text,
  Tooltip,
} from "@chakra-ui/react"

interface TagCardProps {
  tag: { id: number; name: string }
}

const TagCard: React.FC<TagCardProps> = ({ tag }) => {
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
      <Tooltip hasArrow label={tag.name} fontSize="md">
        <Text fontWeight="medium" noOfLines={1} textAlign="center">
          {tag.name}
        </Text>
      </Tooltip>
    </Flex>
  )
}

export default TagCard
