/**
 * Retorna o colorScheme apropriado do Chakra UI baseado no nível de proficiência
 * Funciona para idiomas e softwares
 */
export const getLevelColorScheme = (level?: string): string => {
    const normalized = (level || "").toUpperCase();

    // Níveis básicos/iniciantes
    if (
        normalized.includes("BÁS") ||
        normalized.includes("BASI") ||
        normalized.includes("BASICO") ||
        normalized.includes("INIC") ||
        normalized.includes("BASIC")
    ) {
        return "gray";
    }

    // Nível intermediário
    if (normalized.includes("INTER")) {
        return "yellow";
    }

    // Nível avançado
    if (
        normalized.includes("AVAN") ||
        normalized.includes("ADVANCED")
    ) {
        return "purple";
    }

    // Fluente/Nativo/Expert
    if (
        normalized.includes("FLU") ||
        normalized.includes("NAT") ||
        normalized.includes("EXPERT")
    ) {
        return "green";
    }

    // Padrão
    return "blue";
};
