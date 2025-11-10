import { Card, CardBody, Divider, Heading, Text } from "@chakra-ui/react";
import { ProfileEnum } from "../../../../types/selectionProcess.types";


interface LevelCardProps {
  title: string;
  text: string;
  value: ProfileEnum;
  onSelect: (value: ProfileEnum) => void;
  isActive: boolean;
}

export const ProfileSelect: React.FC<LevelCardProps> = ({
  title,
  text,
  value,
  onSelect,
  isActive,

  ...props
}) => {
  const handleClick = () => onSelect(value);
  return (
    <Card
      transition="all ease .4s"
      _hover={{ borderColor: "orange.500" }}
      cursor="pointer"
      boxShadow="md"
      size="sm"
      onClick={handleClick}
      pointerEvents={isActive ? "none" : "auto"}
      borderWidth={2}
      borderColor={isActive ? "orange.500" : "var(--border-emphasized)"}
      bg="var(--bg-muted) !important"
      {...props}
    >
      <CardBody
        flexDir="column"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color={isActive ? "orange.500" : ""} size="md">{title}</Heading>
        <Divider borderColor="var(--border-emphasized)" my={2} />
        <Text fontSize="sm" textAlign="center">
          {text}
        </Text>
      </CardBody>
    </Card>
  );
};
