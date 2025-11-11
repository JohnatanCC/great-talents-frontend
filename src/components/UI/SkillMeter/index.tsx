import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { levelToMiniBarCount } from "@/utils/levelMapping";

interface SkillMeterProps {
    name: string;
    level?: string;
    totalBars?: number;
}

/**
 * Componente para exibir habilidades e idiomas com mini barras de nível
 */
export const SkillMeter: React.FC<SkillMeterProps> = ({
    name,
    level,
    totalBars = 4
}) => {
    const activeBars = levelToMiniBarCount(level);

    return (
        <Box>
            <HStack justify="space-between" mb={2}>
                <Text fontWeight={600} fontSize="sm">{name}</Text>
                <Text fontSize="xs" color="muted">{level || "—"}</Text>
            </HStack>
            <HStack spacing={1.5}>
                {Array.from({ length: totalBars }).map((_, index) => (
                    <Box
                        key={index}
                        height="6px"
                        flex="1"
                        borderRadius="full"
                        bg={index < activeBars ? "brand.500" : useColorModeValue("gray.200", "gray.600")}
                        transition="all 0.2s"
                        _dark={{
                            bg: index < activeBars ? "brand.400" : "gray.600"
                        }}
                    />
                ))}
            </HStack>
        </Box>
    );
};

export default SkillMeter;