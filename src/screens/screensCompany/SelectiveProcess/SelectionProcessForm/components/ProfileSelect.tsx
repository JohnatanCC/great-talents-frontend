import type { ProfileEnum } from "@/types/selectionProcess.types";
import { Box, Card, CardBody, Divider, Heading, Text } from "@chakra-ui/react";
import { LucideBriefcase } from "lucide-react";

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
            cursor="pointer"
            _hover={{ filter: "brightness(0.90)" }}
            size="sm"
            onClick={handleClick}
            pointerEvents={isActive ? "none" : "auto"}
            borderColor={isActive ? "brand.500" : "ring"}
            bg={isActive ? "brandAlpha.300" : "surfaceSubtle"}
            {...props}
        >
            <Box
                position="absolute"
                top="-20px"
                left="50%"
                transform="translateX(-50%)"
                bg={isActive ? "brand.500" : "surface"}
                borderRadius="full"
                p={2}
                boxShadow="md"
            >
                <LucideBriefcase color={isActive ? "white" : "muted"} size="20px" />
            </Box>
            <CardBody
                flexDir="column"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Heading color={isActive ? "orange.500" : ""} size="md">{title}</Heading>
                <Divider borderColor={isActive ? "brand.500" : "ring"} my={2} />
                <Text fontSize="sm" textAlign="center">
                    {text}
                </Text>
            </CardBody>
        </Card>
    );
};
